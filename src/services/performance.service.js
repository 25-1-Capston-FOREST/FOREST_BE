import axios from 'axios';
import { prisma } from '../db.config.js';
import dayjs from 'dayjs';
import {
  deleteEndedPerformancesWithActivity,
} from '../repositories/performance.repository.js';
import { fetchPerformanceIdList, fetchPerformanceDetail } from '../utils/kopisClient.js';
import { config } from 'dotenv';
import { parseStringPromise } from 'xml2js';

config();

const parseKopisXmlToJson = async (xml) => {
  try {
    const result = await parseStringPromise(xml, { explicitArray: false });
    return result?.dbs || result;
  } catch (error) {
    console.error('❌ XML 파싱 실패:', error.message);
    return null;
  }
};

export const updatePerformances = async () => {
  try {
    const today = dayjs();
    const stdate = today.subtract(2, 'week').format('YYYYMMDD'); 
    const eddate = today.add(3, 'week').format('YYYYMMDD');
    const region = 11;

    let currentPage = 1;
    const rows = 100;
    const MAX_PAGE = 5;
    let hasMore = true;
    let allPerformances = [];

        // ✅ 공연완료 + ACTIVITY 삭제
        await deleteEndedPerformancesWithActivity();
        console.log("끝난 공연 삭제완료!");

    // 📥 전체 공연 목록 페이징으로 가져오기
    while (hasMore && currentPage <= MAX_PAGE) {
      const listResponse = await fetchPerformanceIdList(stdate, eddate, region, currentPage, rows);
      const jsonList = await parseKopisXmlToJson(listResponse);
      
      let performanceArray = [];
      if (jsonList?.db) {
        performanceArray = Array.isArray(jsonList.db) ? jsonList.db : [jsonList.db];
        performanceArray = performanceArray.filter(item => item); // undefined/null 제거
      }

      if (performanceArray.length === 0) {
        hasMore = false;
        break;
      }

      allPerformances.push(...performanceArray);
      console.log(`📄 페이지 ${currentPage}에서 ${performanceArray.length}개 불러옴`);

      currentPage++;
    }

    console.log(`🎫 총 ${allPerformances.length}개의 공연 데이터 수집 완료`);


    let savedCount = 0;

    for (const perf of allPerformances) {
      if (!perf || !perf.mt20id) continue;
      const id = perf.mt20id;
      if (!id) continue;
    
      const detailResponse = await fetchPerformanceDetail(id);
      const jsonDetail = await parseKopisXmlToJson(detailResponse);
      const detail = jsonDetail.db;
      if (!detail || !detail.mt20id) {
        console.warn(`⚠️  상세정보 없음 또는 mt20id 누락된 공연 스킵 (${id})`);
        continue;
      }

      // 🔍 PERFORMANCE 중복 체크
      const existingPerformance = await prisma.pERFORMANCE.findUnique({
        where: { performance_cd: detail.mt20id },
      });
      if (existingPerformance) {
        console.log(`⚠️  중복 공연(${detail.mt20id}) 스킵`);
        continue;
      }

      const status = detail.prfstate || '알수없음';
      if (!['공연중', '공연예정'].includes(status)) continue;

      // 🔗 예매처 링크 파싱
      let reservations = [];

      try {
        const relateObj = detail.relates?.relate;

        if (relateObj) {
          // relate가 배열일 수도 있고, 단일 객체일 수도 있음
          if (Array.isArray(relateObj)) {
            for (const item of relateObj) {
              const name = item.relatenm || '이름 없음';
              const url = item.relateurl || '';
              reservations.push({ name, url });
            }
          } else if (typeof relateObj === 'object') {
            const name = relateObj.relatenm || '이름 없음';
            const url = relateObj.relateurl || '';
            reservations.push({ name, url });
          }
        }
      } catch (e) {
        console.warn('❌ relates 파싱 중 오류:', e.message);
      }

      const joinedLinks = reservations.map(r => `${r.name}: ${r.url}`).join(' | ') || null;




      // 🎭 ACTIVITY 생성
      const activity = await prisma.aCTIVITY.create({
        data: {
          activity_type: 'PERFORMANCE',
        },
      });

      // 🎟️ PERFORMANCE 생성
      await prisma.pERFORMANCE.create({
        data: {
          title: detail.prfnm,
          performance_cd: detail.mt20id,
          image_url: detail.poster || null,
          start_date: detail.prfpdfrom || null,
          end_date: detail.prfpdto || null,
          time: detail.dtguidance || null,
          location: detail.fcltynm || null,
          region: detail.area || null,
          cast: detail.prfcast || null,
          runtime: detail.prfruntime || null,
          story: detail.sty || null,
          cost: detail.pcseguidance || null,
          genre: detail.genrenm || null,
          link: joinedLinks,
          activity_id: activity.activity_id,
          status: status,
        },
      });

      savedCount++;
    }

    console.log(`✅ ${savedCount}개의 공연이 저장되었습니다.`);
  } catch (error) {
    console.error('❌ 공연 정보 업데이트 중 오류 발생:', error.message);
  }
};
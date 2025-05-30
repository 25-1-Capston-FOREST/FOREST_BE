import axios from 'axios';
import dotenv from 'dotenv';
import { updateItemCoordinates, getItemsWithoutCoordinates, getLocationById } from '../repositories/location.repository.js';
dotenv.config();

const KAKAO_API_KEY = process.env.KAKAO_API_KEY;

const getCoordinates = async (keyword) => {
  try {
    // encodeURIComponent 제거 (axios가 자동 인코딩 처리)
    const res = await axios.get(
      'https://dapi.kakao.com/v2/local/search/keyword.json',
      {
        params: { query: keyword },
        headers: {
          Authorization: `KakaoAK ${KAKAO_API_KEY}`,
        },
      }
    );

    const document = res.data.documents[0];
    if (document) {
      return {
        latitude: parseFloat(document.y),
        longitude: parseFloat(document.x),
      };
    }

    return null;
  } catch (error) {
    console.error(`키워드 검색 실패 (${keyword}):`, error.response?.data || error.message);
    return null;
  }
};

export const updateAllCoordinates = async () => {
  console.log('📍 공연/전시 좌표 업데이트 스케줄러 시작');
  const data = await getItemsWithoutCoordinates();

  if (!data) {
    console.error('❌ getItemsWithoutCoordinates에서 데이터가 없습니다.');
    return;
  }

  for (const table of ['performance', 'exhibition']) {
  const items = data[table];
  console.log(`[${table}] 처리할 아이템 개수: ${items.length}`);

  for (const item of items) {
    let keyword = item.city ? `${item.city} ${item.location}` : `서울 ${item.location}`;
    if (keyword.length > 100) keyword = keyword.slice(0, 100);

    console.log(`→ [${table}] "${keyword}" 좌표 검색 시작`);

    const coords = await getCoordinates(keyword);

    if (!coords) {
      console.warn(`→ [${table}] "${keyword}" 좌표 검색 실패`);
      continue;
    }

    console.log(`→ [${table}] "${keyword}" 좌표 검색 성공: 위도 ${coords.latitude}, 경도 ${coords.longitude}`);

    // 테이블에 따라 PK 다름
    const id = table === 'performance' ? item.performance_id : item.exhibition_id;

    if (!id) {
      console.warn(`→ [${table}] "${keyword}" 고유키(id)가 없어 업데이트 불가`);
      continue;
    }

    try {
      await updateItemCoordinates(table, id, coords.latitude, coords.longitude);
      console.log(`→ [${table}] ${item.location} → 위경도 업데이트 완료`);
    } catch (dbError) {
      console.error(`→ [${table}] DB 업데이트 실패:`, dbError.message);
    }
  }
}


  console.log('✅ 좌표 업데이트 스케줄러 완료');
};

export const getLocation = async (id) => {
  const result = await getLocationById(id);
  return result;
}
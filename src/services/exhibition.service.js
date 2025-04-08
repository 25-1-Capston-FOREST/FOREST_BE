import { fetchExhibitionList, fetchExhibitionDetail } from '../utils/exhibitionAPI.js';
import { findExhibitionByTitleAndStartDate, createExhibition, deletePastExhibitions } from '../repositories/exhibition.repository.js';

function convertToDate(num) {
  const str = num.toString();
  return new Date(`${str.slice(0, 4)}-${str.slice(4, 6)}-${str.slice(6, 8)}`);
}

export async function syncExhibitions(from, to) {
  let page = 1;
  const pageSize = 100;

  console.log(`[syncExhibitions] from=${from}, to=${to} 시작`);

  try {
    while (true) {
      console.log(`[syncExhibitions] page ${page} 요청 중...`);
      const list = await fetchExhibitionList(from, to, page, pageSize);
      console.log(`[API 응답] page ${page}에서 ${list.length}건 수신`);
      console.log(`[요청 URL] from=${from}, to=${to}, page=${page}, pageSize=${pageSize}`);

      if (!list || list.length === 0) {
        console.log(`[syncExhibitions] 더 이상 데이터 없음, 종료`);
        break;
      }

      console.log(`[syncExhibitions] 받아온 전시 수: ${list.length}`);

      for (const item of list) {
        try {

          const exists = await findExhibitionByTitleAndStartDate(item.title, item.startDate);
          if (exists) {
            console.log(`[중복] ${item.title} (${item.startDate})`);
            continue;
          }

          const detail = await fetchExhibitionDetail(item.seq);
          if (!detail) {
            console.warn(`[누락] 상세정보 없음: ${item.title}`);
            continue;
          }

          const exhibitionData = {
            title: detail.title,
            start_date: convertToDate(detail.startDate),
            end_date: convertToDate(detail.endDate),
            location: detail.place,
            area: detail.area,
            price: detail.price || '',
            contents: detail.contents1 || '',
            url: detail.url || '',
            image_url: detail.imgUrl || ''
          };

          await createExhibition(exhibitionData);
          console.log(`[저장완료] ${item.title}`);
        } catch (err) {
          console.error(`[에러] 전시 처리 중 오류 발생: ${item.title}`, err);
        }
      }

      page++;
    }

    console.log('[syncExhibitions] 전체 동기화 완료');
  } catch (err) {
    console.error('[syncExhibitions] 전시 목록 처리 중 전체 오류:', err);
  }
}

export async function cleanOldExhibitions() {
  try {
    const deletedCount = await deletePastExhibitions();
    console.log(`[삭제] 종료된 전시 ${deletedCount}건 제거`);
  } catch (err) {
    console.error('[cleanOldExhibitions] 종료된 전시 삭제 중 오류:', err);
  }
}

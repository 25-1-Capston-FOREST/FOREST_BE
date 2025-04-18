import cron from 'node-cron';
import dayjs from 'dayjs';
import { syncExhibitions, cleanOldExhibitions } from '../services/exhibition.service.js';

// 매일 새벽 1시에 실행
cron.schedule('00 01 * * *', async () => {
  console.log('[크론] 전시정보 수집 시작');
  const from = dayjs().subtract(1, 'month').format('YYYY-MM-DD');
  const to = dayjs().add(1, 'month').format('YYYY-MM-DD');

  await syncExhibitions(from, to);
  await cleanOldExhibitions();
  console.log('[크론] 전시정보 수집 완료');
});

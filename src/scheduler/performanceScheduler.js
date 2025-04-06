import cron from 'node-cron';
import { updatePerformances } from '../services/performance.service.js';

// 매일 새벽 3시에 실행
cron.schedule('00 03 * * *', async () => {
  console.log('🌙 [공연 정보 스케줄러] 공연 정보를 업데이트합니다...');
  await updatePerformances();
});

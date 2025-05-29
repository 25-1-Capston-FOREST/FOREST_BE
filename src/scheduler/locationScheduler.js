import cron from 'node-cron';
import { updateAllCoordinates } from '../services/location.service.js';
import dotenv from 'dotenv';
dotenv.config();

// 매일 오전 4시에 실행
cron.schedule('00 04 * * *', async () => {
  console.log('📍 공연/전시 좌표 업데이트 스케줄러 시작');
  console.log('Kakao API Key:', process.env.KAKAO_API_KEY);
  await updateAllCoordinates();
  console.log('✅ 공연/전시 좌표 업데이트 완료');
});

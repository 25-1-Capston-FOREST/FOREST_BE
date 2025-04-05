import cron from 'node-cron';
import { syncMoviesFromKobis, deleteOldMovies } from '../services/movie.service.js';

// 매일 새벽 2시에 실행
cron.schedule('00 02 * * *', async () => {
    console.log('[크론] 영화 정보 동기화 시작');
    try {
      await syncMoviesFromKobis();
      await deleteOldMovies();
      console.log('[크론] 완료!');
    } catch (error) {
      console.error('[크론] 에러 발생:', error);
    }
  });
  

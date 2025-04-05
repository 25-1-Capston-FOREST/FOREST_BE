import { fetchBoxOfficeList } from '../utils/kobisClient.js';

import {
  findMovieByTitle,
  createActivity,
  createMovie,
  deleteMovieById,
} from '../repositories/movie.repository.js';
import { prisma } from '../db.config.js';

// 날짜 문자열 → Date 객체로 파싱
const parseDate = (str) => {
  if (!str || typeof str !== 'string' || str.trim().length !== 8) return null;
  const year = str.slice(0, 4);
  const month = str.slice(4, 6);
  const day = str.slice(6, 8);
  const date = new Date(`${year}-${month}-${day}`);
  return isNaN(date.getTime()) ? null : date;
};

// 🎬 영화 정보 동기화 함수
export const syncMoviesFromKobis = async (targetDate) => {
    try {
      console.log('[크론] 영화 정보 동기화 시작');
      const today = targetDate || new Date();
      const dateStr =
        today instanceof Date
          ? today.toISOString().slice(0, 10).replace(/-/g, '')
          : targetDate;
  
      const movies = await fetchBoxOfficeList(dateStr); // ✅ 이미 상세정보 포함됨
  
      for (const movie of movies) {
        const exists = await findMovieByTitle(movie.title);
        if (exists) continue;
  
        const openDt = movie.open_dt?.replace(/-/g, '').trim();
        if (!openDt || openDt.length !== 8) {
          console.warn(`[경고] '${movie.title}' 개봉일 무효 → 스킵`);
          continue;
        }
  
        const activity = await createActivity();

        // 새 영화 insert 전에 image_url 있는지 확인해서 같이 넣기
        const existingMovie = await findMovieByTitle(movie.title);
        const imageUrl = existingMovie?.image_url ?? null;

        await createMovie(activity.activity_id, {
          movie_cd: movie.movie_cd,
          title: movie.title,
          open_dt: openDt,
          rank: movie.rank,
          audi_acc: movie.audi_acc,
          show_tm: movie.show_tm,
          genre_nm: movie.genre_nm,
          director: movie.director,
          actors: movie.actors,
          image_url: imageUrl, // 💾 기존 이미지 넣어주기!
        });
  
        console.log(`[DEBUG] 저장된 영화: ${movie.title}`);
      }
    } catch (err) {
      console.error('[크론] 에러 발생:', err);
    }
  };

// 🎬 오래된 영화 삭제 함수 (4주 경과)
export const deleteOldMovies = async () => {
  const now = new Date();
  const cutoff = new Date();
  cutoff.setDate(now.getDate() - 28);

  const oldMovies = await prisma.mOVIE.findMany({
    where: {
      created_at: { lt: cutoff },
    },
  });

  for (const movie of oldMovies) {
    await deleteMovieById(movie.movie_id);
    console.log(`[DEBUG] 오래된 영화 삭제: ${movie.title}`);
  }
};

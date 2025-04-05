// 📁 utils/kobisClient.js

import axios from 'axios';
import { fetchMovieDetails } from './fetchMovieDetails.js'; // 상세정보 가져오는 함수

export async function fetchBoxOfficeList(date) {
  const url = `https://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json`;

  const res = await axios.get(url, {
    params: {
      key: process.env.KOBIS_API_KEY,
      targetDt: date,
    },
  });

  const movieList = res.data.boxOfficeResult.dailyBoxOfficeList;

  // ✅ 상세정보와 병렬로 함께 묶기
  const detailedMovies = await Promise.all(
    movieList.map(async (m) => {
      const { movieCd, movieNm, openDt, rank, audiAcc } = m;

      // 📌 병렬 요청
      const detail = await fetchMovieDetails(movieCd);

      return {
        movie_cd: movieCd,
        title: movieNm,
        open_dt: openDt,
        rank: rank?.toString() || '0',
        audi_acc: audiAcc?.toString() || '0',
        show_tm: detail?.show_tm ?? null,
        genre_nm: detail?.genre_nm ?? null,
        director: detail?.director ?? null,
        actors: detail?.actors ?? null,
      };
    })
  );

  return detailedMovies;
}

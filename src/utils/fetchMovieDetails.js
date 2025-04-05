import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function fetchMovieDetails(movieCd) {
  try {
    console.log(`[상세API 호출] movieCd: ${movieCd}`);

    const res = await axios.get(
      'https://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json',
      {
        params: {
          key: process.env.KOBIS_API_KEY,
          movieCd,
        },
      }
    );

    console.log(`[상세API 응답]`, res.data);

    const info = res.data.movieInfoResult.movieInfo;

    return {
      show_tm: info.showTm ?? '',
      genre_nm: info.genres.map(g => g.genreNm).join(', '),
      director: info.directors.map(d => d.peopleNm).join(', '),
      actors: info.actors.slice(0, 5).map(a => a.peopleNm).join(', '),
    };
  } catch (err) {
    console.error(`[에러] ${movieCd} 상세정보 불러오기 실패:`, err.message);
    return null;
  }
}

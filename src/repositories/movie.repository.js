import { prisma } from '../db.config.js';

// 중복 영화 존재 여부 확인
export const findMovieByTitle = async (title) => {
  return prisma.mOVIE.findFirst({ where: { title } });
};

// ACTIVITY 생성
export const createActivity = async () => {
  return prisma.aCTIVITY.create({
    data: {
      activity_type: 'MOVIE',
    },
  });
};

// MOVIE 생성
export const createMovie = async (activityId, movieData) => {
  return prisma.mOVIE.create({
    data: {
      activity_id: activityId,
      ...movieData,
    },
  });
};

// MOVIE/ACTIVITY 삭제
export const deleteMovieById = async (movie_id) => {
  return prisma.mOVIE.delete({ where: { movie_id } });
};

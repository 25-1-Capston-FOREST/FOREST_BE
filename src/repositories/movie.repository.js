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

export const deleteMovieAndActivity = async (movie_id) => {
  // 1. 영화 먼저 찾기
  const movie = await prisma.mOVIE.findUnique({
    where: { movie_id },
  });

  if (!movie) return;

  // 2. 관련된 ACTIVITY 삭제 (activity_id 기반)
  await prisma.aCTIVITY.delete({
    where: { activity_id: movie.activity_id },
  });

  // 3. 영화 삭제
  await prisma.mOVIE.delete({
    where: { movie_id },
  });
};

  
import { prisma } from '../db.config.js';

export const getItemsWithoutCoordinates = async () => {
  const performances = await prisma.pERFORMANCE.findMany({
    where: {
      latitude: null,
      longitude: null,
    },
  });

  const exhibitions = await prisma.eXHIBITION.findMany({
    where: {
      latitude: null,
      longitude: null,
    },
  });

  return {
    performance: performances,
    exhibition: exhibitions,
  };
};

export const updateItemCoordinates = async (table, id, latitude, longitude) => {
  if (table === 'exhibition') {
    return prisma.eXHIBITION.update({
      where: { exhibition_id: BigInt(id) },
      data: { latitude, longitude },
    });
  } else if (table === 'performance') {
    return prisma.pERFORMANCE.update({
      where: { performance_id: BigInt(id) },
      data: { latitude, longitude },
    });
  }
  throw new Error('알 수 없는 테이블명');
};



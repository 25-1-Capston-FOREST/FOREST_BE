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


export const getLocationById = async(id) => {
  const typeData = await prisma.aCTIVITY.findFirst({
    where: { activity_id: id },
    select: { activity_type: true }
  })

  const type = typeData?.activity_type; // 문자열만 추출

  if(type === 'MOVIE'){
    return prisma.mOVIE.findFirst({
      where: { activity_id: id },
      select: { latitude: true, longitude:true }
    })
  }else if(type === 'PERFORMANCE'){
    console.log("레포지토리 처리 시작", type);
    return prisma.pERFORMANCE.findFirst({
      where: { activity_id: id },
      select: { latitude: true, longitude:true }
    })
  }else{
    return prisma.eXHIBITION.findFirst({
      where: { activity_id: id },
      select: { latitude: true, longitude:true }
    })
  }
}
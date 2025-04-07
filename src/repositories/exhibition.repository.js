import { prisma } from '../db.config.js';

export async function findExhibitionByTitleAndStartDate(title, startDate) {
    return prisma.eXHIBITION.findFirst({
      where: {
        title,
        start_date: new Date(startDate),
      },
      include: {
        ACTIVITY: true, // 필요하면 ACTIVITY도 같이 가져옴
      },
    });
  }

export async function createExhibition(exhibitionData) {
  const activity = await prisma.aCTIVITY.create({
    data: {
      activity_type: 'EXHIBITION',
    },
  });

  await prisma.eXHIBITION.create({
    data: {
      activity_id: activity.activity_id,
      ...exhibitionData,
    },
  });

  return activity;
}

export async function deletePastExhibitions() {
  try {
    // 종료일이 오늘 이전인 EXHIBITION에서 activity_id만 가져오기
    const expired = await prisma.eXHIBITION.findMany({
      where: {
        end_date: { lt: new Date() },
      },
      select: { activity_id: true },
    });

    const expiredIds = expired.map(e => e.activity_id);

    if (!expiredIds.length) return 0;

    // ACTIVITY에서 삭제
    const result = await prisma.aCTIVITY.deleteMany({
      where: {
        activity_id: { in: expiredIds },
        activity_type: 'EXHIBITION',
      },
    });

    return result.count;
  } catch (error) {
    console.error('[cleanOldExhibitions] 종료된 전시 삭제 중 오류:', error);
    throw error;
  }
}
import { prisma } from '../db.config.js';

// 🎯 공연완료된 항목과 관련된 ACTIVITY 같이 삭제
export const deleteEndedPerformancesWithActivity = async () => {
  const endedPerformances = await prisma.pERFORMANCE.findMany({
    where: {
      status: '공연완료',
    },
    select: {
      performance_id: true,
      activity_id: true,
    },
  });

  if (!endedPerformances.length) return;

  const performanceIds = endedPerformances.map(p => p.performance_id);
  const activityIds = endedPerformances.map(p => p.activity_id);

  // PERFORMANCE 먼저 삭제
  await prisma.pERFORMANCE.deleteMany({
    where: {
      performance_id: { in: performanceIds },
    },
  });

  // ACTIVITY 삭제
  await prisma.aCTIVITY.deleteMany({
    where: {
      activity_id: { in: activityIds },
    },
  });
};

export const saveActivities = async (activities) => {
  if (!activities.length) return;

  await prisma.aCTIVITY.createMany({
    data: activities,
    skipDuplicates: true,
  });
};

export const savePerformances = async (performances) => {
  if (!performances.length) return;

  await prisma.pERFORMANCE.createMany({
    data: performances,
    skipDuplicates: true,
  });
};

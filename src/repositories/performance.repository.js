import { prisma } from '../db.config.js';
import dayjs from 'dayjs';

export const deleteEndedPerformancesWithActivity = async () => {
  const today = dayjs();

  const endedPerformances = await prisma.pERFORMANCE.findMany({
    select: {
      performance_id: true,
      activity_id: true,
      end_date: true,
    },
  });

  const targets = endedPerformances.filter((p) => {
    if (!p.end_date) return false;

    const endDateParsed = dayjs(p.end_date, ['YYYY-MM-DD', 'YYYY.MM.DD']);
    return endDateParsed.isValid() && endDateParsed.isBefore(today, 'day');
  });

  if (!targets.length) return;

  const performanceIds = targets.map(p => p.performance_id);
  const activityIds = targets.map(p => p.activity_id);

  await prisma.pERFORMANCE.deleteMany({
    where: {
      performance_id: { in: performanceIds },
    },
  });

  await prisma.aCTIVITY.deleteMany({
    where: {
      activity_id: { in: activityIds },
    },
  });

  console.log(`🗑️ 종료일 경과된 공연 ${performanceIds.length}개 및 관련 ACTIVITY 삭제 완료`);
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

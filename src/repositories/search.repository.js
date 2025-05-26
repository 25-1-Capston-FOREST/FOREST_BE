import { prisma } from "../db.config.js";

// BigInt 필드를 문자열로 변환하는 재귀 함수
function convertBigIntToString(obj) {
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        value === null || value === undefined
          ? value
          : typeof value === "bigint"
            ? value.toString()
            : convertBigIntToString(value),
      ])
    );
  }
  return obj;
}

export const findActivitiesByKeyword = async (keyword) => {
  if (!keyword) {
    // 여기서 res를 쓸 수 없으니, 호출하는 쪽에서 체크하거나 에러 던지기 추천
    throw new Error("keyword query parameter is required.");
  }

  const [movies, performances, exhibitions] = await Promise.all([
    prisma.mOVIE.findMany({
      where: { title: { contains: keyword} },
    }),
    prisma.pERFORMANCE.findMany({
      where: { title: { contains: keyword} },
    }),
    prisma.eXHIBITION.findMany({
      where: { title: { contains: keyword} },
    }),
  ]);

  const combined = [
    ...movies.map((item) => ({ type: "movie", ...item })),
    ...performances.map((item) => ({ type: "performance", ...item })),
    ...exhibitions.map((item) => ({ type: "exhibition", ...item })),
  ];

  return convertBigIntToString(combined);
};

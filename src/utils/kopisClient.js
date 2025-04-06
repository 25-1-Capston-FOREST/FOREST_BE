import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.KOPIS_API_KEY;
const BASE_URL = 'http://www.kopis.or.kr/openApi/restful';

export const fetchPerformanceIdList = async (startDate, endDate, region, page = 1, rows = 100) => {
  const url = `${BASE_URL}/pblprfr?service=${API_KEY}&stdate=${startDate}&eddate=${endDate}&signgucode=${region}&cpage=${page}&rows=${rows}`;

  try {
    const response = await axios.get(url, { headers: { Accept: 'application/xml' } });
    return response.data;
  } catch (error) {
    console.error('공연 목록 API 오류:', error.message);
    throw error;
  }
};

export const fetchPerformanceDetail = async (mt20id) => {
  const url = `${BASE_URL}/pblprfr/${mt20id}?service=${API_KEY}`;

  try {
    const response = await axios.get(url, { headers: { Accept: 'application/xml' } });
    return response.data;
  } catch (error) {
    console.error(`공연 상세 API 오류 (ID: ${mt20id}):`, error.message);
    return null; // 상세 정보가 없더라도 계속 진행할 수 있도록
  }
};

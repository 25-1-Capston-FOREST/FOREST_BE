import axios from 'axios';
import dotenv from 'dotenv';
import { XMLParser } from 'fast-xml-parser';

dotenv.config();

const BASE_URL = 'https://apis.data.go.kr/B553457/nopenapi/rest/publicperformancedisplays';
const SERVICE_KEY = process.env.EXHIBITION_API_KEY;
const parser = new XMLParser();

function formatDate(dateStr) {
  return dateStr.replace(/-/g, '');
}

export async function fetchExhibitionList(from, to, page = 1, numOfRows = 100) {
  const formattedFrom = formatDate(from);
  const formattedTo = formatDate(to);
  const url = `${BASE_URL}/realm?serviceKey=${SERVICE_KEY}&realmCode=D000&sido=서울&from=${formattedFrom}&to=${formattedTo}&PageNo=${page}&numOfrows=${numOfRows}`;

  try {
    console.log('[요청 URL]', url);
    const { data } = await axios.get(url, { responseType: 'text' });
    const parsed = parser.parse(data);

    const items = parsed?.response?.body?.items?.item;

    return Array.isArray(items) ? items : items ? [items] : [];
  } catch (err) {
    console.error('[목록 API 오류]', err.message);
    return [];
  }
}

export async function fetchExhibitionDetail(seq) {
  const url = `${BASE_URL}/detail?serviceKey=${SERVICE_KEY}&seq=${seq}`;

  try {
    const { data } = await axios.get(url, { responseType: 'text' });
    const parsed = parser.parse(data);

    const item = parsed?.response?.body?.items?.item;
    return item ?? null;
  } catch (err) {
    console.error(`[상세 API 오류] seq=${seq}`, err.message);
    return null;
  }
}

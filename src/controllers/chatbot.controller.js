// chatbot/controller.js
import axios from 'axios';

const AI_SERVER_URL = '*';

export const handleChatbotAnswer = async (req, res) => {
  const { user_id, question_id, message } = req.body;

  if (!user_id || !message) {
    return res.status(400).json({ status: 'error', message: 'user_id와 message는 필수입니다.' });
  }

  try {
    // 실제 AI 호출 대신 임시 응답
    const dummyReply = `AI 응답 예시: "${message}"에 대한 답변입니다.`;

    return res.status(200).json({ status: 'success', reply: dummyReply });
  } catch (err) {
    console.error('챗봇 응답 오류:', err.message);
    return res.status(500).json({ status: 'error', message: 'AI 서버 통신 오류' });
  }

//   try {
//     const response = await axios.post(`${AI_SERVER_URL}/chatbot/answer`, {
//       user_id,
//       question_id,
//       message,
//     });

//     return res.status(200).json({ status: 'success', reply: response.data.reply });
//   } catch (err) {
//     console.error('챗봇 응답 오류:', err.message);
//     return res.status(500).json({ status: 'error', message: 'AI 서버 통신 오류' });
//   }

};

export const handleChatbotSave = async (req, res) => {
  const { user_id, question_id, message, end_reason } = req.body;

  if (!user_id || !question_id || !message || !end_reason) {
    return res.status(400).json({ status: 'error', message: '필수 항목 누락' });
  }
  try {
    // 실제 저장 로직 대신 로그로 확인
    console.log('[Mock Save] 저장 요청 내용:', { user_id, question_id, message, end_reason });

    return res.status(200).json({ status: 'success', message: '마지막 응답 저장 성공 (mock)' });
  } catch (err) {
    console.error('응답 저장 오류:', err.message);
    return res.status(500).json({ status: 'error', message: 'AI 서버 저장 실패' });
  }

//   try {
//     await axios.post(`${AI_SERVER_URL}/chatbot/save`, {
//       user_id,
//       question_id,
//       message,
//       end_reason,
//     });

//     return res.status(200).json({ status: 'success', message: '마지막 응답 저장 성공' });
//   } catch (err) {
//     console.error('응답 저장 오류:', err.message);
//     return res.status(500).json({ status: 'error', message: 'AI 서버 저장 실패' });
//   }
};

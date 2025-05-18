// chatbot/controller.js
import axios from 'axios';

const AI_SERVER_URL = 'http://43.200.176.224:5000 ';

export const handleChatbotAnswer = async (req, res) => {
    const user_id=req.user.id;
  const { question_id, message } = req.body;

  if (!user_id || !message) {
    return res.status(400).json({ status: 'error', message: 'user_id와 message는 필수입니다.' });
  }

  try {
    const response = await axios.post(`${AI_SERVER_URL}/chatbot/answer`, {
      user_id,
      question_id,
      message,
    });

    return res.status(200).json({ status: 'success', reply: response.data.reply });
  } catch (err) {
    console.error('챗봇 응답 오류:', err.message);
    return res.status(500).json({ status: 'error', message: 'AI 서버 통신 오류' });
  }

};

export const handleChatbotSave = async (req, res) => {
    const user_id=req.user.id;
  const {question_id, message, end_reason } = req.body;

  if (!user_id || !question_id || !message || !end_reason) {
    return res.status(400).json({ status: 'error', message: '필수 항목 누락' });
  }

  try {
    await axios.post(`${AI_SERVER_URL}/chatbot/save`, {
      user_id,
      question_id,
      message,
      end_reason,
    });

    return res.status(200).json({ status: 'success', message: '마지막 응답 저장 성공' });
  } catch (err) {
    console.error('응답 저장 오류:', err.message);
    return res.status(500).json({ status: 'error', message: 'AI 서버 저장 실패' });
  }
};

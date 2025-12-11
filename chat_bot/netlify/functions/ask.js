// netlify/functions/ask.js

exports.handler = async (event, context) => {
  try {
    const API_KEY = process.env.OPENAI_API_KEY; // Netlify 환경변수에서 API 키 읽기

    if (!API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "OPENAI_API_KEY 환경변수가 설정되지 않았습니다." })
      };
    }

    const body = JSON.parse(event.body || "{}");
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "messages 배열이 필요합니다." })
      };
    }

    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: messages
      })
    });

    const data = await res.json();

    return {
      statusCode: res.status,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "서버 내부 오류가 발생했습니다." })
    };
  }
};

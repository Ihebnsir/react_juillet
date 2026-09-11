const N8N_CHAT_WEBHOOK_URL =
  process.env.REACT_APP_N8N_CHAT_WEBHOOK_URL ||
  (process.env.NODE_ENV === 'test' ? 'https://example.test/webhook/chat' : '');

const getResponseText = (payload) => {
  if (typeof payload === "string") {
    return payload;
  }

  if (Array.isArray(payload)) {
    return payload.map(getResponseText).find(Boolean) || "";
  }

  if (payload && typeof payload === "object") {
    for (const key of ["output", "response", "text", "message"]) {
      const value = payload[key];
      if (typeof value === "string" && value.trim()) {
        return value;
      }
    }
  }

  return "";
};

export async function sendChatbotMessage({ chatInput, sessionId }) {
  if (!N8N_CHAT_WEBHOOK_URL) {
    throw new Error('CHATBOT_CONFIG_MISSING');
  }
  const body = { chatInput, sessionId };

  const response = await fetch(N8N_CHAT_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(`Chatbot webhook returned ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();
  const text = getResponseText(payload);

  if (!text) {
    throw new Error("Chatbot webhook returned no readable response");
  }

  return text;
}

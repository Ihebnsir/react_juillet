const N8N_CHAT_WEBHOOK_URL =
  process.env.REACT_APP_N8N_CHAT_WEBHOOK_URL ||
  "https://ihebnsir27.app.n8n.cloud/webhook/9313cf9a-1f4f-4b61-8919-197c1d171ad8/chat";

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
  const body = { chatInput, sessionId };
  console.log("N8N URL:", N8N_CHAT_WEBHOOK_URL);
  console.log("N8N REQUEST:", body);

  const response = await fetch(N8N_CHAT_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  console.log("N8N STATUS:", response.status);

  if (!response.ok) {
    throw new Error(`Chatbot webhook returned ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();
  console.log("N8N RESPONSE:", payload);
  const text = getResponseText(payload);

  if (!text) {
    throw new Error("Chatbot webhook returned no readable response");
  }

  return text;
}

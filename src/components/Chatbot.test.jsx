import { act, fireEvent, render, screen } from "@testing-library/react";
import { Chatbot } from "./Chatbot";

describe("Chatbot", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it("opens, sends a message and shows the n8n response", async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      headers: { get: () => "application/json" },
      json: () => Promise.resolve({ output: "Réponse de l'agent n8n" }),
    }));

    render(<Chatbot />);

    fireEvent.click(screen.getByRole("button", { name: /ouvrir le chatbot/i }));

    const input = screen.getByPlaceholderText(/Posez votre question/i);
    fireEvent.change(input, { target: { value: "Bonjour" } });
    await act(async () => {
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    });

    expect(screen.getByText("Bonjour")).toBeInTheDocument();
    expect(screen.getByText("Réponse de l'agent n8n")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("app.n8n.cloud/webhook/"),
      expect.objectContaining({
        method: "POST",
        body: expect.stringMatching(/"chatInput":"Bonjour".*"sessionId":"skillbridge-/),
      }),
    );
  });

  it("shows a user-friendly message when n8n is unavailable", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Network error")));

    render(<Chatbot />);
    fireEvent.click(screen.getByRole("button", { name: /ouvrir le chatbot/i }));

    const input = screen.getByPlaceholderText(/Posez votre question/i);
    fireEvent.change(input, { target: { value: "Bonjour" } });

    await act(async () => {
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });
    });

    expect(screen.getByText(/problème de connexion/i)).toBeInTheDocument();
  });
});

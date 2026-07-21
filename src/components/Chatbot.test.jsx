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

  it("opens, sends a message and shows a mock response", () => {
    render(<Chatbot />);

    fireEvent.click(screen.getByRole("button", { name: /ouvrir le chatbot/i }));

    const input = screen.getByPlaceholderText(/Posez votre question/i);
    fireEvent.change(input, { target: { value: "Bonjour" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(screen.getByText("Bonjour")).toBeInTheDocument();
    expect(screen.getByText(/Écriture/i)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1400);
    });

    expect(screen.getByText(/Bienvenue sur SkillBridge/i)).toBeInTheDocument();
  });
});

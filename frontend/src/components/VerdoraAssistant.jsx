import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TbMessageChatbot } from "react-icons/tb";

export default function VerdoraAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "नमस्ते! मैं Verdora हूं। मैं आपकी सहायता के लिए यहां हूं।",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate local response
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        text: "अभी मैं ऑफलाइन मोड में हूं। आपकी मदद के लिए धन्यवाद!",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full bg-linear-to-br from-primary to-emerald-500 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center border border-primary/20"
        aria-label="Open Verdora Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <TbMessageChatbot className="w-6 h-6" />
        )}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-20 right-4 z-40 w-96 max-w-[calc(100vw-2rem)] h-96 bg-background rounded-2xl shadow-2xl border border-primary/20 transition-all duration-300 transform flex flex-col overflow-hidden ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-primary to-emerald-500 p-4 flex items-center justify-between text-white">
          <div>
            <h3 className="font-bold text-lg">Verdora</h3>
            <p className="text-xs opacity-90">JITENDER द्वारा बनाया गया</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background/50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-secondary text-foreground rounded-bl-none"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString("hi-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary text-foreground px-4 py-2 rounded-lg rounded-bl-none">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-primary/10 p-4 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && !isLoading) {
                handleSendMessage();
              }
            }}
            placeholder="अपना सवाल पूछें..."
            className="flex-1 px-3 py-2 bg-secondary border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
}

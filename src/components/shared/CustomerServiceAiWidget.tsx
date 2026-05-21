import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, MessageCircleQuestion, Send, Sparkles, X } from "lucide-react";
import { useTheme } from "@/components/context/ThemeContext";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  text: string;
};

const quickTopics = [
  "How does the planner work?",
  "Can I download my itinerary?",
  "Where do I find the map?",
  "How do I contact support?",
];

const faqAnswers: Array<{ match: RegExp; answer: string }> = [
  {
    match: /planner|itinerary|trip/i,
    answer:
      "Use Planner to generate a trip, then open the dashboard to review, edit, or download the itinerary as TXT or DOC.",
  },
  {
    match: /download|txt|doc|word/i,
    answer:
      "Open a saved itinerary in the dashboard and use the Download TXT or Download DOC buttons in the modal header.",
  },
  {
    match: /map|route|directions/i,
    answer:
      "The Map page helps you explore locations and visualize your travel route alongside your plan.",
  },
  {
    match: /contact|support|help/i,
    answer:
      "If you need direct help, use the contact details in the footer or ask me a question here and I’ll point you to the right place.",
  },
];

const defaultAnswer =
  "I can help with planning, downloads, maps, and account navigation. Try asking about the planner, itinerary export, or the map.";

export default function CustomerServiceAiWidget() {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      text: "Hi, I’m the Plan-It assistant. Ask me about planning, downloads, the map, or support.",
    },
  ]);

  const assistantMessages = messages.filter(
    (message) => message.role === "assistant",
  );
  const lastAssistantReply = assistantMessages[assistantMessages.length - 1];

  const replyToMessage = (question: string) => {
    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      text: trimmedQuestion,
    };

    const matchedAnswer = faqAnswers.find(({ match }) =>
      match.test(trimmedQuestion),
    );
    const assistantMessage: ChatMessage = {
      id: Date.now() + 1,
      role: "assistant",
      text: matchedAnswer?.answer || defaultAnswer,
    };

    setMessages((previous) => [...previous, userMessage, assistantMessage]);
    setInput("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-70">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className={`mb-3 w-[min(92vw,24rem)] overflow-hidden rounded-[28px] border ${isDark ? "border-amber-200/20 bg-[#0d0906]/95 text-white shadow-[0_24px_80px_rgba(0,0,0,0.35)]" : "border-gray-200/40 bg-white text-gray-800 shadow-[0_12px_30px_rgba(0,0,0,0.06)]"} backdrop-blur-2xl`}
          >
            <div className="flex items-start justify-between gap-3 border-b border-white/10 px-4 py-4">
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-amber-200">
                  Customer Service AI
                </p>
                <h3 className="mt-1 text-lg font-semibold text-white">
                  Ask anything about your trip
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className={`rounded-full p-2 transition ${isDark ? "border border-white/10 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white" : "border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"}`}
                aria-label="Close customer service assistant"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-80 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-6 ${
                      message.role === "user"
                        ? isDark
                          ? "bg-amber-200 text-[#1a140d]"
                          : "bg-amber-100 text-[#2b1f12]"
                        : isDark
                          ? "border border-white/10 bg-white/5 text-white/85"
                          : "border border-gray-200/40 bg-white text-gray-800"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 px-4 py-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {quickTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => replyToMessage(topic)}
                    className={`rounded-full px-3 py-1.5 text-xs transition ${isDark ? "border border-white/10 text-white/75 hover:border-amber-200/40 hover:bg-white/8 hover:text-white" : "border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"}`}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              <form
                className="flex items-center gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  replyToMessage(input);
                }}
              >
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={
                    lastAssistantReply
                      ? "Type your question..."
                      : "Ask about planning or support..."
                  }
                  className={`h-11 flex-1 rounded-full border px-4 text-sm outline-none transition ${isDark ? "border border-white/10 bg-white/5 text-white placeholder:text-white/35 focus:border-amber-200/40" : "border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:border-primary-400"}`}
                />
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-amber-200 px-4 text-sm font-semibold text-[#1a140d] transition hover:bg-amber-100"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        className={`group inline-flex items-center gap-3 rounded-full px-4 py-3 text-left shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition ${isDark ? "border border-amber-200/20 bg-[#120d08]/95 text-white hover:border-amber-200/40 hover:bg-[#17110c]" : "border border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50"}`}
        aria-label="Open customer service assistant"
      >
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full transition group-hover:scale-105 ${isDark ? "bg-amber-200 text-[#1a140d]" : "bg-primary-500 text-white"}`}
        >
          <Bot size={18} />
        </span>
        <span>
          <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-amber-500">
            Help
          </span>
         
        </span>
        <Sparkles
          size={16}
          className={`${isDark ? "text-amber-200/90" : "text-primary-500/90"}`}
        />
      </button>
    </div>
  );
}

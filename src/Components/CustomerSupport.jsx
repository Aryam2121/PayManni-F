import { useState } from "react";
import { MessageCircle, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How do I reset my password?",
    answer: "Click on 'Forgot Password' on the login page and follow the instructions sent to your email.",
  },
  {
    question: "How can I check my payment history?",
    answer: "Navigate to Dashboard > Transactions to view your payment history.",
  },
  {
    question: "What should I do if I find a billing error?",
    answer: "Contact our support team via live chat or email with the billing details and we’ll investigate.",
  },
];

const CustomerSupport = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "support", text: "👋 Hi there! How can we help you today?" },
  ]);
  const [input, setInput] = useState("");

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: input.trim() }]);
    setInput("");

    // Simulated support reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "support", text: "Thanks for reaching out! We'll respond shortly." },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gradient-to-b from-gray-900 to-black text-white space-y-10">
      <div className="flex items-center gap-2">
        <MessageCircle className="text-blue-500 w-6 h-6" />
        <h2 className="text-3xl font-bold tracking-tight">Customer Support</h2>
      </div>

      {/* FAQ Section */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer"
              onClick={() => toggleFAQ(i)}
            >
              <div className="flex justify-between items-center">
                <p className="text-base">{faq.question}</p>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${openFAQ === i ? "rotate-180" : ""}`}
                />
              </div>
              {openFAQ === i && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-white/70"
                >
                  {faq.answer}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Live Chat Section */}
      <section>
        <h3 className="text-xl font-semibold mb-4">Live Chat Support</h3>
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl text-sm font-medium"
        >
          {chatOpen ? "Close Chat" : "Open Chat"}
        </button>

        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 max-w-md w-full bg-white/5 p-4 border border-white/10 rounded-xl"
          >
            <div className="h-48 overflow-y-auto flex flex-col gap-2 text-sm mb-4 pr-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg max-w-[75%] ${
                    msg.from === "user"
                      ? "ml-auto bg-blue-600 text-right"
                      : "bg-white/10 text-left"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white text-sm focus:outline-none"
                placeholder="Type your message..."
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-sm rounded-lg"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default CustomerSupport;

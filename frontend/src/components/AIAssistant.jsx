import { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hi there. I am your FemmeCare AI assistant. How can I support you today? Please note, any advice given is not a medical diagnosis.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I am having trouble connecting right now. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-brand-lavender">
          <div className="bg-brand-teal text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold flex items-center gap-2">
              <MessageSquare size={18} /> FemmeCare AI
            </h3>
            <button onClick={toggleChat} className="text-brand-lavender hover:text-white transition">
              <X size={20} />
            </button>
          </div>
          
          <div className="h-80 overflow-y-auto p-4 space-y-3 bg-brand-roseWhite/30">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-[80%] text-sm ${msg.role === 'user' ? 'bg-brand-teal text-white rounded-br-none' : 'bg-brand-lavender text-gray-800 rounded-bl-none'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-lg bg-brand-lavender text-gray-800 rounded-bl-none text-sm">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-100 flex gap-2 bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
              className="flex-1 px-3 py-2 border border-brand-lavender rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-brand-teal text-white p-2 rounded-lg hover:bg-brand-teal/90 transition disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={toggleChat}
          className="bg-brand-teal text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition duration-300"
        >
          <MessageSquare size={24} />
        </button>
      )}
    </div>
  );
};

export default AIAssistant;

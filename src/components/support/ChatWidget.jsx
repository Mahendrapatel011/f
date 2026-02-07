// components/support/ChatWidget.jsx
import { useState } from 'react';
import { FaCommentDots, FaTimes, FaPaperPlane } from 'react-icons/fa';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showBubble, setShowBubble] = useState(true);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: 'Hi there! Need help?',
            time: new Date()
        }
    ]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: message,
            time: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setMessage('');

        // Simulate bot response
        setTimeout(() => {
            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                text: 'Thank you for your message. Our support team will get back to you shortly.',
                time: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        }, 1000);
    };

    const handleOpen = () => {
        setIsOpen(true);
        setShowBubble(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Bubble Message */}
            {showBubble && !isOpen && (
                <div className="absolute bottom-16 right-0 bg-white rounded-xl shadow-lg p-3 
                    border border-gray-200 whitespace-nowrap animate-bounce-subtle">
                    <p className="text-sm text-gray-700">Hi there! Need help?</p>
                    <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 
                        w-3 h-3 bg-white border-r border-b border-gray-200" />
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-2xl 
                    shadow-2xl border border-gray-200 overflow-hidden">
                    
                    {/* Header */}
                    <div className="bg-[#1e3a5f] text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <FaCommentDots className="text-lg" />
                            </div>
                            <div>
                                <h4 className="font-semibold">Support Chat</h4>
                                <p className="text-xs text-white/70">We typically reply within minutes</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="h-72 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl ${
                                        msg.type === 'user'
                                            ? 'bg-[#1e3a5f] text-white rounded-br-md'
                                            : 'bg-white text-gray-700 shadow-sm rounded-bl-md'
                                    }`}
                                >
                                    <p className="text-sm">{msg.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm
                                    focus:outline-none focus:border-[#1e3a5f]"
                            />
                            <button
                                type="submit"
                                className="w-10 h-10 bg-[#1e3a5f] text-white rounded-full
                                    flex items-center justify-center hover:bg-[#2d4a6f] transition-colors"
                            >
                                <FaPaperPlane className="text-sm" />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={handleOpen}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center
                    transition-all duration-300 ${
                        isOpen 
                            ? 'bg-gray-600 hover:bg-gray-700' 
                            : 'bg-[#1e3a5f] hover:bg-[#2d4a6f]'
                    }`}
            >
                {isOpen ? (
                    <FaTimes className="text-white text-xl" />
                ) : (
                    <FaCommentDots className="text-white text-xl" />
                )}
            </button>
        </div>
    );
};

export default ChatWidget;
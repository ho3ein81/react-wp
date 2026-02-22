// src/components/AIChat.jsx - فیکس شده
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AIChat.css';

const GAPGPT_API_KEY = 'sk-cxLPnC2qP78VKsI4hAnRCpOK7LtNepXAOFIjjwqokeTriENu';
const GAPGPT_API_URL = 'https://api.gapgpt.app/v1/chat/completions';

function AIChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(GAPGPT_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GAPGPT_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'تو یک دستیار هوشمند فارسی هستی. مفید و خلاصه جواب بده.' },
            ...messages.slice(-10),
            { role: 'user', content: userMessage }
          ],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.choices?.[0]?.message?.content) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.choices[0].message.content 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ خطا در ارتباط. دوباره تلاش کن.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="ai-chat-page">
      <div className="ai-chat-container">
        <div className="ai-chat-header">
          <Link to="/" className="ai-chat-back-btn">
            ← بازگشت
          </Link>
          <h1>(AI) دستیار شخصی</h1>
          {messages.length > 0 && (
            <button className="ai-chat-reset-btn" onClick={resetChat}>
              🗑️ پاک کردن
            </button>
          )}
        </div>

        <div className="ai-chat-messages">
          {messages.length === 0 && !loading && (
            <div className="ai-chat-empty">
              <p>سلام! آماده ام هر سوالی بپرسی جواب بدم</p>
            </div>
          )}
          
          {messages.map((message, index) => (
            <div key={index} className={`ai-chat-message ${message.role}`}>
              <div className="ai-chat-avatar">
                {message.role === 'user' ? '👨‍💻' : '🤖'}
              </div>
              <div className="ai-chat-bubble">
                <p>{message.content}</p>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="ai-chat-message assistant">
              <div className="ai-chat-avatar">🤖</div>
              <div className="ai-chat-bubble">
                <div className="ai-chat-typing">
                  <div className="typing-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="ai-chat-input-wrapper">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="سوالت رو بپرس..."
            rows="1"
            className="ai-chat-input"
            disabled={loading}
          />
          <button 
            onClick={sendMessage} 
            disabled={loading || !input.trim()}
            className="ai-chat-send-btn"
          >
            ارسال
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIChat;

'use client';
import { useState } from 'react';
import { useData } from '@/context/DataContext';
import Topbar from '@/components/Topbar';
import InvoiceUploadModal from '@/components/InvoiceUploadModal';
import { getAIResponse, suggestedQuestions } from '@/utils/aiEngine';

export default function AIAssistantPage() {
  const data = useData();
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I\'m your DailyOps AI assistant. I can help you understand your business data — ask me about **profit, revenue, expenses, suppliers, production,** or **margins**.' },
  ]);
  const [input, setInput] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text: text.trim() };
    const response = getAIResponse(text, data);
    setMessages(prev => [...prev, userMsg, { role: 'assistant', text: response }]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  return (
    <>
      <Topbar onUploadClick={() => setShowUpload(true)} />
      <div className="page-content animate-in">
        <div className="page-header">
          <h2>✦ AI Business Assistant</h2>
          <p>Ask questions about your operations in natural language.</p>
        </div>

        <div className="card" style={{padding:0}}>
          <div className="chat-container" style={{padding:'0 24px'}}>
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-msg ${msg.role}`}>
                  <div className="chat-msg-avatar">{msg.role === 'assistant' ? '✦' : 'A'}</div>
                  <div className="chat-msg-bubble">
                    {msg.text.split('\n').map((line, j) => (
                      <span key={j}>
                        {line.split('**').map((part, k) => k % 2 === 1 ? <strong key={k}>{part}</strong> : part)}
                        {j < msg.text.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-suggestions">
              {suggestedQuestions.map((q, i) => (
                <button key={i} className="chat-chip" onClick={() => sendMessage(q)}>{q}</button>
              ))}
            </div>

            <div className="chat-input-area">
              <input className="chat-input" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Ask about your business..." />
              <button className="btn btn-primary" onClick={() => sendMessage(input)} disabled={!input.trim()}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      <InvoiceUploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} />
    </>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';


const ChatMentor = ({ roadmap }) => {
  // 1. Initialize messages as an empty array.
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messageDisplayRef = useRef(null);

  // 2. Use a useEffect hook to reset the chat when the roadmap changes.
  useEffect(() => {
    if (roadmap && roadmap.title) {
      // This will now run every time a new roadmap is selected.
      setMessages([
        { sender: 'ai', text: `Hello! I'm your AI mentor. How can I help you with your roadmap for **${roadmap.title}**?` }
      ]);
    }
  }, [roadmap]); // The hook depends on the 'roadmap' prop.

  // Automatically scroll to the bottom when new messages are added
  useEffect(() => {
    if (messageDisplayRef.current) {
      const { scrollHeight } = messageDisplayRef.current;
      messageDisplayRef.current.scrollTo(0, scrollHeight);
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/chat/mentor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userQuestion: userInput,
          chatHistory: newMessages,
          roadmap: roadmap,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get a response.');
      }
      
      setMessages(prev => [...prev, { sender: 'ai', text: data.response }]);

    } catch (error) {
      console.error("Error with mentor chat:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I'm having trouble connecting. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-mentor-container">
      <h3>Your AI Mentor</h3>
      <div className="message-display" ref={messageDisplayRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        ))}
        {isLoading && <div className="message ai typing-indicator"><span></span><span></span><span></span></div>}
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask a question or type 'next'..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
};

export default ChatMentor;
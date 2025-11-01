import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const ChatMentor = ({ roadmapData }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Used for chat responses
  const messageDisplayRef = useRef(null);

  // This useEffect now runs ONCE when the component is created
  // (or re-created by the 'key' prop in MentorPage)
  useEffect(() => {
    const loadChatHistory = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/chat/${roadmapData._id}`, 
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to load chat history.');
        }

        const history = await response.json();

        // If history is empty, add the welcome message.
        if (history.length === 0) {
          setMessages([
            { sender: 'ai', text: `Hello! I'm your AI mentor. How can I help you with your roadmap for **${roadmapData.roadmap.title}**?` }
          ]);
        } else {
          setMessages(history);
        }

      } catch (error) {
        console.error("Error loading chat:", error);
        setMessages([{ sender: 'ai', text: "Sorry, I couldn't load our previous chat. Let's start over." }]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadChatHistory();
  }, [roadmapData]); // This runs when the component mounts

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

    const userMessage = { sender: 'user', text: userInput };
    // Optimistically update the UI with the user's message
    setMessages(prev => [...prev, userMessage]);
    
    setUserInput('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      // Call the NEW POST route
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/chat/${roadmapData._id}`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          // We only need to send the new question!
          body: JSON.stringify({ userQuestion: userInput }),
        }
      );

      const aiMessage = await response.json(); // The server sends back *only* the new AI message
      if (!response.ok) {
        throw new Error(aiMessage.error || 'Failed to get a response.');
      }
      
      // Add the new AI message to the list
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Error with mentor chat:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I'm having trouble connecting. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-mentor-container">
      {/* This is no longer a <H3> because the page has its own H1.
        We remove the title to make it a seamless part of the page.
      */}
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
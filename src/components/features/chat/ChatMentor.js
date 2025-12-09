import React, { useState, useEffect, useRef, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Form, Button, Spinner, Card } from 'react-bootstrap';
import { FaPaperPlane, FaRobot } from 'react-icons/fa';

// --- Constants ---
import useChatMentor from '../../../hooks/useChatMentor';

// --- Constants ---
const STYLES = {
  headerIcon: { width: 45, height: 45 },
  headerText: { maxWidth: '200px' },
  card: { minHeight: '500px', maxHeight: '75vh' },
  inputShadow: { boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.03)' },
  sendBtn: { textDecoration: 'none', zIndex: 5 }
};



// --- Sub-Components ---

const ChatHeader = memo(({ topic }) => (
  <div className="p-3 border-bottom bg-transparent d-flex align-items-center shadow-sm" style={{ zIndex: 10 }}>
    <div className="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3 d-flex align-items-center justify-content-center" style={STYLES.headerIcon}>
      <FaRobot size={24} />
    </div>
    <div className="overflow-hidden">
      <h6 className="mb-0 fw-bold text-dark text-truncate">AI Mentor</h6>
      <small className="text-muted text-truncate d-block" style={STYLES.headerText}>{topic}</small>
    </div>
  </div>
));

const ChatMessage = memo(({ sender, text }) => (
  <div className={`d-flex mb-3 ${sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
    <div className={`message ${sender} shadow-sm`}>
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  </div>
));

const LoadingIndicator = () => (
  <div className="d-flex justify-content-start mb-3">
    <div className="message ai shadow-sm">
      <div className="typing-indicator"><span></span><span></span><span></span></div>
    </div>
  </div>
);

const ChatInput = memo(({ onSend, disabled }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(input);
    setInput('');
  };

  return (
    <div className="p-3 bg-transparent border-top">
      <Form onSubmit={handleSubmit} className="position-relative w-100">
        <div className="d-flex align-items-center">
          <Form.Control
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            disabled={disabled}
            className="rounded-pill border-0 bg-light py-2 py-md-3 px-4 pe-5 flex-grow-1"
            style={STYLES.inputShadow}
          />
          <Button
            type="submit"
            disabled={disabled || !input.trim()}
            variant="link"
            className="position-absolute end-0 top-50 translate-middle-y text-primary pe-3"
            style={STYLES.sendBtn}
          >
            {disabled ? <Spinner animation="border" size="sm" /> : <FaPaperPlane size={20} />}
          </Button>
        </div>
      </Form>
    </div>
  );
});

// --- Main Component ---

const ChatMentor = ({ roadmapData }) => {
  const { messages, isLoading, sendMessage } = useChatMentor(roadmapData);
  const scrollRef = useRef(null);

  // Auto-scroll effect
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  return (
    <Card className="border-0 shadow-lg overflow-hidden d-flex flex-column h-100 glass-card" style={STYLES.card}>
      <ChatHeader topic={roadmapData.topic} />

      <div className="flex-grow-1 p-3 p-md-4 message-display bg-transparent" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} sender={msg.sender} text={msg.text} />
        ))}
        {isLoading && <LoadingIndicator />}
      </div>

      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </Card>
  );
};

export default ChatMentor;
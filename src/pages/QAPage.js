import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Loader = () => (
  <div className="loader-container">
    <div className="loader-dots">
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
    <p className="loader-text">Loading...</p>
  </div>
);

const QAPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for the "Ask Question" form
  const [topic, setTopic] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all questions on load
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/questions`);
        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Handle new question submission
  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!topic || !questionText) {
      return alert('Please select a topic and write your question.');
    }

    const token = localStorage.getItem("token");
    if (!token) return alert('Please log in to ask a question.');

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ originalQuestion: questionText, topic })
      });

      if (!response.ok) throw new Error('Failed to submit question');
      
      const newQuestion = await response.json();
      // Add new question to the top of the list and navigate to it
      setQuestions(prev => [newQuestion, ...prev]);
      navigate(`/community/${newQuestion._id}`);

    } catch (error) {
      console.error("Error submitting question:", error);
      alert('Error: Could not submit your question.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <div className="qa-container">
        <h1>Community Q&A</h1>
        
        {/* "Ask a Question" Form */}
        {user ? (
          <form onSubmit={handleSubmitQuestion} className="question-form card-style">
            <h2>Ask a New Question</h2>
            <div className="form-group">
              <label htmlFor="topic-select">Topic</label>
              <input 
                type="text" 
                id="topic-select"
                placeholder="e.g., Python, SQL, JavaScript"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="question-text">Your Question</label>
              <textarea 
                id="question-text"
                rows="4"
                placeholder="What's your question? Be specific."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Ask Question'}
            </button>
          </form>
        ) : (
          <p style={{textAlign: 'center'}}>Please log in or register to ask a question.</p>
        )}

        {/* List of Questions */}
        <div className="question-list">
          <h2>All Questions</h2>
          {isLoading ? <Loader /> : (
            questions.map(q => (
              <div key={q._id} className="question-item card-style">
                <Link to={`/community/${q._id}`}>
                  <h3>{q.title}</h3>
                </Link>
                <div className="question-tags">
                  {q.tags.map((tag, i) => <span key={i} className="tag">{tag}</span>)}
                </div>
                <div className="question-meta">
                  <span>Asked by {q.user?.name || 'User'}</span>
                  <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                  <span>{q.answers.length} Answers</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QAPage;
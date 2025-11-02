import React, { useState, useEffect, useContext, useCallback } from 'react'; // 1. Import useCallback
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';

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

const QuestionDetailPage = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams(); // Get question ID from URL
  const [question, setQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2. Wrap fetchQuestion in useCallback
  // This memoizes the function, so it doesn't get redefined on every render
  const fetchQuestion = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/questions/${id}`);
      if (!response.ok) throw new Error('Question not found');
      const data = await response.json();
      setQuestion(data);
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]); // 3. Add `id` as a dependency for useCallback

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]); // 4. Now we can safely add `fetchQuestion`

  // Handle submitting a new human answer
  const handleAddAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) return alert('Please log in to answer.');

    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/questions/${id}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newAnswer })
      });

      if (!response.ok) throw new Error('Failed to submit answer');
      
      const addedAnswer = await response.json();
      setQuestion(prev => ({
        ...prev,
        answers: [...prev.answers, addedAnswer]
      }));
      setNewAnswer(''); // Clear textarea

    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle upvoting an answer
  const handleUpvote = async (answerId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert('Please log in to upvote.');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/questions/answers/${answerId}/upvote`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to upvote');
      
      const updatedAnswer = await response.json();
      
      // Update the state
      setQuestion(prev => ({
        ...prev,
        answers: prev.answers.map(a => 
          a._id === updatedAnswer._id ? updatedAnswer : a
        )
      }));

    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  if (isLoading) return <Loader />;
  if (!question) return <p>Question not found.</p>;

  // Sort answers by upvotes (descending)
  const sortedAnswers = [...question.answers].sort((a, b) => b.upvotes.length - a.upvotes.length);

  return (
    <div className="app-container">
      <div className="question-detail-container">
        
        {/* --- The Question --- */}
        <div className="question-post card-style">
          <span className="topic-badge">{question.topic}</span>
          <h1>{question.title}</h1>
          <p className="original-question-text">"{question.originalQuestion}"</p>
          <div className="question-meta">
            <span>Asked by {question.user?.name || 'User'}</span>
            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* --- The Answers --- */}
        <div className="answers-list">
          <h2>{question.answers.length} Answers</h2>
          {sortedAnswers.map(answer => (
            <div key={answer._id} className="answer-item card-style">
              <div className="answer-meta">
                <span className="answer-author">{answer.isAIGenerated ? 'PathFinder AI' : answer.user.name}</span>
                {answer.isAIGenerated && <span className="ai-badge">AI Answer</span>}
              </div>
              <ReactMarkdown>{answer.text}</ReactMarkdown>
              <div className="answer-actions">
                <button 
                  className="upvote-btn" 
                  onClick={() => handleUpvote(answer._id)}
                  // Style button if user has already upvoted
                  style={user && answer.upvotes.includes(user._id) ? {backgroundColor: 'var(--accent-color)', color: '#fff'} : {}}
                >
                  ▲ Upvote ({answer.upvotes.length})
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- Add Answer Form --- */}
        {user ? (
          <form onSubmit={handleAddAnswer} className="answer-form card-style">
            <h2>Your Answer</h2>
            <div className="form-group">
              <textarea 
                rows="6"
                placeholder="Share your knowledge..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post Answer'}
            </button>
          </form>
        ) : (
          <p>
            <Link to="/login">Log in</Link> or <Link to="/register">Register</Link> to post an answer.
          </p>
        )}
      </div>
    </div>
  );
};

export default QuestionDetailPage;
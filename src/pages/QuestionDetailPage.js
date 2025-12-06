import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';
import { Container, Card, Badge, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { FaArrowUp, FaUserCircle, FaRobot } from 'react-icons/fa';

const QuestionDetailPage = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuestion = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/questions/${id}`);
      if (!response.ok) throw new Error('Question not found');
      const data = await response.json();
      setQuestion(data);
    } catch (error) {
      toast.error("Failed to load question.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestion();
  }, [fetchQuestion]);

  const handleAddAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;
    if (!user) return toast.error("Please log in.");

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/questions/${id}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ text: newAnswer })
      });

      if (!response.ok) throw new Error('Failed');
      const addedAnswer = await response.json();
      
      setQuestion(prev => ({ ...prev, answers: [...prev.answers, addedAnswer] }));
      setNewAnswer('');
      toast.success("Answer posted!");
    } catch (error) {
      toast.error("Failed to post answer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (answerId) => {
    if (!user) return toast.error('Login to upvote.');
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/questions/answers/${answerId}/upvote`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed');
      const updatedAnswer = await response.json();
      
      setQuestion(prev => ({
        ...prev,
        answers: prev.answers.map(a => a._id === updatedAnswer._id ? updatedAnswer : a)
      }));
    } catch (error) {
      toast.error("Could not upvote.");
    }
  };

  if (isLoading) return <Container className="py-5 text-center"><div className="spinner-border text-primary"></div></Container>;
  if (!question) return <Container className="py-5 text-center"><h3>Question not found.</h3><Link to="/community">Back to Community</Link></Container>;

  const sortedAnswers = [...question.answers].sort((a, b) => b.upvotes.length - a.upvotes.length);

  return (
    <Container className="py-5 animate-slide-up">
      <Row className="justify-content-center">
        <Col lg={8}>
          {/* Question Card */}
          <Card className="border-0 shadow-md mb-4">
            <Card.Body className="p-4">
              <div className="d-flex flex-wrap gap-2 mb-3">
                <Badge bg="primary" className="rounded-pill px-3 py-2">{question.topic}</Badge>
                {question.tags.map((t, i) => <Badge key={i} bg="light" text="dark" className="border rounded-pill px-3 py-2">{t}</Badge>)}
              </div>
              <h2 className="fw-bold mb-3 text-dark">{question.title}</h2>
              <div className="bg-light p-4 rounded-4 border border-light text-muted fst-italic mb-3">
                "{question.originalQuestion}"
              </div>
              <div className="d-flex align-items-center text-muted small mt-3">
                <FaUserCircle className="me-2" size={16} />
                Asked by <span className="fw-bold text-dark mx-1">{question.user?.name || 'User'}</span> • {new Date(question.createdAt).toLocaleDateString()}
              </div>
            </Card.Body>
          </Card>

          <h4 className="fw-bold mb-4">{question.answers.length} Answers</h4>

          {/* Answers */}
          <div className="d-flex flex-column gap-3 mb-5">
            {sortedAnswers.map(answer => (
              <Card key={answer._id} className={`border-0 shadow-sm ${answer.isAIGenerated ? 'border-start border-4 border-success' : ''}`}>
                <Card.Body className="p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      {answer.isAIGenerated ? <FaRobot className="text-success me-2" size={20}/> : <FaUserCircle className="text-secondary me-2" size={20}/>}
                      <div>
                         <span className="fw-bold d-block">{answer.isAIGenerated ? 'PathFinder AI' : answer.user.name}</span>
                         <span className="text-muted small" style={{fontSize: '0.75rem'}}>{new Date(answer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {answer.isAIGenerated && <Badge bg="success" bg-opacity="10" className="text-success">AI Answer</Badge>}
                  </div>
                  
                  <div className="mb-4">
                    <ReactMarkdown>{answer.text}</ReactMarkdown>
                  </div>

                  <Button 
                    variant={user && answer.upvotes.includes(user._id) ? "primary" : "outline-secondary"}
                    size="sm"
                    className="rounded-pill px-3 d-flex align-items-center gap-2"
                    onClick={() => handleUpvote(answer._id)}
                  >
                    <FaArrowUp /> {answer.upvotes.length} Upvotes
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>

          {/* Answer Form */}
          {user ? (
            <Card className="border-0 shadow-sm card-hover">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3">Your Answer</h5>
                <Form onSubmit={handleAddAnswer}>
                  <Form.Group className="mb-3">
                    <Form.Control 
                      as="textarea" 
                      rows={5} 
                      placeholder="Share your knowledge..."
                      value={newAnswer}
                      onChange={(e) => setNewAnswer(e.target.value)}
                      className="bg-light border-0 p-3"
                    />
                  </Form.Group>
                  <Button type="submit" disabled={isSubmitting} variant="primary" className="rounded-pill px-4">
                    {isSubmitting ? 'Posting...' : 'Post Answer'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <Alert variant="info" className="text-center border-0 shadow-sm py-4">
              <Link to="/login" className="fw-bold text-decoration-none">Log in</Link> to join the discussion.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default QuestionDetailPage;
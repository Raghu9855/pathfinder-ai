import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Badge, Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';

const Loader = () => <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;

const QAPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [topic, setTopic] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/questions`);
        if (response.ok) setQuestions(await response.json());
      } catch (error) {
        toast.error("Failed to load questions.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (!topic || !questionText) return toast.error('Please fill in all fields.');
    const token = localStorage.getItem("token");
    if (!token) return toast.error('Please log in to ask a question.');

    setIsSubmitting(true);
    const toastId = toast.loading("Posting question...");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ originalQuestion: questionText, topic })
      });

      if (!response.ok) throw new Error('Failed to submit');

      const newQuestion = await response.json();
      setQuestions(prev => [newQuestion, ...prev]);

      toast.success("Question posted!", { id: toastId });
      navigate(`/community/${newQuestion._id}`);

    } catch (error) {
      toast.error("Could not submit question.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="py-5 animate-slide-up">
      <Row>
        <Col lg={8} className="mb-4">
          <h1 className="mb-4 fw-extrabold text-gradient">Community Q&A</h1>

          {user ? (
            <Card className="mb-5 border-0 shadow-lg glass-card overflow-hidden">
              <div className="h-1 bg-gradient-primary"></div>
              <Card.Body className="p-4 p-md-5">
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                  <span className="fs-4">💬</span> Ask a New Question
                </h5>
                <Form onSubmit={handleSubmitQuestion}>
                  <Form.Group className="mb-3">
                    <Form.Control
                      type="text"
                      placeholder="What topic ?"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="bg-transparent border-0 border-bottom rounded-0 shadow-none px-0 py-2 fs-5 text-main placeholder-muted"
                      style={{ borderBottom: '2px solid var(--border-color)' }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="What's on your mind? Be specific to get better answers..."
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      className="bg-light-subtle border-0 rounded-4 p-3 shadow-inner"
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-end">
                    <Button variant="primary" type="submit" disabled={isSubmitting} className="rounded-pill px-5 py-2 fw-bold shadow-sm d-flex align-items-center gap-2">
                      {isSubmitting ? <span className="spinner-border spinner-border-sm" /> : <>Start Discussion <i className="bi bi-send-fill small"></i></>}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <Alert variant="info" className="shadow-sm border-0 glass-card text-center py-4">
              <h5 className="mb-2">Want to join the conversation?</h5>
              <p className="mb-3">Log in to ask questions and help others.</p>
              <Link to="/login" className="btn btn-primary rounded-pill px-4">Log In Now</Link>
            </Alert>
          )}

          <div className="d-flex align-items-center justify-content-between mb-4">
            <h4 className="mb-0 fw-bold">Recent Discussions</h4>
            <span className="badge bg-light text-muted border rounded-pill px-3">{questions.length} Questions</span>
          </div>

          {isLoading ? <Loader /> : questions.length === 0 ? (
            <div className="text-center py-5 glass-card rounded-4 text-muted">
              <div className="fs-1 mb-3">📭</div>
              <h5>No questions yet</h5>
              <p>Be the first to start a discussion!</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {questions.map(q => (
                <Card key={q._id} className="border-0 shadow-sm card-hover glass-card mobile-scale" style={{ transition: 'all 0.2s ease' }}>
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <div className="flex-grow-1">
                        <Link to={`/community/${q._id}`} className="text-decoration-none stretched-link">
                          <h5 className="fw-bold mb-2 text-main text-truncate-2">{q.title}</h5>
                        </Link>
                        <p className="text-muted small mb-3 text-truncate">{q.originalQuestion}</p>
                        <div className="d-flex gap-2 flex-wrap" style={{ position: 'relative', zIndex: 2 }}>
                          {q.tags.map((tag, i) => <Badge key={i} bg="light" text="dark" className="border fw-normal px-2 py-1 rounded-pill">{tag}</Badge>)}
                        </div>
                      </div>
                      <div className="text-center bg-light bg-opacity-50 rounded-3 p-2 min-w-60">
                        <h4 className="mb-0 fw-bold text-primary">{q.answers.length}</h4>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>Answers</small>
                      </div>
                    </div>

                    <div className="d-flex align-items-center gap-2 mt-3 pt-3 border-top border-light-subtle small text-muted">
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 24, height: 24, fontSize: 10 }}>
                          {q.user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="fw-medium">{q.user?.name || 'Anonymous'}</span>
                      </div>
                      <span>•</span>
                      <span>{new Date(q.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </Col>
        <Col lg={4}>
          <Card className="border-0 bg-light p-4 rounded-4 sticky-top shadow-sm" style={{ top: '100px' }}>
            <Card.Body>
              <h5 className="fw-bold mb-3">About Community</h5>
              <p className="text-muted small">Join discussions, get answers from AI and peers, and track your learning journey together.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default QAPage;
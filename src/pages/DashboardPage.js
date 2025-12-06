import React, { useState } from 'react';
import SearchInput from '../components/SearchInput';
import RoadmapDisplay from '../components/RoadmapDisplay';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import toast from 'react-hot-toast';

const Loader = () => (
  <div className="text-center py-5">
    <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    <p className="mt-3 text-muted fw-medium">AI is architecting your learning path...</p>
  </div>
);

function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);

  const handleSearch = async (topic, week) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error("Please log in to generate a roadmap.");
      return;
    }
    if (!topic) {
      toast.error("Please enter a topic.");
      return;
    }

    setIsLoading(true);
    setRoadmap(null);
    const toastId = toast.loading("Consulting the AI mentor...");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/roadmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic, week }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Generation failed.", { id: toastId });
        return;
      }

      setRoadmap(data);
      toast.success("Roadmap ready!", { id: toastId });

    } catch (error) {
      toast.error("Network error. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="py-5 animate-slide-up">
      {!roadmap && !isLoading && (
        <div className="text-center py-5">
          <h1 className="display-3 fw-extrabold mb-3 text-shadow-sm">
            Master any skill with <span className="text-gradient">AI</span>
          </h1>
          <p className="lead text-muted mb-5" style={{ maxWidth: '700px', margin: '0 auto' }}>
            Enter a topic, and our AI will generate a personalized, step-by-step week-by-week learning roadmap just for you.
          </p>

          <Row className="justify-content-center">
            <Col md={12} lg={9}>
              <SearchInput onSearch={handleSearch} />
            </Col>
          </Row>

          <div className="d-flex justify-content-center gap-4 mt-5 flex-wrap">
            <div className="glass-card px-4 py-3 rounded-4 d-flex align-items-center gap-3 feature-card">
              <span className="fs-3">🚀</span>
              <div className="text-start">
                <div className="fw-bold">Instant Generation</div>
                <small className="text-muted">Seconds to start</small>
              </div>
            </div>
            <div className="glass-card px-4 py-3 rounded-4 d-flex align-items-center gap-3 feature-card">
              <span className="fs-3">📅</span>
              <div className="text-start">
                <div className="fw-bold">Weekly Plans</div>
                <small className="text-muted">Structured learning</small>
              </div>
            </div>
            <div className="glass-card px-4 py-3 rounded-4 d-flex align-items-center gap-3 feature-card">
              <span className="fs-3">🤖</span>
              <div className="text-start">
                <div className="fw-bold">AI Mentor</div>
                <small className="text-muted">24/7 Guidance</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <Row className="justify-content-center mt-5">
          <Col md={8} className="text-center">
            <Loader />
          </Col>
        </Row>
      )}

      {roadmap && (
        <Row className="justify-content-center mt-4">
          <Col lg={10}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold mb-0">Your Roadmap</h2>
              <button className="btn btn-outline-secondary btn-sm" onClick={() => setRoadmap(null)}>
                Generate Another
              </button>
            </div>
            <Alert variant="success" className="border-0 shadow-sm d-flex align-items-center">
              <i className="bi bi-check-circle-fill me-2"></i>
              <span>Roadmap generated! Go to <strong>My Roadmaps</strong> to save your progress permanently.</span>
            </Alert>
            <RoadmapDisplay
              roadmapData={roadmap}
              onProgressChange={() => toast("Save this roadmap to track progress!", { icon: '💾' })}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default DashboardPage;
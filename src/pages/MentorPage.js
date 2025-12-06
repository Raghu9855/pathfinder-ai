import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ChatMentor from '../components/ChatMentor';
import { Container, Row, Col, Form, Card, Alert } from 'react-bootstrap';

const MentorPage = () => {
  const { user } = useContext(AuthContext);
  const [myRoadmaps, setMyRoadmaps] = useState([]);
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchMyRoadmaps = async () => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/roadmaps`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) throw new Error("Failed to fetch");
          const data = await response.json();
          setMyRoadmaps(data);
        } catch (error) {
          console.error("Error fetching roadmaps:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMyRoadmaps();
    }
  }, [user]);

  const handleRoadmapChange = (e) => {
    const selectedRoadmapId = e.target.value;
    const selected = myRoadmaps.find(r => r._id === selectedRoadmapId);
    setActiveRoadmap(selected || null);
  };

  if (!user) {
    return (
      <Container className="py-5 text-center animate-slide-up">
        <Alert variant="warning">Please log in to chat with the AI Mentor.</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5 animate-slide-up">
      <div className="text-center mb-5">
        <h1 className="fw-extrabold text-gradient mb-2">AI Mentor</h1>
        <p className="text-muted">Get instant, context-aware guidance on your learning paths.</p>
      </div>

      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              {isLoading ? (
                <div className="text-center py-3"><div className="spinner-border text-primary"></div></div>
              ) : myRoadmaps.length > 0 ? (
                <Form.Group controlId="roadmapSelect">
                  <Form.Label className="fw-bold small text-uppercase text-muted mb-2">Select Active Roadmap</Form.Label>
                  <Form.Select 
                    size="lg" 
                    onChange={handleRoadmapChange} 
                    defaultValue=""
                    className="shadow-sm border-0 bg-light"
                  >
                    <option value="" disabled>-- Choose a Topic to Discuss --</option>
                    {myRoadmaps.map(roadmap => (
                      <option key={roadmap._id} value={roadmap._id}>
                        {roadmap.topic}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              ) : (
                 <Alert variant="info" className="text-center m-0">
                   You need to generate a roadmap first! Go to Dashboard.
                 </Alert>
              )}
            </Card.Body>
          </Card>

          {activeRoadmap ? (
            <div className="animate-fade-in">
              <ChatMentor key={activeRoadmap._id} roadmapData={activeRoadmap} />
            </div>
          ) : (
             !isLoading && myRoadmaps.length > 0 && (
              <div className="text-center py-5 text-muted opacity-50">
                <i className="bi bi-chat-dots display-1 mb-3 d-block"></i>
                <p>Select a roadmap above to start the conversation.</p>
              </div>
             )
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default MentorPage;
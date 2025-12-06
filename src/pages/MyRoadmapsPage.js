import React, { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FaPlus, FaArrowLeft, FaBookOpen } from 'react-icons/fa';

import RoadmapDisplay from '../components/RoadmapDisplay';
import ResourceModal from '../components/ResourceModal';
import RoadmapCard from '../components/RoadmapCard';
import { useRoadmaps } from '../hooks/useRoadmaps';

const MyRoadmapsPage = () => {
  const { roadmaps, isLoading, deleteRoadmap, shareRoadmap, updateProgress } = useRoadmaps();
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  // Resource Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResourceLoading, setIsResourceLoading] = useState(false);
  const [currentConcept, setCurrentConcept] = useState("");
  const [resources, setResources] = useState([]);

  const handleDeleteClick = async (roadmapId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this roadmap?")) {
      const success = await deleteRoadmap(roadmapId);
      if (success && selectedRoadmap?._id === roadmapId) {
        setSelectedRoadmap(null);
      }
    }
  };

  const handleProgressChange = async (roadmapId, concept, isCompleted) => {
    const updated = await updateProgress(roadmapId, concept, isCompleted);
    if (updated && selectedRoadmap?._id === roadmapId) {
      setSelectedRoadmap(updated);
    }
  };

  const handleFindResources = async (topic, concept) => {
    setCurrentConcept(concept);
    setIsResourceLoading(true);
    setIsModalOpen(true);
    setResources([]);

    // Ideally extract this to a hook too, but keeping it here for now
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/roadmap/resources`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ topic, concept })
      });
      const data = await response.json();
      setResources(data);
    } catch (e) { toast.error("No resources found"); }
    finally { setIsResourceLoading(false); }
  };

  if (selectedRoadmap) {
    return (
      <Container className="py-5 animate-slide-up">
        <div className="mb-4">
          <Button variant="link" className="text-decoration-none text-muted p-0 d-flex align-items-center" onClick={() => setSelectedRoadmap(null)}>
            <FaArrowLeft className="me-2" /> Back to Library
          </Button>
        </div>
        <RoadmapDisplay
          roadmapData={selectedRoadmap}
          onProgressChange={handleProgressChange}
          onFindResources={(concept) => handleFindResources(selectedRoadmap.topic, concept)}
        />
        <ResourceModal
          isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
          isLoading={isResourceLoading} concept={currentConcept} resources={resources}
        />
      </Container>
    );
  }

  return (
    <Container className="py-5 animate-slide-up">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="fw-bold mb-1">My Library</h1>
          <p className="text-muted">Manage your active learning paths.</p>
        </div>
        <Link to="/dashboard">
          <Button variant="primary" className="shadow-sm rounded-pill px-4">
            <FaPlus className="me-2" /> New Roadmap
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
      ) : roadmaps.length === 0 ? (
        <Card className="text-center border-0 shadow-sm py-5 bg-light rounded-4">
          <Card.Body>
            <FaBookOpen size={50} className="text-muted mb-3 opacity-50" />
            <h4>No Roadmaps Yet</h4>
            <p className="text-muted mb-4">Start your journey by creating a new learning path.</p>
            <Link to="/dashboard"><Button variant="outline-primary" className="rounded-pill px-4">Get Started</Button></Link>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          {roadmaps.map((roadmap) => (
            <Col md={6} lg={4} key={roadmap._id}>
              <RoadmapCard
                roadmap={roadmap}
                onClick={setSelectedRoadmap}
                onShare={(id, e) => { e.stopPropagation(); shareRoadmap(id); }}
                onDelete={handleDeleteClick}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyRoadmapsPage;
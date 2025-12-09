import React from 'react';
import { Card, Badge, Button, ProgressBar } from 'react-bootstrap';
import { FaShareAlt, FaTrash } from 'react-icons/fa';

const RoadmapCard = ({ roadmap, onClick, onShare, onDelete }) => {
    const total = roadmap.roadmap?.weeks?.reduce((acc, w) => acc + w.concepts.length, 0) || 0;
    const completed = roadmap.completedConcepts?.length || 0;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <Card
            className="h-100 border-0 shadow-sm card-hover glass-card"
            style={{ cursor: 'pointer' }}
            onClick={() => onClick(roadmap)}
        >
            <Card.Body className="d-flex flex-column p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <Badge bg="light" text="primary" className="border border-primary-subtle">
                        {roadmap.roadmap.weeks.length} Weeks
                    </Badge>
                    <div className="d-flex gap-2" onClick={e => e.stopPropagation()}>
                        <Button
                            variant="light"
                            size="sm"
                            className="text-muted rounded-circle p-2"
                            onClick={(e) => onShare(roadmap._id, e)}
                            aria-label="Share Roadmap"
                        >
                            <FaShareAlt />
                        </Button>
                        <Button
                            variant="light"
                            size="sm"
                            className="text-danger rounded-circle p-2"
                            onClick={(e) => onDelete(roadmap._id, e)}
                            aria-label="Delete Roadmap"
                        >
                            <FaTrash />
                        </Button>
                    </div>
                </div>
                <Card.Title className="fw-bold text-capitalize mb-1">{roadmap.topic}</Card.Title>
                <small className="text-muted mb-4">Created on {new Date(roadmap.createdAt).toLocaleDateString()}</small>
                <div className="mt-auto">
                    <div className="d-flex justify-content-between text-muted small mb-2">
                        <span>Progress</span>
                        <span className="fw-bold">{percentage}%</span>
                    </div>
                    <ProgressBar now={percentage} variant={percentage === 100 ? "success" : "primary"} style={{ height: '8px', borderRadius: '10px' }} />
                </div>
            </Card.Body>
        </Card>
    );
};

export default RoadmapCard;

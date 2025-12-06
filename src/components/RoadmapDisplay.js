import React, { useMemo, useCallback, memo } from "react";
import { Accordion, Card, Form, Button } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';

// --- Sub-Component for Individual Concept ---
const ConceptItem = memo(({
  concept,
  isCompleted,
  roadmapId,
  weekIndex,
  conceptIndex,
  onToggle,
  onResources
}) => {
  const checkboxId = `${roadmapId}-${weekIndex}-${conceptIndex}`;

  return (
    <Card className={`border-0 shadow-sm transition-all ${isCompleted ? 'bg-success bg-opacity-10' : 'bg-white bg-opacity-75'}`}>
      <Card.Body className="p-3 d-flex align-items-center justify-content-between">
        <Form.Check
          type="checkbox"
          id={checkboxId}
          className="d-flex align-items-center gap-2 flex-grow-1"
          label={
            <span className={isCompleted ? 'text-decoration-line-through text-muted' : 'fw-medium'}>
              {concept}
            </span>
          }
          checked={isCompleted}
          onChange={() => onToggle(concept, !isCompleted)}
        />

        {!isCompleted && onResources && (
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onResources(concept)}
            className="ms-3 rounded-pill px-3"
          >
            Resources
          </Button>
        )}
        {isCompleted && <FaCheckCircle className="text-success ms-3" />}
      </Card.Body>
    </Card>
  );
});

// --- Main Component ---
const RoadmapDisplay = ({ roadmapData, onProgressChange, onFindResources }) => {
  const { roadmap, _id: roadmapId, completedConcepts = [] } = roadmapData;

  // Memoize handlers
  const handleToggle = useCallback((concept, isCompleted) => {
    onProgressChange(roadmapId, concept, isCompleted);
  }, [onProgressChange, roadmapId]);

  // Memoize stats calculation
  const stats = useMemo(() => {
    if (!roadmap?.weeks) return { total: 0, completed: 0, percent: 0 };

    const total = roadmap.weeks.reduce((acc, week) => acc + week.concepts.length, 0);
    const completed = completedConcepts.length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, percent };
  }, [roadmap, completedConcepts]);

  if (!roadmap) return <p className="text-center mt-5 text-muted">No roadmap data available.</p>;

  return (
    <div className="roadmap-display pb-5">
      <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
        <div>
          <h1 className="fw-bold mb-1 text-gradient">{roadmap.title}</h1>
          <p className="text-muted mb-0">Track your weekly progress below</p>
        </div>
        <div className="text-end">
          <h2 className="fw-bold text-primary mb-0">{stats.percent}%</h2>
          <small className="text-muted">Completed</small>
        </div>
      </div>

      <Accordion defaultActiveKey="0" className="shadow-sm rounded-3 overflow-hidden glass-card">
        {roadmap.weeks?.map((week, index) => (
          <Accordion.Item eventKey={index.toString()} key={index} className="border-0 border-bottom bg-transparent">
            <Accordion.Header>
              <span className="fw-bold me-2 text-primary">Week {week.week}:</span> {week.focus}
            </Accordion.Header>
            <Accordion.Body className="bg-transparent">
              <div className="d-flex flex-column gap-2">
                {week.concepts.map((concept, conceptIndex) => (
                  <ConceptItem
                    key={conceptIndex}
                    concept={concept}
                    isCompleted={completedConcepts.includes(concept)}
                    roadmapId={roadmapId}
                    weekIndex={index}
                    conceptIndex={conceptIndex}
                    onToggle={handleToggle}
                    onResources={onFindResources}
                  />
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default memo(RoadmapDisplay);
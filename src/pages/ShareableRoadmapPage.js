import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// A simple loader component
const Loader = () => (
  <div className="loader-container">
    <div className="loader-dots">
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
  </div>
);

const ShareableRoadmapPage = () => {
  const [roadmapData, setRoadmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { shareableId } = useParams(); // Get the ID from the URL

  useEffect(() => {
    const fetchSharedRoadmap = async () => {
      try {
        setIsLoading(true);
        // This is our new public API endpoint
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/roadmap/share/${shareableId}`);
        
        if (!response.ok) {
          throw new Error('Roadmap not found or is no longer shared.');
        }
        
        const data = await response.json();
        setRoadmapData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedRoadmap();
  }, [shareableId]); // Re-run if the ID changes

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="app-container">
        <h1 style={{ textAlign: 'center', color: '#ff4d4d' }}>Error</h1>
        <p style={{ textAlign: 'center' }}>{error}</p>
      </div>
    );
  }

  if (!roadmapData) {
    return null; // Should be handled by loading/error
  }

  const { roadmap, topic } = roadmapData;

  return (
    <div className="app-container">
      <div className="shareable-roadmap-container">
        <h2>{roadmap.title}</h2>
        <p>A shareable {roadmap.weeks.length}-week roadmap for <strong>{topic}</strong>.</p>
        
        <div className="roadmap-container">
          {roadmap.weeks?.map((week, index) => (
            <div key={index} className="roadmap-card">
              <h3>
                Week {week.week}: {week.focus}
              </h3>
              {/* This is a read-only list */}
              <ul className="concepts-list">
                {week.concepts.map((concept, conceptIndex) => (
                  <li key={conceptIndex}>
                    {concept}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareableRoadmapPage;

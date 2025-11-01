import React from "react";

// 1. Update props to receive roadmapData and the handler
function RoadmapDisplay({ roadmapData, onProgressChange }) {
  
  // 2. Destructure the full document
  const { roadmap, _id: roadmapId, completedConcepts } = roadmapData;

  if (!roadmap) {
    return <p>No roadmap data available.</p>;
  }

  // 3. Handler to pass data up to HomePage
  const handleCheckboxChange = (concept, isCompleted) => {
    onProgressChange(roadmapId, concept, isCompleted);
  };

  return (
    <div className="roadmap-display">
      <h2>{roadmap.title}</h2>
      <div className="roadmap-container">
        {roadmap.weeks?.map((week, index) => (
        <div key={index} className="roadmap-card">
          <h3>
            Week {week.week}: {week.focus}
          </h3>
          <ul>
            {week.concepts.map((concept, conceptIndex) => {
              // 4. Check if this concept is in our completed list
              const isCompleted = completedConcepts.includes(concept);
              const checkboxId = `${roadmapId}-${index}-${conceptIndex}`;

              return (
                <li key={conceptIndex} style={{ listStyleType: 'none', margin: '5px 0' }}>
                  {/* 5. Render the checkbox and label */}
                  <input 
                    type="checkbox"
                    id={checkboxId}
                    checked={isCompleted}
                    onChange={() => handleCheckboxChange(concept, !isCompleted)}
                    style={{ marginRight: '10px' }}
                  />
                  <label 
                    htmlFor={checkboxId}
                    style={{ textDecoration: isCompleted ? 'line-through' : 'none', cursor: 'pointer' }}
                  >
                    {concept}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

      ))}
      </div>
    </div>
  );
}

export default RoadmapDisplay;
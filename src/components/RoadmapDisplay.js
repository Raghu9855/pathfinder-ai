import React from "react";
// We don't need ChatMentor here anymore
// import ChatMentor from './ChatMentor'; 

// 1. Add "onFindResources" to the props
function RoadmapDisplay({ roadmapData, onProgressChange, onFindResources }) {
  
  const { roadmap, _id: roadmapId, completedConcepts } = roadmapData;

  if (!roadmap) {
    return <p>No roadmap data available.</p>;
  }

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
          {/* We are changing from <ul> to <div> for better layout */}
          <div className="concepts-list-container">
            {week.concepts.map((concept, conceptIndex) => {
              const isCompleted = completedConcepts.includes(concept);
              const checkboxId = `${roadmapId}-${index}-${conceptIndex}`;

              return (
                // 2. This is now a container for each concept
                <div key={conceptIndex} className="concept-item">
                  <div className="concept-label-wrapper">
                    <input 
                      type="checkbox"
                      id={checkboxId}
                      checked={isCompleted}
                      onChange={() => handleCheckboxChange(concept, !isCompleted)}
                    />
                    <label 
                      htmlFor={checkboxId}
                      style={{ textDecoration: isCompleted ? 'line-through' : 'none', cursor: 'pointer' }}
                    >
                      {concept}
                    </label>
                  </div>
                  {/* 3. Add the new "Find Resources" button */}
                  {!isCompleted && onFindResources && (
                    <button 
                      className="find-resources-btn"
                      onClick={() => onFindResources(concept)}
                    >
                      Find Resources
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      ))}
      </div>
      {/* We no longer show the chat mentor here */}
    </div>
  );
}

export default RoadmapDisplay;
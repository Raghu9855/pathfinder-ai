import React from "react";

function RoadmapDisplay({ roadmap }) {
  console.log(roadmap);
  if (!roadmap) {
    return <p>No roadmap data available.</p>;
  }

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
            {week.concepts.map((concept, conceptIndex) => (
              <li key={conceptIndex}>{concept}</li>
            ))}
          </ul>
        </div>

      ))}
      </div>
    </div>
  );
}

export default RoadmapDisplay;

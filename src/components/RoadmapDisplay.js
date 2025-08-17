

function RoadmapDisplay({roadmap}) {
  if (!roadmap) {
    return <p>No roadmap data available.</p>;
  }else{
    return (
      <div className="roadmap-content">
      <h2>{roadmap.title}</h2>
      {roadmap.weeks.map((week, index) => (
        <div key={index} className="week-section">
          <h3>Week {week.week}: {week.focus}</h3>
          <ul>
            {week.concepts.map((concept, conceptIndex) => (
              <li key={conceptIndex}>{concept}</li>
            ))}
          </ul>
        </div>
      ))}
      </div>
    );
  }
}
   
export default RoadmapDisplay;
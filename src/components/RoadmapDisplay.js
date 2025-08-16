function RoadmapDisplay({roadmap}) {
  if (!roadmap) {
    return <p>No roadmap data available.</p>;
  }
  return (
    <div className="roadmap-display">
      <h2>{roadmap.title}</h2>
      <ul>
        {roadmap.weeks && roadmap.weeks.map((week, index) => (   
          <li key={index}> Week {week.week}: {week.topic}</li>
        ))}
      </ul>
    </div>
  );
}
export default RoadmapDisplay;
import ReactMarkdown from 'react-markdown';

function RoadmapDisplay({roadmap}) {
  if (!roadmap) {
    return <p>No roadmap data available.</p>;
  }else{
    return (
      <div className="roadmap-content">
      <ReactMarkdown>{roadmap}</ReactMarkdown>
      </div>
    );
  }
}
   
export default RoadmapDisplay;
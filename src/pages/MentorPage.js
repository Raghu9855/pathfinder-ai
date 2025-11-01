import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ChatMentor from '../components/ChatMentor';

const MentorPage = () => {
  const { user } = useContext(AuthContext);
  const [myRoadmaps, setMyRoadmaps] = useState([]);
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all of the user's roadmaps (this part is unchanged)
  useEffect(() => {
    if (user) {
      const fetchMyRoadmaps = async () => {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/roadmaps`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!response.ok) throw new Error("Failed to fetch roadmaps");
          const data = await response.json();
          setMyRoadmaps(data);
        } catch (error) {
          console.error("Error fetching roadmaps:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMyRoadmaps();
    }
  }, [user]);

  // This is simplified. It just finds the selected roadmap and sets it.
  const handleRoadmapChange = (e) => {
    const selectedRoadmapId = e.target.value;
    const selected = myRoadmaps.find(r => r._id === selectedRoadmapId);
    setActiveRoadmap(selected || null);
  };

  if (!user) {
    return (
      <div className="app-container">
        <h1>AI Mentor</h1>
        <p>Please log in to chat with the mentor.</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="mentor-page-container">
        <h1>🤖 AI Mentor</h1>
        <p>Select one of your saved roadmaps to start a chat session.</p>

        {isLoading && <p>Loading your roadmaps...</p>}

        {myRoadmaps.length > 0 && (
          <div className="roadmap-selector">
            <label htmlFor="roadmap-select">Your Roadmaps:</label>
            <select id="roadmap-select" onChange={handleRoadmapChange} defaultValue="">
              <option value="" disabled>-- Select a roadmap --</option>
              {myRoadmaps.map(roadmap => (
                <option key={roadmap._id} value={roadmap._id}>
                  {roadmap.topic}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* This is the key change. We render ChatMentor *only if* a roadmap is active.
          We pass the roadmapId as a 'key'. This forces React to re-create the
          component (and run its useEffect hooks) every time the ID changes.
        */}
        {activeRoadmap ? (
          <ChatMentor key={activeRoadmap._id} roadmapData={activeRoadmap} />
        ) : (
          !isLoading && myRoadmaps.length > 0 && (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              Please select a roadmap above to begin.
            </p>
          )
        )}
         {!isLoading && myRoadmaps.length === 0 && (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              You don't have any saved roadmaps. Go to the Home page to create one!
            </p>
          )}
      </div>
    </div>
  );
};

export default MentorPage;
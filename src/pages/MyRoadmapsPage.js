import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import RoadmapDisplay from '../components/RoadmapDisplay';
import ResourceModal from '../components/ResourceModal';

const MyRoadmapsPage = () => {
  const [myRoadmaps, setMyRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null); // The roadmap to display
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // State for the resource modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResourceLoading, setIsResourceLoading] = useState(false);
  const [currentConcept, setCurrentConcept] = useState("");
  const [resources, setResources] = useState([]);

  // Fetch all roadmaps on page load
  useEffect(() => {
    const fetchMyRoadmaps = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      try {
        setIsLoading(true);
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

    if (user) {
      fetchMyRoadmaps();
    }
  }, [user]);

  // Handle Deleting a Roadmap
  const handleDelete = async (roadmapId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (!window.confirm("Are you sure you want to delete this roadmap?")) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/roadmaps/${roadmapId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete.');

      setMyRoadmaps(prev => prev.filter(r => r._id !== roadmapId));
      if (selectedRoadmap && selectedRoadmap._id === roadmapId) {
        setSelectedRoadmap(null); // Clear display if deleted
      }
    } catch (error) {
      console.error("Error deleting roadmap:", error);
    }
  };

  // Handle Sharing a Roadmap
  const handleShareRoadmap = async (roadmapId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/roadmap/${roadmapId}/share`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to create shareable link.');

      const data = await response.json();
      const shareableLink = `${window.location.origin}/roadmap/share/${data.shareableId}`;
      
      await navigator.clipboard.writeText(shareableLink);
      alert("Shareable link copied to clipboard!");
      
    } catch (error) {
      console.error("Error creating share link:", error);
      alert("Error: Could not create a shareable link.");
    }
  };

  // Handle Progress Change
  const handleProgressChange = async (roadmapId, concept, isCompleted) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/roadmaps/${roadmapId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ concept, completed: isCompleted })
      });

      if (!response.ok) throw new Error('Failed to update progress');

      const updatedRoadmap = await response.json();
      
      setSelectedRoadmap(updatedRoadmap); // Update the one being displayed
      setMyRoadmaps(prev => prev.map(r => r._id === updatedRoadmap._id ? updatedRoadmap : r));
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  // Handle Find Resources
  const handleFindResources = async (topic, concept) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setCurrentConcept(concept);
    setIsResourceLoading(true);
    setIsModalOpen(true);
    setResources([]); 

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/roadmap/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ topic, concept })
      });

      if (!response.ok) {
        throw new Error('Failed to find resources.');
      }

      const data = await response.json();
      setResources(data);
    
    } catch (error) {
      console.error("Error finding resources:", error);
      setResources([]); 
    } finally {
      setIsResourceLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="my-roadmaps-list">
        <h2>My Roadmaps</h2>
        {isLoading && <p>Loading...</p>}
        {myRoadmaps.length === 0 && !isLoading ? (
          <p>No roadmaps saved yet. Go to the dashboard to create one!</p>
        ) : (
          <ul>
            {myRoadmaps.map((savedRoadmap) => (
              <li key={savedRoadmap._id} className="roadmap-item">
                <button onClick={() => setSelectedRoadmap(savedRoadmap)}>
                  {savedRoadmap.topic}
                </button>
                <span className="roadmap-date">{new Date(savedRoadmap.createdAt).toLocaleDateString()}</span>
                <button
                  onClick={() => handleShareRoadmap(savedRoadmap._id)}
                  style={{ marginLeft: '10px', backgroundColor: '#3498db', color: 'white' }}
                >
                  Share
                </button>
                <button 
                  onClick={() => handleDelete(savedRoadmap._id)} 
                  style={{ marginLeft: '10px', backgroundColor: '#ff4d4d', color: 'white' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* This section will show the roadmap when one is selected */}
      {selectedRoadmap && (
        <RoadmapDisplay 
          roadmapData={selectedRoadmap}
          onProgressChange={handleProgressChange}
          // --- THIS IS THE FIX ---
          // We pass the handler function as a prop here
          onFindResources={(concept) => handleFindResources(selectedRoadmap.topic, concept)}
        />
      )}

      {/* This renders the modal (it's hidden by default) */}
      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoading={isResourceLoading}
        concept={currentConcept}
        resources={resources}
      />
    </div>
  );
};

export default MyRoadmapsPage;
import SearchInput from '../components/SearchInput';
import RoadmapDisplay from '../components/RoadmapDisplay';
import React,{useState,useEffect,useContext} from 'react';
import {AuthContext} from "../context/AuthContext";

function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [myRoadmaps, setMyRoadmaps] = useState([]); 
  const { user } = useContext(AuthContext);

  // Fetch user's saved roadmaps
  useEffect(() => {
    const fetchMyRoadmaps = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/roadmaps`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch roadmaps");
        const data = await response.json();
        setMyRoadmaps(data);
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
      }
    };

    if (user) {
      fetchMyRoadmaps();
    } else {
      setMyRoadmaps([]);
      setRoadmap(null);
    }
  }, [user]); // re-fetch on login + new roadmap

  // Generate a new roadmap
  const handleSearch = async (topic) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You must be logged in to generate a roadmap.");
      return;
    }

    setIsLoading(true);
    setRoadmap(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/roadmap`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      setRoadmap(data.roadmap); 
    } catch (error) {
      console.error("Error fetching roadmap:", error);
    } finally {
      setIsLoading(false);
    }
  };

// Inside your HomePage component

const handleDelete = async (roadmapId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to delete a roadmap.");
    return;
  }

  // Optional: Ask for confirmation before deleting
  if (!window.confirm("Are you sure you want to delete this roadmap?")) {
    return;
  }

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/roadmaps/${roadmapId}`, {
      method: 'DELETE', // Use the DELETE HTTP method
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete the roadmap.');
    }

    // If successful, remove the roadmap from the local state
    setMyRoadmaps(prevRoadmaps => 
      prevRoadmaps.filter(roadmap => roadmap._id !== roadmapId)
    );

  } catch (error) {
    console.error("Error deleting roadmap:", error);
    // Optionally, set an error state to show a message to the user
  }
};

  return (
    <div className="app-container">
      <h1>PathFinder AI</h1>
      <SearchInput onSearch={handleSearch} />
      <div>
        {isLoading ? (
          <p>Generating Path.....</p>
        ) : roadmap ? (
          <RoadmapDisplay roadmap={roadmap} />
        ) : null}
      </div>

    <div className="my-roadmaps-list">
      <h2>My Roadmaps</h2>
      {myRoadmaps.length === 0 ? (
        <p>No roadmaps saved yet.</p>
      ) : (
        <ul>
          {myRoadmaps.map((savedRoadmap) => (
            <li key={savedRoadmap._id} className="roadmap-item">
              
              {/* Button to view the roadmap */}
              <button onClick={() => setRoadmap(savedRoadmap.roadmap.roadmap)}>
                {savedRoadmap.topic}
              </button>
              <span className="roadmap-date">{new Date(savedRoadmap.createdAt).toLocaleDateString()}</span>
              {/* Button to delete the roadmap */}
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
  </div>
);

}



export default HomePage;



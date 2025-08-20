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
        const response = await fetch("http://localhost:5001/api/roadmaps", {
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

    if (user) fetchMyRoadmaps();
  }, [user, roadmap]); // re-fetch on login + new roadmap

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
      const response = await fetch('http://localhost:5001/api/roadmap', {
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

      <div className="my-roadmaps">
        <h2>My Roadmaps</h2>
        {myRoadmaps.length === 0 ? (
          <p>No roadmaps saved yet.</p>
        ) : (
         <ul>
            {myRoadmaps.map((roadmap) => (
              // Add roadmap.topic inside the li tag to display it
              <li key={roadmap._id}>{roadmap.topic}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default HomePage;

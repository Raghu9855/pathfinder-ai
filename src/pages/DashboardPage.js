import SearchInput from '../components/SearchInput';
import RoadmapDisplay from '../components/RoadmapDisplay';
import React, { useState } from 'react';

const Loader = () => (
  <div className="loader-container">
    <div className="loader-dots">
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
    <p className="loader-text">Generating your path...</p>
  </div>
);

// This is now the "Search/Generate" page
function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null); // This holds the *newly* generated roadmap

  // This handler is now much simpler
  const handleSearch = async (topic, week) => {
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
        body: JSON.stringify({ topic, week }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error);
        return;
      }
      // We set the full roadmap document here.
      // We will pass the necessary parts to RoadmapDisplay
      setRoadmap(data); 
    } catch (error) {
      console.error("Error fetching roadmap:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // We need a dummy progress handler for the RoadmapDisplay,
  // since it's not connected to the "My Roadmaps" list here.
  // A better refactor would be to have a separate "NewRoadmapDisplay" component.
  const handleDummyProgress = () => {
    alert("Please go to 'My Roadmaps' to track your progress!");
  };

  return (
    <div className="app-container">
      <h1>PathFinder AI</h1>
      <SearchInput onSearch={handleSearch} />
      <div>
        {isLoading ? (
          <Loader />
        ) : roadmap ? (
          // Pass the new roadmap data to the display
          <RoadmapDisplay 
            roadmapData={roadmap}
            onProgressChange={handleDummyProgress} 
          />
        ) : null}
      </div>
    </div>
  );
}

export default DashboardPage;
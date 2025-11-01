import React, { useState, useEffect } from 'react';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/leaderboard`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        
        const data = await response.json();
        setLeaderboard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []); // Runs once on component mount

  // Helper for rendering the list
  const renderList = () => {
    if (isLoading) {
      return <p>Loading leaderboard...</p>;
    }
    if (error) {
      return <p style={{ color: 'red' }}>{error}</p>;
    }
    if (leaderboard.length === 0) {
      return <p>No one is on the leaderboard yet. Start learning!</p>;
    }

    return (
      <ol className="leaderboard-list">
        {leaderboard.map((entry, index) => (
          <li key={index} className="leaderboard-item">
            <span className="leaderboard-rank">{index + 1}</span>
            <span className="leaderboard-name">{entry.name}</span>
            <span className="leaderboard-score">{entry.score} Concepts</span>
          </li>
        ))}
      </ol>
    );
  };

  return (
    <div className="app-container">
      <div className="leaderboard-container">
        <h1>🏆 Leaderboard</h1>
        <p>Top 10 users by total concepts completed.</p>
        {renderList()}
      </div>
    </div>
  );
};

export default LeaderboardPage;
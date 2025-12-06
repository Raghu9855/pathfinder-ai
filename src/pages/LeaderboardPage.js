import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge } from 'react-bootstrap';
import { FaTrophy, FaMedal, FaCrown } from 'react-icons/fa';

const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/leaderboard`);
        if (res.ok) setLeaderboard(await res.json());
      } catch (e) { console.error(e); }
      finally { setIsLoading(false); }
    };
    fetchLeaderboardData();
  }, []);

  const renderRank = (index) => {
    if (index === 0) return <FaCrown className="text-warning" size={28} />;
    if (index === 1) return <FaMedal style={{ color: '#94a3b8' }} size={24} />;
    if (index === 2) return <FaMedal style={{ color: '#b45309' }} size={24} />;
    return <span className="fw-bold text-muted fs-5">#{index + 1}</span>;
  };

  const getRowStyle = (index) => {
    if (index === 0) return { background: 'linear-gradient(90deg, rgba(255,215,0,0.1) 0%, rgba(255,255,255,0) 100%)', borderLeft: '4px solid #ffd700' };
    return { borderLeft: '4px solid transparent' };
  };

  return (
    <Container className="py-5 animate-slide-up">
      <div className="text-center mb-5">
        <h1 className="fw-extrabold mb-2">Hall of Fame <FaTrophy className="text-warning ms-2" /></h1>
        <p className="text-muted">The top 10 learners mastering new skills.</p>
      </div>

      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="border-0 shadow-lg overflow-hidden glass-card">
            {isLoading ? (
              <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center p-5 text-muted">No champions yet. Be the first!</div>
            ) : (
              <div className="list-group list-group-flush bg-transparent">
                {leaderboard.map((user, idx) => {
                  let rankClass = '';
                  if (idx === 0) rankClass = 'rank-gold';
                  if (idx === 1) rankClass = 'rank-silver';
                  if (idx === 2) rankClass = 'rank-bronze';

                  return (
                    <div
                      key={idx}
                      className={`list-group-item d-flex align-items-center justify-content-between p-3 py-4 border-bottom-0 mobile-scale ${rankClass}`}
                      style={{ transition: 'all 0.3s ease' }}
                    >
                      <div className="d-flex align-items-center gap-4">
                        <div style={{ width: 40, textAlign: 'center', transform: idx < 3 ? 'scale(1.2)' : 'none' }}>{renderRank(idx)}</div>
                        <div>
                          <h5 className="mb-0 fw-bold">{user.name}</h5>
                          {idx === 0 && <span className="badge bg-gradient-yellow text-dark rounded-pill small mt-1 shadow-sm">👑 CURRENT CHAMPION</span>}
                        </div>
                      </div>
                      <div className="text-end">
                        <h4 className="mb-0 fw-bold text-gradient">{user.score}</h4>
                        <small className="text-muted">Concepts</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LeaderboardPage;
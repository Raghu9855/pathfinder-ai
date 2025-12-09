import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaTwitter, FaGithub, FaLinkedin, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer-section py-4 mt-auto glass-footer">
      <Container>
        <Row className="gy-4 justify-content-between">

          {/* Column 1: Brand & Mission */}
          <Col lg={4} md={6}>
            <div className="mb-3">
              <span className="fw-extrabold fs-4 text-gradient">PathFinder AI</span>
            </div>
            <p className="text-muted small mb-4" style={{ maxWidth: '300px', lineHeight: '1.6' }}>
              Your personalized AI learning mentor. Turn any topic into a structured roadmap and master new skills faster than ever.
            </p>
            <div className="d-flex gap-2">
              <Button variant="outline-secondary" className="social-btn rounded-circle p-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <FaTwitter />
              </Button>
              <Button variant="outline-secondary" className="social-btn rounded-circle p-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <FaGithub />
              </Button>
              <Button variant="outline-secondary" className="social-btn rounded-circle p-0 d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <FaLinkedin />
              </Button>
            </div>
          </Col>

          {/* Column 2: Product */}
          <Col lg={2} md={3} xs={6}>
            <h6 className="fw-bold mb-3 text-main">Product</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/dashboard" className="footer-link">Generate Roadmap</Link></li>
              <li><Link to="/mentor" className="footer-link">AI Mentor</Link></li>
              <li><Link to="/roadmaps" className="footer-link">My Library</Link></li>
              <li><Link to="/leaderboard" className="footer-link">Leaderboard</Link></li>
            </ul>
          </Col>

          {/* Column 3: Community */}
          <Col lg={2} md={3} xs={6}>
            <h6 className="fw-bold mb-3 text-main">Community</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><Link to="/community" className="footer-link">Q&A Forum</Link></li>
              <li><a href="#!" className="footer-link">Discord</a></li>
              <li><a href="#!" className="footer-link">Twitter</a></li>
              <li><Link to="/register" className="footer-link">Join Us</Link></li>
            </ul>
          </Col>

          {/* Column 4: Legal */}
          <Col lg={2} md={3} xs={6}>
            <h6 className="fw-bold mb-3 text-main">Legal</h6>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li><a href="#!" className="footer-link">Privacy Policy</a></li>
              <li><a href="#!" className="footer-link">Terms of Service</a></li>
              <li><a href="#!" className="footer-link">Cookie Policy</a></li>
            </ul>
          </Col>

        </Row>

        <hr className="my-4 border-secondary opacity-10" />

        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start mb-2 mb-md-0">
            <p className="small text-muted mb-0">
              &copy; {new Date().getFullYear()} PathFinder AI. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="small text-muted mb-0 d-flex align-items-center justify-content-center justify-content-md-end">
              Made with <FaHeart className="text-danger mx-1 animate-pulse" /> and React
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
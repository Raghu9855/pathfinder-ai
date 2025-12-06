import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    const loginPromise = (async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      login(data.user);
      navigate("/");
    })();

    toast.promise(loginPromise, {
      loading: 'Logging in...',
      success: 'Welcome back!',
      error: (err) => `${err.message}`,
    });
  };

  return (
    <Container className="py-5 animate-slide-up">
      <Row className="justify-content-center align-items-center" style={{ minHeight: "75vh" }}>
        <Col md={6} lg={5}>
          <Card className="border-0 shadow-lg p-4 glass-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <Card.Body className="p-4">
              <div className="text-center mb-5">
                <h1 className="fw-extrabold mb-2 text-gradient display-6">Welcome Back</h1>
                <p className="text-muted">Please sign in to continue.</p>
              </div>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '1px' }}>Email Address</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                      <i className="bi bi-envelope-fill"></i>
                    </span>
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      size="lg"
                      className="border-start-0 ps-0 bg-transparent text-main"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-5">
                  <Form.Label className="fw-bold small text-muted text-uppercase mb-2" style={{ letterSpacing: '1px' }}>Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-end-0 text-muted" style={{ borderColor: 'var(--border-color)' }}>
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <Form.Control
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      size="lg"
                      className="border-start-0 ps-0 bg-transparent text-main"
                    />
                  </div>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 py-3 mb-4 rounded-pill fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2">
                  Sign In <i className="bi bi-arrow-right"></i>
                </Button>
              </Form>
              <div className="text-center pt-3 border-top border-light-subtle">
                <p className="text-muted mb-0">Don't have an account? <Link to="/register" className="text-primary fw-bold text-decoration-none">Sign Up Free</Link></p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
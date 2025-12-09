import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FaSearch, FaCalendarAlt, FaArrowRight, FaMagic } from "react-icons/fa";

function SearchInput({ onSearch }) {
  const [topic, setTopic] = useState('');
  const [week, setWeek] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(topic, week);
  };

  return (
    <Form onSubmit={handleSubmit} className="w-100 position-relative z-1">
      <div className="search-bar-container d-flex align-items-center">
        
        {/* Topic */}
        <div className="d-flex align-items-center flex-grow-1 px-3 border-end" style={{borderColor: 'var(--border-color)'}}>
          <FaSearch className="text-primary me-3" />
          <Form.Control
            type="text"
            placeholder="What do you want to master?"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="shadow-none"
            style={{ fontSize: '1.1rem', height: '55px' }}
          />
        </div>

        {/* Weeks */}
        <div className="d-flex align-items-center px-3" style={{ width: '220px' }}>
          <FaCalendarAlt className="text-muted me-3" />
          <Form.Control
            type="number"
            placeholder="Weeks"
            min={1}
            max={52}
            value={week}
            onChange={(e) => setWeek(e.target.value)}
            className="shadow-none"
            style={{ fontSize: '1.1rem', height: '55px' }}
          />
        </div>

        {/* Button */}
        <div className="p-1">
          <Button 
            type="submit" 
            variant="primary" 
            className="h-100 d-flex align-items-center gap-2 px-4 py-2"
          >
            <FaMagic /> <span>Generate</span>
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default SearchInput;
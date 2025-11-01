import React from 'react';

// Re-using the same loader from your dashboard
const Loader = () => (
  <div className="loader-container">
    <div className="loader-dots">
      <span className="dot"></span>
      <span className="dot"></span>
      <span className="dot"></span>
    </div>
    <p className="loader-text">Finding best resources...</p>
  </div>
);

const ResourceModal = ({ isOpen, onClose, isLoading, concept, resources }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // The modal overlay
    <div className="modal-overlay" onClick={onClose}>
      {/* The modal content
          We use stopPropagation to prevent clicks inside
          the modal from closing it.
      */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>×</button>
        <h2>Resources for: {concept}</h2>
        
        {isLoading ? (
          <Loader />
        ) : (
          <ul className="resource-list">
            {resources.length > 0 ? (
              resources.map((resource, index) => (
                <li key={index} className="resource-item">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    {resource.title}
                  </a>
                  <p>{resource.snippet}</p>
                </li>
              ))
            ) : (
              <p>No resources found for this concept.</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ResourceModal;
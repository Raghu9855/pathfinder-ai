import React, { memo } from 'react';
import { Modal, ListGroup, Button, Badge } from 'react-bootstrap';
import { FaExternalLinkAlt, FaSearch } from 'react-icons/fa';

/**
 * Renders a single resource list item.
 */
const ResourceItem = memo(({ resource }) => {
  // Extract hostname for cleaner display
  const getHostname = (url) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'Unknown Source';
    }
  };

  return (
    <ListGroup.Item className="mb-3 border-0 rounded-4 shadow-sm p-4 glass-card feature-card" style={{ transition: 'all 0.2s' }}>
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none"
      >
        <div className="d-flex justify-content-between align-items-start">
          <h6 className="fw-bold mb-1 text-main">{resource.title}</h6>
          <FaExternalLinkAlt size={12} className="text-muted mt-1" />
        </div>
        <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: '95%' }}>
          {resource.snippet}
        </p>
        <Badge bg="light" text="dark" className="mt-2 border fw-normal px-2 py-1 rounded-pill">
          {getHostname(resource.url)}
        </Badge>
      </a>
    </ListGroup.Item>
  );
});

/**
 * Displayed when resources are loading.
 */
const LoadingView = () => (
  <div className="text-center py-5">
    <div className="spinner-border text-primary mb-3" role="status"></div>
    <p className="text-muted animate-pulse">Scouring the web for the best tutorials...</p>
  </div>
);

/**
 * Displayed when no resources are found.
 */
const EmptyView = () => (
  <div className="text-center py-5 text-muted">
    <FaSearch size={40} className="mb-3 opacity-25" />
    <p>No specific resources found. Try searching generally.</p>
  </div>
);

/**
 * Modal to display fetched resources for a concept.
 */
const ResourceModal = ({ isOpen, onClose, isLoading, concept, resources }) => {
  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      centered
      size="lg"
      backdrop="static"
      keyboard={true}
    >
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold">
          Resources for: <span className="text-gradient">{concept}</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {isLoading ? (
          <LoadingView />
        ) : resources.length > 0 ? (
          <ListGroup variant="flush">
            {resources.map((resource, index) => (
              <ResourceItem key={index} resource={resource} />
            ))}
          </ListGroup>
        ) : (
          <EmptyView />
        )}
      </Modal.Body>

      <Modal.Footer className="border-top-0">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ResourceModal;
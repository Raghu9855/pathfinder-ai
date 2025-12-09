import React from 'react';
import { Card, Placeholder } from 'react-bootstrap';

const SkeletonCard = () => {
  return (
    <Card className="mb-3 border-0 shadow-sm">
      <Card.Body>
        <Placeholder as={Card.Title} animation="glow">
          <Placeholder xs={6} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
          <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
          <Placeholder xs={6} /> <Placeholder xs={8} />
        </Placeholder>
        <Placeholder.Button variant="primary" xs={3} />
      </Card.Body>
    </Card>
  );
};

export default SkeletonCard;
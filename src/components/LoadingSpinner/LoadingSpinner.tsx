import React from 'react';
import { Spinner, Container, Row, Col } from 'react-bootstrap';

interface LoadingSpinnerProps {
  message?: string;
  small?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
}

/**
 * Loading spinner component for async operations
 * Provides consistent loading states across the application
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Загрузка...',
  small = false,
  variant = 'primary',
}) => {
  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Row>
        <Col className="text-center">
          <Spinner animation="border" variant={variant} size={small ? 'sm' : undefined} />
          <div className="mt-3">
            <span className="text-muted">{message}</span>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
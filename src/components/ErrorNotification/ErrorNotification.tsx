import React, { useEffect, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

interface ErrorNotificationProps {
  message: string | null;
  onClose?: () => void;
  autoHideDuration?: number;
}

/**
 * Error notification component using Bootstrap Toast
 * Displays user-friendly error messages with auto-dismiss
 */
export const ErrorNotification: React.FC<ErrorNotificationProps> = ({
  message,
  onClose,
  autoHideDuration = 5000,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
    }
  }, [message]);

  const handleClose = () => {
    setShow(false);
    if (onClose) {
      onClose();
    }
  };

  if (!message) {
    return null;
  }

  return (
    <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
      <Toast
        show={show}
        onClose={handleClose}
        delay={autoHideDuration}
        autohide
        bg="danger"
      >
        <Toast.Header>
          <strong className="me-auto">Ошибка</strong>
        </Toast.Header>
        <Toast.Body className="text-white">{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};
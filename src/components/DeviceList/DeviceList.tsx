import React from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { DeviceCard } from '../DeviceCard/DeviceCard';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import type { Device } from '../../types';

interface DeviceListProps {
  devices: Device[];
  loading: boolean;
  error: string | null;
  onDeviceSelect: (device: Device) => void;
}

/**
 * DeviceList component displays devices in responsive grid
 * Handles loading states and empty states
 */
export const DeviceList: React.FC<DeviceListProps> = ({
  devices,
  loading,
  error,
  onDeviceSelect,
}) => {
  if (loading) {
    return <LoadingSpinner message="Загрузка устройств..." />;
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Ошибка загрузки</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  if (devices.length === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="info">
          <Alert.Heading>Нет устройств</Alert.Heading>
          <p>В системе пока нет доступных устройств.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Список устройств</h2>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {devices.map((device) => (
          <Col key={device.id}>
            <DeviceCard device={device} onClick={() => onDeviceSelect(device)} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};
import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import type { DeviceCardProps } from '../../types';

/**
 * Компонент DeviceCard отображает информацию об устройстве
 * Адаптивная карточка со стилями Bootstrap и обработчиком клика
 */
export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onClick }) => {
  const placeCount = device.places.length;
  const totalBalance = device.places.reduce((sum, place) => sum + place.balances, 0);
  const hasNegativeBalance = device.places.some(place => place.balances < 0);

  return (
    <Card
      className="h-100 shadow-sm hover-shadow"
      style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
      onClick={onClick}
    >
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center">
          <span>{device.name}</span>
          {hasNegativeBalance && (
            <Badge bg="warning" text="dark">
              !
            </Badge>
          )}
        </Card.Title>
        <Card.Text>
          <div className="mb-2">
            <small className="text-muted">Количество мест:</small>
            <div className="fw-bold">{placeCount}</div>
          </div>
          <div>
            <small className="text-muted">Общий баланс:</small>
            <div className={`fw-bold ${totalBalance < 0 ? 'text-danger' : 'text-success'}`}>
              {totalBalance.toFixed(2)} KES
            </div>
          </div>
        </Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted text-center">
        <small>Нажмите для просмотра мест</small>
      </Card.Footer>
    </Card>
  );
};
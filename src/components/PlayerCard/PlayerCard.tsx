import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { BalanceOperations } from '../BalanceOperations/BalanceOperations';
import apiService from '../../services/apiService';
import type { PlayerCardProps } from '../../types';

/**
 * PlayerCard component displays player information and balance operations
 * Responsive layout for mobile and desktop
 */
export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onBalanceUpdate }) => {
  const isNegativeBalance = player.balance < 0;
  const deviceId = parseInt(player.deviceId);
  const placeId = parseInt(player.id.split('-')[1]);

  const handleOperation = async (type: 'deposit' | 'withdraw', amount: number) => {
    try {
      let response;
      if (type === 'deposit') {
        response = await apiService.deposit(deviceId, placeId, amount);
      } else {
        response = await apiService.withdraw(deviceId, placeId, amount);
      }

      // Update parent component with new balance
      onBalanceUpdate(deviceId, placeId, response.balances);
    } catch (error) {
      throw error; // Re-throw to let BalanceOperations handle
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Card.Title className="mb-0">{player.name}</Card.Title>
          <Badge bg={isNegativeBalance ? 'danger' : 'success'} className="fs-6">
            {player.balance.toFixed(2)} {player.currency}
          </Badge>
        </div>

        <div className="mb-3">
          <small className="text-muted">Текущий баланс:</small>
          <div className={`h4 mb-0 ${isNegativeBalance ? 'text-danger' : 'text-success'}`}>
            {player.balance.toFixed(2)} {player.currency}
          </div>
        </div>

        <BalanceOperations
          deviceId={deviceId}
          placeId={placeId}
          currentBalance={player.balance}
          currency={player.currency}
          onOperation={handleOperation}
        />
      </Card.Body>
    </Card>
  );
};
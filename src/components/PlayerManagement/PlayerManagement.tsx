import React from "react";
import { Container, Button, Row, Col, Alert } from "react-bootstrap";
import { usePlayers } from "../../hooks/usePlayers";
import { PlayerCard } from "../PlayerCard/PlayerCard";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import type { Device } from "../../types";

interface PlayerManagementProps {
  device: Device;
  onBack: () => void;
}

/**
 * Компонент PlayerManagement отображает список игроков с операциями баланса
 * Интегрирует все компоненты, связанные с игроками, и обрабатывает загрузку игроков для конкретного устройства
 */
export const PlayerManagement: React.FC<PlayerManagementProps> = ({
  device,
  onBack,
}) => {
  const { players, loading, error, refetch } = usePlayers(device.id);

  const handleBalanceUpdate = () => {
    // Перезагружаем игроков для получения обновленных данных после операции с балансом
    refetch();
  };

  if (loading) {
    return <LoadingSpinner message="Загрузка мест..." />;
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Button variant="outline-primary" onClick={onBack} className="mb-3">
          ← Назад к устройствам
        </Button>
        <Alert variant="danger">
          <Alert.Heading>Ошибка загрузки</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4 player-management-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Button variant="outline-primary" onClick={onBack} className="mb-2">
            ← Назад к устройствам
          </Button>
          <h2 className="mb-0">{device.name}</h2>
          <small className="text-muted">Управление местами и балансами</small>
        </div>
      </div>

      {players.length === 0 ? (
        <Alert variant="info">
          <Alert.Heading>Нет мест</Alert.Heading>
          <p>В этом устройстве пока нет доступных мест.</p>
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {players.map((player) => (
            <Col key={player.id}>
              <PlayerCard
                player={player}
                onBalanceUpdate={handleBalanceUpdate}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

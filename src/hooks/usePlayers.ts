import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import { getErrorMessage, extractErrorCode } from '../utils/errorMessages';
import type { Player, UsePlayersReturn } from '../types';

/**
 * Custom hook for managing player list state for specific device
 * Handles loading and error states for player data
 */
export const usePlayers = (deviceId: number | null): UsePlayersReturn => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlayers = useCallback(async () => {
    if (!deviceId) {
      setPlayers([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const deviceData = await apiService.getDevice(deviceId);
      const playersData = apiService.convertPlacesToPlayers(deviceData);
      setPlayers(playersData);
    } catch (err: any) {
      const errorCode = extractErrorCode(err);
      const errorMessage = getErrorMessage(errorCode);
      setError(errorMessage);
      console.error('Failed to fetch players:', err);
    } finally {
      setLoading(false);
    }
  }, [deviceId]);

  const refetch = useCallback(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  return {
    players,
    loading,
    error,
    refetch,
  };
};
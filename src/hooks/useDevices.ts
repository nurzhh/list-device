import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiService';
import { getErrorMessage, extractErrorCode } from '../utils/errorMessages';
import type { Device, UseDevicesReturn } from '../types';

/**
 * Custom hook for managing device list state
 * Handles loading, error, and success states for device data
 */
export const useDevices = (): UseDevicesReturn => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const devicesData = await apiService.getDevices();
      setDevices(devicesData);
    } catch (err: any) {
      const errorCode = extractErrorCode(err);
      const errorMessage = getErrorMessage(errorCode);
      setError(errorMessage);
      console.error('Failed to fetch devices:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchDevices();
  }, [fetchDevices]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  return {
    devices,
    loading,
    error,
    refetch,
  };
};
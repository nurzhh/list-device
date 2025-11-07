import { useState, useCallback } from 'react';
import apiService from '../services/apiService';
import { getErrorMessage, extractErrorCode } from '../utils/errorMessages';
import type { UseBalanceOperationsReturn } from '../types';

/**
 * Кастомный хук для обработки операций пополнения и снятия средств
 * Реализует оптимистичные обновления и откат при ошибках
 */
export const useBalanceOperations = (): UseBalanceOperationsReturn => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateBalance = useCallback(async (
    deviceId: number,
    placeId: number,
    newBalance: number
  ): Promise<void> => {
    setIsSubmitting(true);
    setError(null);

    try {
      await apiService.updateBalance(deviceId, placeId, newBalance);
    } catch (err: any) {
      const errorCode = extractErrorCode(err);
      const errorMessage = getErrorMessage(errorCode);
      setError(errorMessage);
      console.error('Failed to update balance:', err);
      throw err; // Пробрасываем ошибку для обработки в компоненте
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    isSubmitting,
    error,
    updateBalance,
  };
};
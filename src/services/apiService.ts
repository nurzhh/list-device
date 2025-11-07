import type { APIError, BalanceResponse, BalanceUpdateRequest, Device, Player, TimeResponse } from '../types';
import { extractErrorCode } from '../utils/errorMessages';

/**
 * API Сервис для системы управления устройствами
 * 
 * ФУНКЦИОНАЛЬНЫЙ ПОДХОД - Почему не классы?
 * 
 * 1. ПРОСТОТА: Чистые функции проще понять и тестировать
 * 2. TREE-SHAKING: Лучше для оптимизации бандла
 * 3. КОМПОЗИЦИЯ: Функции лучше комбинируются чем классы
 * 4. REACT ИДИОМЫ: Функциональный стиль соответствует React хукам и компонентам
 * 5. БЕЗ СОСТОЯНИЯ: API клиенту не нужно состояние экземпляра или lifecycle
 * 6. ТЕСТИРУЕМОСТЬ: Чистые функции тривиально тестировать без моков
 */

// Базовый URL для API запросов - простая константа, не нужно свойство класса
const BASE_URL = 'https://dev-space.su/api/v1/a';

/**
 * Универсальный обработчик запросов с обработкой ошибок
 * Чистая функция - без побочных эффектов, детерминированная, легко тестировать
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: APIError = {
        code: extractErrorCode(errorData),
        message: errorData.message || `HTTP ${response.status}`,
        details: errorData,
      };
      throw error;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'TypeError') {
      // Сетевая ошибка
      const networkError: APIError = {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed',
        details: error,
      };
      throw networkError;
    }
    throw error;
  }
}

/**
 * Получить все устройства с их местами
 * Чистая функция - без побочных эффектов, легко тестировать
 */
export async function getDevices(): Promise<Device[]> {
  return request<Device[]>('/devices/');
}

/**
 * Получить конкретное устройство по ID с местами
 */
export async function getDevice(deviceId: number): Promise<Device> {
  return request<Device>(`/devices/${deviceId}/`);
}

/**
 * Обновить баланс для конкретного места в устройстве
 */
export async function updateBalance(
  deviceId: number,
  placeId: number,
  newBalance: number
): Promise<BalanceResponse> {
  const requestBody: BalanceUpdateRequest = {
    balances: newBalance,
  };

  return request<BalanceResponse>(
    `/devices/${deviceId}/place/${placeId}/update`,
    {
      method: 'POST',
      body: JSON.stringify(requestBody),
    }
  );
}

/**
 * Получить текущее время сервера
 */
export async function getTime(): Promise<TimeResponse> {
  return request<TimeResponse>('/time');
}

/**
 * Конвертировать места устройства в формат игроков для совместимости с UI
 * Чистая утилитарная функция - без API вызова, только трансформация данных
 */
export function convertPlacesToPlayers(device: Device): Player[] {
  return device.places.map((place) => ({
    id: `${device.id}-${place.place}`,
    name: `Место ${place.place}`,
    balance: place.balances,
    deviceId: device.id.toString(),
    currency: place.currency,
  }));
}

/**
 * Вспомогательная функция для пополнения баланса (добавление к текущему балансу)
 * Составлена из меньших функций - паттерн функциональной композиции
 */
export async function deposit(
  deviceId: number,
  placeId: number,
  amount: number
): Promise<BalanceResponse> {
  // Сначала получаем текущие данные устройства для получения текущего баланса
  const device = await getDevice(deviceId);
  const place = device.places.find(p => p.place === placeId);

  if (!place) {
    const error: APIError = {
      code: 'PLACE_NOT_FOUND',
      message: 'Place not found in device',
      details: { deviceId, placeId },
    };
    throw error;
  }

  const newBalance = place.balances + amount;
  return updateBalance(deviceId, placeId, newBalance);
}

/**
 * Вспомогательная функция для снятия средств (вычитание из текущего баланса)
 * Составлена из меньших функций - паттерн функциональной композиции
 */
export async function withdraw(
  deviceId: number,
  placeId: number,
  amount: number
): Promise<BalanceResponse> {
  // Сначала получаем текущие данные устройства для получения текущего баланса
  const device = await getDevice(deviceId);
  const place = device.places.find(p => p.place === placeId);

  if (!place) {
    const error: APIError = {
      code: 'PLACE_NOT_FOUND',
      message: 'Place not found in device',
      details: { deviceId, placeId },
    };
    throw error;
  }

  const newBalance = place.balances - amount;

  // Проверка на недостаточность средств
  if (newBalance < 0 && place.balances >= 0) {
    const error: APIError = {
      code: 'INSUFFICIENT_FUNDS',
      message: 'Insufficient funds for withdrawal',
      details: { currentBalance: place.balances, requestedAmount: amount },
    };
    throw error;
  }

  return updateBalance(deviceId, placeId, newBalance);
}

/**
 * Объект API сервиса для обратной совместимости и удобства
 * 
 * Варианты использования:
 * 1. Named imports: import { getDevices, deposit } from './apiService'
 * 2. Default import: import apiService from './apiService'; apiService.getDevices()
 * 3. Namespace import: import * as api from './apiService'; api.getDevices()
 */
export const apiService = {
  getDevices,
  getDevice,
  updateBalance,
  getTime,
  convertPlacesToPlayers,
  deposit,
  withdraw,
};

// Default export для удобства
export default apiService;
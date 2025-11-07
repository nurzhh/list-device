// Core data models for the Device Management System

export interface Place {
  device_id: number;
  place: number;
  currency: string;
  balances: number;
}

export interface Device {
  id: number;
  name: string;
  places: Place[];
  created_at: string;
  updated_at: string;
}

// Legacy Player interface for compatibility (maps to Place)
export interface Player {
  id: string;
  name: string;
  balance: number;
  deviceId: string;
  currency: string;
}

export interface BalanceOperation {
  type: 'deposit' | 'withdraw';
  amount: number;
  deviceId: number;
  placeId: number;
}

export interface BalanceUpdateRequest {
  balances: number;
}

export interface BalanceResponse {
  balances: number;
  currency: string;
  device_id: number;
  place: number;
}

export interface TimeResponse {
  timestamp: number;
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Component prop types
export interface DeviceCardProps {
  device: Device;
  onClick: () => void;
}

export interface PlayerCardProps {
  player: Player;
  onBalanceUpdate: (deviceId: number, placeId: number, newBalance: number) => void;
}

export interface BalanceOperationsProps {
  deviceId: number;
  placeId: number;
  currentBalance: number;
  currency: string;
  onOperation: (type: 'deposit' | 'withdraw', amount: number) => Promise<void>;
}

export interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export interface DigitalPinpadProps {
  onValueChange: (value: string) => void;
  onDeposit: () => void;
  onWithdraw: () => void;
}

// Hook return types
export interface UseDevicesReturn {
  devices: Device[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UsePlayersReturn {
  players: Player[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface UseBalanceOperationsReturn {
  isSubmitting: boolean;
  error: string | null;
  updateBalance: (deviceId: number, placeId: number, newBalance: number) => Promise<void>;
}

// Application state types
export type ViewType = 'devices' | 'players';

export interface AppState {
  currentView: ViewType;
  selectedDevice: Device | null;
  error: string | null;
}
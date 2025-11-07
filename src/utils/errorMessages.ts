export const ERROR_MESSAGES: Record<string, string> = {
  INSUFFICIENT_FUNDS: "Недостаточно средств на балансе",
  INVALID_AMOUNT: "Некорректная сумма операции",
  NETWORK_ERROR: "Ошибка подключения к серверу",
  PLAYER_NOT_FOUND: "Игрок не найден",
  PLACE_NOT_FOUND: "Место не найдено",
  DEVICE_NOT_FOUND: "Устройство не найдено",
  SERVER_ERROR: "Ошибка сервера. Попробуйте позже",
  TIMEOUT_ERROR: "Превышено время ожидания",
  UNAUTHORIZED: "Нет доступа к операции",
  VALIDATION_ERROR: "Ошибка валидации данных",
  UNKNOWN_ERROR: "Произошла неизвестная ошибка",
};

export const getErrorMessage = (errorCode: string): string => {
  return ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.UNKNOWN_ERROR;
};

type ErrorLike = {
  response?: { data?: { code?: string } };
  code?: string;
  message?: string;
};

export const extractErrorCode = (error: unknown): string => {
  const err = error as ErrorLike;

  if (err?.response?.data?.code) {
    return err.response.data.code;
  }

  if (err?.code) {
    return err.code;
  }

  if (
    typeof err?.message === "string" &&
    err.message.includes("Network Error")
  ) {
    return "NETWORK_ERROR";
  }

  if (typeof err?.message === "string" && err.message.includes("timeout")) {
    return "TIMEOUT_ERROR";
  }

  return "UNKNOWN_ERROR";
};

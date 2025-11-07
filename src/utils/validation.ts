import type { ValidationResult } from "../types";

/**
 * Валидация финансовых сумм с строгими правилами для финансовых приложений
 * 
 * Валидация критически важна по следующим причинам:
 * 1. ТОЧНОСТЬ РАСЧЕТОВ: Финансовые системы работают с фиксированной точностью (центы/копейки)
 * 2. ВАЛЮТНЫЕ СТАНДАРТЫ: Большинство валют имеют максимум 2 знака после запятой
 * 3. ПРЕДОТВРАЩЕНИЕ ОШИБОК ОКРУГЛЕНИЯ: Дополнительные знаки приводят к накапливающимся ошибкам
 * 4. СООТВЕТСТВИЕ НОРМАТИВАМ: Финансовые регуляторы требуют точности расчетов
 * 5. ПОЛЬЗОВАТЕЛЬСКИЙ ОПЫТ: Пользователи ожидают формат валюты (рубли.копейки)
 */
export const validateAmount = (amount: string): ValidationResult => {
  // Проверка на пустое значение
  if (!amount.trim()) {
    return { isValid: false, error: 'Введите сумму операции' };
  }

  // Проверка на числовое значение
  const numericValue = parseFloat(amount);
  if (isNaN(numericValue)) {
    return { isValid: false, error: 'Введите корректное числовое значение' };
  }

  // Проверка на положительное значение
  if (numericValue <= 0) {
    return { isValid: false, error: 'Сумма должна быть положительной' };
  }

  // Проверка количества знаков после запятой (максимум 2 для финансовых операций)
  const decimalPlaces = (amount.split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return { isValid: false, error: 'Максимум 2 знака после запятой' };
  }

  // Проверка на разумный максимум (предотвращение переполнения)
  if (numericValue > 999999999.99) {
    return { isValid: false, error: 'Сумма слишком большая' };
  }

  return { isValid: true };
};

/**
 * Форматирование суммы для отображения в формате валюты
 * KES (Kenyan Shilling) использует 2 знака после запятой
 */
export const formatAmount = (amount: number, currency: string = 'KES'): string => {
  return `${amount.toFixed(2)} ${currency}`;
};

/**
 * Форматирование суммы как числа с 2 знаками после запятой
 */
export const formatAmountNumber = (amount: number): string => {
  return amount.toFixed(2);
};

/**
 * Очистка ввода суммы от недопустимых символов
 */
export const sanitizeAmountInput = (input: string): string => {
  // Разрешаем только цифры, одну точку и удаляем ведущие нули
  return input
    .replace(/[^\d.]/g, '') // Удаляем нечисловые символы кроме точки
    .replace(/^0+(?=\d)/, '') // Удаляем ведущие нули
    .replace(/\.{2,}/g, '.') // Заменяем множественные точки на одну
    .replace(/^\./, '0.'); // Добавляем ведущий ноль если начинается с точки
};
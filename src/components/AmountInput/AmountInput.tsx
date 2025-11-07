import React, { useState, useCallback } from 'react';
import { Form } from 'react-bootstrap';
import { validateAmount, sanitizeAmountInput } from '../../utils/validation';
import type { AmountInputProps } from '../../types';

/**
 * Компонент AmountInput с валидацией в реальном времени
 * Обрабатывает контролируемый ввод с валидацией для финансовых операций
 */
export const AmountInput: React.FC<AmountInputProps> = ({
  value,
  onChange,
  error,
}) => {
  const [internalError, setInternalError] = useState<string>('');

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitizedValue = sanitizeAmountInput(rawValue);

    // Валидируем очищенный ввод
    const validation = validateAmount(sanitizedValue);

    if (sanitizedValue === '' || validation.isValid) {
      setInternalError('');
    } else {
      setInternalError(validation.error || '');
    }

    onChange(sanitizedValue);
  }, [onChange]);

  const displayError = error || internalError;
  const isInvalid = Boolean(displayError);

  return (
    <Form.Group className="mb-3">
      <Form.Label>Сумма операции</Form.Label>
      <Form.Control
        type="text"
        value={value}
        onChange={handleInputChange}
        isInvalid={isInvalid}
        placeholder="0.00"
        className="text-end"
        style={{ fontSize: '1.1rem' }}
      />
      {isInvalid && (
        <Form.Control.Feedback type="invalid">
          {displayError}
        </Form.Control.Feedback>
      )}
      <Form.Text className="text-muted">
        Максимум 2 знака после запятой
      </Form.Text>
    </Form.Group>
  );
};
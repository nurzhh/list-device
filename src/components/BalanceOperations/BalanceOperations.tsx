import React, { useState } from 'react';
import { Button, Row, Col, Alert } from 'react-bootstrap';
import { AmountInput } from '../AmountInput/AmountInput';
import { validateAmount } from '../../utils/validation';
import type { BalanceOperationsProps } from '../../types';

/**
 * Компонент BalanceOperations для операций пополнения и снятия средств
 * Интегрирует AmountInput с валидацией и кнопками операций
 */
export const BalanceOperations: React.FC<BalanceOperationsProps> = ({
  currentBalance,
  currency,
  onOperation,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleOperation = async (type: 'deposit' | 'withdraw') => {
    setError('');
    setSuccessMessage('');

    // Валидируем сумму
    const validation = validateAmount(amount);
    if (!validation.isValid) {
      setError(validation.error || 'Некорректная сумма');
      return;
    }

    const numericAmount = parseFloat(amount);

    // Проверяем недостаточность средств при снятии
    if (type === 'withdraw' && numericAmount > currentBalance && currentBalance >= 0) {
      setError('Недостаточно средств на балансе');
      return;
    }

    setIsSubmitting(true);
    try {
      await onOperation(type, numericAmount);
      setSuccessMessage(
        type === 'deposit'
          ? `Успешно пополнено на ${numericAmount.toFixed(2)} ${currency}`
          : `Успешно снято ${numericAmount.toFixed(2)} ${currency}`
      );
      setAmount('');

      // Автоматически скрываем сообщение об успехе через 3 секунды
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Ошибка выполнения операции');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-3">
      <AmountInput
        value={amount}
        onChange={setAmount}
        error={error}
      />

      {successMessage && (
        <Alert variant="success" className="mb-3">
          {successMessage}
        </Alert>
      )}

      <Row className="g-2">
        <Col xs={12} md={6}>
          <Button
            variant="success"
            className="w-100"
            onClick={() => handleOperation('deposit')}
            disabled={isSubmitting || !amount}
          >
            {isSubmitting ? 'Обработка...' : 'Внести (Deposit)'}
          </Button>
        </Col>
        <Col xs={12} md={6}>
          <Button
            variant="danger"
            className="w-100"
            onClick={() => handleOperation('withdraw')}
            disabled={isSubmitting || !amount}
          >
            {isSubmitting ? 'Обработка...' : 'Снять (Withdraw)'}
          </Button>
        </Col>
      </Row>
    </div>
  );
};
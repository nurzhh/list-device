import React, { useState } from 'react';
import { Button, Row, Col, Alert } from 'react-bootstrap';
import { AmountInput } from '../AmountInput/AmountInput';
import { validateAmount } from '../../utils/validation';
import type { BalanceOperationsProps } from '../../types';

/**
 * BalanceOperations component for deposit and withdraw operations
 * Integrates AmountInput with validation and operation buttons
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

    // Validate amount
    const validation = validateAmount(amount);
    if (!validation.isValid) {
      setError(validation.error || 'Некорректная сумма');
      return;
    }

    const numericAmount = parseFloat(amount);

    // Check for insufficient funds on withdrawal
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

      // Auto-hide success message after 3 seconds
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
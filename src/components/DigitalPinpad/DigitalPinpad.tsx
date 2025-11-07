import React from 'react';
import { Button, Row, Col, Card } from 'react-bootstrap';
import type { DigitalPinpadProps } from '../../types';

/**
 * Компонент DigitalPinpad предоставляет интерфейс цифровой клавиатуры
 * Оптимизирован для сенсорных устройств с большими кнопками
 */
export const DigitalPinpad: React.FC<DigitalPinpadProps> = ({
  onValueChange,
  onDeposit,
  onWithdraw,
}) => {
  const [displayValue, setDisplayValue] = React.useState<string>('');

  const handleNumberClick = (num: string) => {
    const newValue = displayValue + num;
    setDisplayValue(newValue);
    onValueChange(newValue);
  };

  const handleDecimalClick = () => {
    if (!displayValue.includes('.')) {
      const newValue = displayValue + '.';
      setDisplayValue(newValue);
      onValueChange(newValue);
    }
  };

  const handleClear = () => {
    setDisplayValue('');
    onValueChange('');
  };

  const handleBackspace = () => {
    const newValue = displayValue.slice(0, -1);
    setDisplayValue(newValue);
    onValueChange(newValue);
  };

  const handleDeposit = () => {
    onDeposit();
    setDisplayValue('');
    onValueChange('');
  };

  const handleWithdraw = () => {
    onWithdraw();
    setDisplayValue('');
    onValueChange('');
  };

  const buttonStyle = {
    height: '60px',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  };

  return (
    <Card className="mt-3">
      <Card.Body>
        <div className="mb-3 p-3 bg-light rounded text-end" style={{ fontSize: '2rem', minHeight: '60px' }}>
          {displayValue || '0.00'}
        </div>

        <Row className="g-2 mb-2">
          <Col xs={4}>
            <Button variant="outline-primary" className="w-100" style={buttonStyle} onClick={() => handleNumberClick('1')}>
              1
            </Button>
          </Col>
          <Col xs={4}>
            <Button variant="outline-primary" className="w-100" style={buttonStyle} onClick={() => handleNumberClick('2')}>
              2
            </Button>
          </Col>
          <Col xs={4}>
            <Button variant="outline-primary" className="w-100" style={buttonStyle} onClick={() => handleNumberClick('3')}>
              3
            </Button>
          </Col>
        </Row>

        <Row className="g-2 mb-2">
          <Col xs={4}>
            <Button variant="outline-primary" className="w-100" style={buttonStyle} onClick={() => handleNumberClick('4')}>
              4
            </Button>
          </Col>
          <Col xs={4}>
            <Button variant="outline-primary" className="w-100" style={buttonStyle} onClick={() => handleNumberClick('5')}>
              5
            </Button>
          </Col>
          <Col xs={4}>
            <Button variant="outline-primary" className="w-100" style={buttonStyle} onClick={() => handleNumberClick('6')}>
              6
            </Button>
          </Col>
        </Row>

        <Row className="g-2 mb-2">
          <Col xs={4}>
            <Button variant="outline-primary" className="w-100" style={buttonStyle} onClick={() => handleNumberClick('7')}>
              7
            </Button>
          </Col>
          <Col xs={4}>
            <Button variant="outline-primary" className="w-100" style={buttonStyle} onClick={() => handleNumberClick('8')}>
              8
            </Button>
          </Col>
          <Col xs={4}>
            <Button variant="outline-primary" className="w-100" style={buttonStyle} onClick={() => handleNumberClick('9')}>
              9
            </Button>
          </Col>
        </Row>

        <Row className="g-2 mb-3">
          <Col xs={4}>
            <Button variant="outline-secondary" className="w-100" style={buttonStyle} onClick={handleDecimalClick}>
              .
            </Button>
          </Col>
          <Col xs={4}>
            <Button variant="outline-primary" className="w-100" style={buttonStyle} onClick={() => handleNumberClick('0')}>
              0
            </Button>
          </Col>
          <Col xs={4}>
            <Button variant="outline-danger" className="w-100" style={buttonStyle} onClick={handleBackspace}>
              ⌫
            </Button>
          </Col>
        </Row>

        <Row className="g-2 mb-2">
          <Col xs={6}>
            <Button variant="success" className="w-100" style={buttonStyle} onClick={handleDeposit} disabled={!displayValue}>
              Внести
            </Button>
          </Col>
          <Col xs={6}>
            <Button variant="danger" className="w-100" style={buttonStyle} onClick={handleWithdraw} disabled={!displayValue}>
              Снять
            </Button>
          </Col>
        </Row>

        <Row className="g-2">
          <Col xs={12}>
            <Button variant="outline-secondary" className="w-100" onClick={handleClear}>
              Очистить
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
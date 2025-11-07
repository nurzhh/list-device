import { useState } from 'react';
import { useDevices } from './hooks/useDevices';
import { DeviceList } from './components/DeviceList/DeviceList';
import { PlayerManagement } from './components/PlayerManagement/PlayerManagement';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import type { Device, ViewType } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('devices');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const { devices, loading, error } = useDevices();

  const handleDeviceSelect = (device: Device) => {
    setSelectedDevice(device);
    setCurrentView('players');
  };

  const handleBackToDevices = () => {
    setSelectedDevice(null);
    setCurrentView('devices');
  };

  const handleErrorClose = () => {
    setGlobalError(null);
  };

  return (
    <div className="App">
      <header className="bg-primary text-white py-3 shadow-sm">
        <div className="container">
          <h1 className="h3 mb-0">Управление устройствами и игроками</h1>
          <small>Device & Player Management System</small>
        </div>
      </header>

      <main className="pb-5">
        {currentView === 'devices' ? (
          <DeviceList
            devices={devices}
            loading={loading}
            error={error}
            onDeviceSelect={handleDeviceSelect}
          />
        ) : selectedDevice ? (
          <PlayerManagement
            device={selectedDevice}
            onBack={handleBackToDevices}
          />
        ) : null}
      </main>

      <ErrorNotification message={globalError} onClose={handleErrorClose} />

      <footer className="bg-light py-3 mt-5 border-top">
        <div className="container text-center text-muted">
          <small>© 2025 Device Management System</small>
        </div>
      </footer>
    </div>
  );
}

export default App;
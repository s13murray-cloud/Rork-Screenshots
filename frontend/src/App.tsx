import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Login } from './pages/Login';

import { Checklist } from './pages/Checklist';
import { FaultReport } from './pages/FaultReport';
import { Success } from './pages/Success';
import { FaultsList } from './pages/FaultsList';
import { HistoryList } from './pages/HistoryList';
import { ManageDashboard } from './pages/ManageDashboard';
import { FaultRectify } from './pages/FaultRectify';
import { UnifiedDashboard } from './pages/UnifiedDashboard';
import { ChecklistManagement } from './pages/supervisor/checklists/ChecklistManagement';
import { ChecklistImport } from './pages/supervisor/checklists/ChecklistImport';
import { ChecklistBuilder } from './pages/supervisor/checklists/ChecklistBuilder';
import { AddEquipment } from './pages/supervisor/equipment/AddEquipment';
import { TeamMembers } from './pages/TeamMembers';
import { Join } from './pages/Join';
import { useState, useEffect } from 'react';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash screen for 1.5 seconds on app load
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', backgroundColor: 'var(--bg-color)' }}>
        <img src="/logo-full.png" alt="Checkta Logo" style={{ maxWidth: '120px', width: '100%', height: 'auto', marginBottom: '1rem' }} className="animate-fade-in" />
        <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '1.125rem' }} className="animate-fade-in">Loading Checkta...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/invite/:token" element={<Join />} />

      {/* All routes wrapped in unified responsive MainLayout */}
      <Route element={<MainLayout />}>
        {/* Unified root route */}
        <Route path="/" element={<UnifiedDashboard />} />
        <Route path="/team" element={<TeamMembers />} />

        {/* Universal application core routes */}
        <Route path="/equipment" element={<UnifiedDashboard />} /> {/* Aliased for mobile nav highlight */}
        <Route path="/history" element={<HistoryList />} />
        <Route path="/faults" element={<FaultsList />} />
        <Route path="/manage" element={<ManageDashboard />} />

        {/* Deep flow routes */}
        <Route path="/faults/:faultId" element={<FaultRectify />} />
        <Route path="/checklist/:equipmentId" element={<Checklist />} />
        <Route path="/fault-report" element={<FaultReport />} />
        <Route path="/success" element={<Success />} />

        {/* Desktop-first management sub-routes */}
        <Route path="/manage/checklists" element={<ChecklistManagement />} />
        <Route path="/manage/equipment/add" element={<AddEquipment />} />
        <Route path="/manage/checklists/import" element={<ChecklistImport />} />
        <Route path="/manage/checklists/builder" element={<ChecklistBuilder />} />
        <Route path="/manage/reports" element={<div style={{ padding: '2rem' }}>Reports Placeholder</div>} />
      </Route>
    </Routes>
  );
}

export default App;

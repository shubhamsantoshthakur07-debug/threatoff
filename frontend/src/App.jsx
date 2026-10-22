import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RoleSwitcherBanner from './components/RoleSwitcherBanner';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import DashboardOverviewPage from './pages/DashboardOverviewPage';
import ManualPredictionPage from './pages/ManualPredictionPage';
import DatasetAnalysisPage from './pages/DatasetAnalysisPage';
import ThreatAlertsPage from './pages/ThreatAlertsPage';
import EmployeeRiskPage from './pages/EmployeeRiskPage';
import ActivityMonitoringPage from './pages/ActivityMonitoringPage';
import ModelPerformancePage from './pages/ModelPerformancePage';
import ReportsPage from './pages/ReportsPage';
import PredictionHistoryPage from './pages/PredictionHistoryPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';

function LayoutShell({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isLandingOrLogin = location.pathname === '/' || location.pathname === '/login';

  if (isLandingOrLogin) {
    return (
      <div className="min-h-screen flex flex-col bg-soc-bg text-slate-100">
        <RoleSwitcherBanner />
        <Navbar toggleSidebar={() => {}} isSidebarOpen={false} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-soc-bg text-slate-100">
      <RoleSwitcherBanner />
      <Navbar
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 transition-all duration-300">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <div className="lg:pl-64">
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <LayoutShell>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardOverviewPage />} />
            <Route path="/manual-prediction" element={<ManualPredictionPage />} />
            <Route path="/dataset-analysis" element={<DatasetAnalysisPage />} />
            <Route path="/alerts" element={<ThreatAlertsPage />} />
            <Route path="/employee-risk" element={<EmployeeRiskPage />} />
            <Route path="/monitoring" element={<ActivityMonitoringPage />} />
            <Route path="/model-performance" element={<ModelPerformancePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/history" element={<PredictionHistoryPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </LayoutShell>
      </BrowserRouter>
    </AuthProvider>
  );
}

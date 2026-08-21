import React, { useState } from 'react';
import { Web3Provider } from './context/Web3Context';
import { FraudShieldProvider } from './context/FraudShieldContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { TransactionAnalyzer } from './pages/TransactionAnalyzer';
import { WalletReputation } from './pages/WalletReputation';
import { FraudInvestigation } from './pages/FraudInvestigation';
import { DAOVerification } from './pages/DAOVerification';
import { LiveMonitoring } from './pages/LiveMonitoring';
import { AIAnalytics } from './pages/AIAnalytics';
import { IPFSEvidenceVault } from './pages/IPFSEvidenceVault';
import { ValidatorDashboard } from './pages/ValidatorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { SettingsPage } from './pages/SettingsPage';
import { SecurityScanner } from './pages/SecurityScanner';
import { HoneypotDetector } from './pages/HoneypotDetector';
import { AllowanceGuardian } from './pages/AllowanceGuardian';
import { ThreatRadar } from './pages/ThreatRadar';

export function AppContent() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [prefillTx, setPrefillTx] = useState<any>(null);

  const handleInspectTx = (tx: any) => {
    setPrefillTx(tx);
    setCurrentPage('analyzer');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage onNavigate={setCurrentPage} onInspectTx={handleInspectTx} />;
      case 'analyzer':
        return <TransactionAnalyzer onNavigate={setCurrentPage} prefillTx={prefillTx} />;
      case 'scanner':
        return <SecurityScanner />;
      case 'honeypot':
        return <HoneypotDetector />;
      case 'allowance':
        return <AllowanceGuardian />;
      case 'threats':
        return <ThreatRadar />;
      case 'reputation':
        return <WalletReputation />;
      case 'investigation':
        return <FraudInvestigation />;
      case 'dao':
        return <DAOVerification />;
      case 'live':
        return <LiveMonitoring onInspectTx={handleInspectTx} />;
      case 'analytics':
        return <AIAnalytics />;
      case 'ipfs':
        return <IPFSEvidenceVault />;
      case 'validators':
        return <ValidatorDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'architecture':
        return <ArchitecturePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setCurrentPage} onInspectTx={handleInspectTx} />;
    }
  };

  return (
    <div className="min-h-screen bg-void text-slate-100 flex flex-col font-sans selection:bg-cyber-cyan/30 selection:text-cyber-cyan">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />

      <div className="flex-1 flex overflow-hidden">
        {currentPage !== 'landing' && (
          <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        )}

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderPage()}
        </main>
      </div>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-slate-800/80 bg-surface-950/80 backdrop-blur-md text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-emerald" />
          <span>AI FraudShield Decentralized Protocol v2.4 • Active Testnets</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <button onClick={() => setCurrentPage('architecture')} className="hover:text-cyber-cyan transition-colors">
            Architecture
          </button>
          <button onClick={() => setCurrentPage('settings')} className="hover:text-cyber-cyan transition-colors">
            Smart Contracts
          </button>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Polygon Amoy & Ethereum Sepolia</span>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <Web3Provider>
      <FraudShieldProvider>
        <AppContent />
      </FraudShieldProvider>
    </Web3Provider>
  );
}

export default App;

import React, { useState } from 'react';
import { ServerProvider, useServer } from './context/ServerContext';
import { SpotifyProvider } from './context/SpotifyContext';
import { Navbar } from './components/Navbar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { ModsManager } from './components/ModsManager';
import { PermissionsDashboard } from './components/PermissionsDashboard';
import { LiveConsole } from './components/LiveConsole';
import { PerformanceAnalytics } from './components/PerformanceAnalytics';
import { BackupScheduler } from './components/BackupScheduler';
import { ConfigEditor } from './components/ConfigEditor';
import { CrossPlatformToolkit } from './components/CrossPlatformToolkit';
import { ConnectionModal } from './components/ConnectionModal';
import { AccessibilityModal } from './components/AccessibilityModal';
import { SpotifyMiniPlayer } from './components/SpotifyMiniPlayer';
import { SpotifyConnectModal } from './components/SpotifyConnectModal';
import { HelpDashboard } from './components/HelpDashboard';
import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

function DashboardApp() {
  const { accessibility, toastMessage, activeServer } = useServer();

  const [activeTab, setActiveTab] = useState('overview');
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [accessibilityModalOpen, setAccessibilityModalOpen] = useState(false);

  // Apply theme classes
  const themeClass = `theme-${accessibility.theme}`;
  const fontClass = `font-scale-${accessibility.fontSize}`;
  const motionClass = accessibility.reducedMotion ? 'reduced-motion' : '';
  const contrastClass = accessibility.highContrast ? 'high-contrast-borders' : '';

  return (
    <div
      className={`min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] ${themeClass} ${fontClass} ${motionClass} ${contrastClass} flex flex-col font-sans transition-colors duration-200`}
    >
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openConnectModal={() => setConnectModalOpen(true)}
        openAccessibilityModal={() => setAccessibilityModalOpen(true)}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && <OverviewDashboard onNavigate={setActiveTab} />}
        {activeTab === 'mods' && <ModsManager />}
        {activeTab === 'players' && <PermissionsDashboard />}
        {activeTab === 'console' && <LiveConsole />}
        {activeTab === 'analytics' && <PerformanceAnalytics />}
        {activeTab === 'backups' && <BackupScheduler />}
        {activeTab === 'config' && <ConfigEditor />}
        {activeTab === 'crossplatform' && <CrossPlatformToolkit />}
        {activeTab === 'help' && <HelpDashboard />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-surface)] py-4 text-xs text-[var(--color-text-muted)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--color-text)]">BeamDeck MP</span>
            <span>•</span>
            <span>BeamMP Dedicated Server Manager</span>
            <span>•</span>
            <span className="font-mono text-orange-500">{activeServer.version}</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://beammp.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--color-text)] transition flex items-center gap-1"
            >
              BeamMP Official Site <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://keymaster.beammp.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--color-text)] transition flex items-center gap-1"
            >
              AuthKey Portal <ExternalLink className="w-3 h-3" />
            </a>
            <span>Port {activeServer.port} (UDP/TCP)</span>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold border ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950 text-emerald-200 border-emerald-500/50'
                : toastMessage.type === 'warn'
                ? 'bg-amber-950 text-amber-200 border-amber-500/50'
                : toastMessage.type === 'error'
                ? 'bg-red-950 text-red-200 border-red-500/50'
                : 'bg-neutral-900 text-neutral-100 border-neutral-700'
            }`}
          >
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toastMessage.type === 'warn' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
            {toastMessage.type === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
            {toastMessage.type === 'info' && <Info className="w-4 h-4 text-sky-400" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Floating Spotify Mini-Player (Positioned unobtrusively at bottom-left corner) */}
      <SpotifyMiniPlayer />

      {/* Modals */}
      <ConnectionModal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
      />

      <AccessibilityModal
        isOpen={accessibilityModalOpen}
        onClose={() => setAccessibilityModalOpen(false)}
      />

      <SpotifyConnectModal />
    </div>
  );
}

export default function App() {
  return (
    <ServerProvider>
      <SpotifyProvider>
        <DashboardApp />
      </SpotifyProvider>
    </ServerProvider>
  );
}

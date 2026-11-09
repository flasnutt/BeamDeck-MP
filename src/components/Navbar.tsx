import React, { useState } from 'react';
import { useServer } from '../context/ServerContext';
import { useSpotify } from '../context/SpotifyContext';
import {
  Server,
  Play,
  RotateCw,
  Square,
  RefreshCw,
  Sliders,
  FolderOpen,
  Users,
  Terminal,
  Activity,
  Archive,
  FileCode,
  Laptop,
  Globe,
  Settings,
  Eye,
  Plus,
  Radio,
  Music,
  HelpCircle
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openConnectModal: () => void;
  openAccessibilityModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openConnectModal,
  openAccessibilityModal
}) => {
  const {
    servers,
    activeServer,
    setActiveServerId,
    restartServer,
    stopServer,
    startServer,
    triggerClientModSync,
    isSyncingMods,
    players,
    mods,
    hostMetrics
  } = useServer();

  const spotify = useSpotify();

  const [serverDropdownOpen, setServerDropdownOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'mods', label: 'Mods', icon: FolderOpen, badge: mods.filter((m) => m.isEnabled).length },
    { id: 'players', label: 'Players', icon: Users, badge: players.length },
    { id: 'console', label: 'Console', icon: Terminal },
    { id: 'analytics', label: 'Analytics', icon: Laptop, alert: hostMetrics.cpuTotalPercent > 80 },
    { id: 'backups', label: 'Backups', icon: Archive },
    { id: 'config', label: 'ServerConfig', icon: FileCode },
    { id: 'crossplatform', label: 'Deployment', icon: Globe },
    { id: 'help', label: 'Help & Guides', icon: HelpCircle }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-surface)] border-b border-[var(--color-border)] shadow-md transition-colors">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-black tracking-wider">
              <span className="text-xl">B</span>
              <span className="text-xs text-orange-200">MP</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-[var(--color-text)]">
                  BeamDeck <span className="text-orange-500">MP</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
                  Server Manager
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-muted)] hidden md:block">
                Dedicated & Local BeamMP Host Control
              </p>
            </div>
          </div>

          {/* Server Switcher & Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Server Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setServerDropdownOpen(!serverDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-hover)] hover:bg-[var(--color-surface-active)] transition text-left text-xs sm:text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-expanded={serverDropdownOpen}
                aria-label="Select connected BeamMP server"
              >
                <div className="relative">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      activeServer.status === 'online'
                        ? 'bg-emerald-500'
                        : activeServer.status === 'restarting'
                        ? 'bg-amber-500 animate-ping'
                        : 'bg-red-500'
                    }`}
                  />
                </div>
                <div className="hidden sm:block">
                  <div className="font-medium truncate max-w-[140px] sm:max-w-[190px]">
                    {activeServer.name}
                  </div>
                  <div className="text-[10px] text-[var(--color-text-muted)] font-mono">
                    {activeServer.host}:{activeServer.port} ({activeServer.hostType === 'localhost' ? 'Local PC' : 'VPS'})
                  </div>
                </div>
                <span className="text-xs text-[var(--color-text-muted)]">▼</span>
              </button>

              {serverDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-border)] mb-1">
                    Your Owned Servers
                  </div>
                  <div className="space-y-1">
                    {servers.map((srv) => (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => {
                          setActiveServerId(srv.id);
                          setServerDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                          srv.id === activeServer.id
                            ? 'bg-orange-500/10 text-orange-500 font-semibold border border-orange-500/30'
                            : 'hover:bg-[var(--color-surface-hover)] text-[var(--color-text)]'
                        }`}
                      >
                        <div>
                          <div className="font-medium truncate">{srv.name}</div>
                          <div className="text-[10px] text-[var(--color-text-muted)] font-mono">
                            {srv.host}:{srv.port} • {srv.hostType === 'localhost' ? 'User PC' : 'Remote VPS'}
                          </div>
                        </div>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            srv.status === 'online' ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-[var(--color-border)]">
                    <button
                      type="button"
                      onClick={() => {
                        setServerDropdownOpen(false);
                        openConnectModal();
                      }}
                      className="w-full py-1.5 px-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Connect Another Server
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Server Controls */}
            <div className="flex items-center gap-1 bg-[var(--color-surface-hover)] p-1 rounded-lg border border-[var(--color-border)]">
              {activeServer.status === 'online' ? (
                <>
                  <button
                    type="button"
                    onClick={restartServer}
                    className="p-1.5 text-amber-400 hover:bg-amber-400/10 rounded transition"
                    title="Restart BeamMP Server"
                    aria-label="Restart BeamMP Server"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={stopServer}
                    className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition"
                    title="Stop BeamMP Server"
                    aria-label="Stop BeamMP Server"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={startServer}
                  className="p-1.5 text-emerald-400 hover:bg-emerald-400/10 rounded transition"
                  title="Start BeamMP Server"
                  aria-label="Start BeamMP Server"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>
              )}

              <button
                type="button"
                onClick={triggerClientModSync}
                disabled={isSyncingMods}
                className="p-1.5 text-orange-400 hover:bg-orange-400/10 rounded transition disabled:opacity-50"
                title="Broadcast Reload to Clients"
                aria-label="Broadcast Reload to Clients"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingMods ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Spotify Player Toggle Button */}
            <button
              type="button"
              onClick={() => {
                if (!spotify.isVisible) {
                  spotify.setIsVisible(true);
                  spotify.setIsMinimized(false);
                } else {
                  spotify.setIsMinimized(!spotify.isMinimized);
                }
              }}
              className={`p-2 rounded-lg border transition flex items-center gap-1.5 text-xs font-medium ${
                spotify.isVisible
                  ? spotify.state.isPlaying
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                    : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/5'
                  : 'border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text-muted)]'
              }`}
              title="Toggle Spotify Controller"
              aria-label="Toggle Spotify Controller"
            >
              <Music className={`w-4 h-4 ${spotify.state.isPlaying ? 'animate-pulse text-emerald-400' : ''}`} />
              <span className="hidden sm:inline">Spotify</span>
              {spotify.state.isPlaying && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              )}
            </button>

            {/* Accessibility & Theme button */}
            <button
              type="button"
              onClick={openAccessibilityModal}
              className="p-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-[var(--color-text)] transition flex items-center gap-1.5 text-xs font-medium"
              title="Theme & Accessibility Settings"
              aria-label="Theme and accessibility settings"
            >
              <Eye className="w-4 h-4 text-orange-400" />
              <span className="hidden md:inline">Theme</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-2 scrollbar-none" aria-label="Dashboard sections">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : ''}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-black/25 text-white' : 'bg-orange-500/10 text-orange-500'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.alert && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="High CPU Load" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

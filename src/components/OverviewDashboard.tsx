import React from 'react';
import { useServer } from '../context/ServerContext';
import { formatBytes } from '../utils/beammp';
import {
  Server,
  Users,
  FolderOpen,
  Activity,
  Cpu,
  Laptop,
  Play,
  RotateCw,
  Terminal,
  Upload,
  Archive,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Zap
} from 'lucide-react';

interface OverviewDashboardProps {
  onNavigate: (tab: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({ onNavigate }) => {
  const {
    activeServer,
    serverConfig,
    players,
    mods,
    hostMetrics,
    consoleLogs,
    restartServer,
    triggerClientModSync,
    isSyncingMods
  } = useServer();

  const activeMods = mods.filter((m) => m.isEnabled);
  const totalModBytes = activeMods.reduce((acc, m) => acc + m.sizeBytes, 0);

  // Map label clean
  const mapFriendlyName = serverConfig.Map
    .replace('/levels/', '')
    .replace('/info.json', '')
    .replace(/[_-]/g, ' ')
    .toUpperCase();

  const uptimeHours = Math.floor(activeServer.uptimeSeconds / 3600);
  const uptimeMinutes = Math.floor((activeServer.uptimeSeconds % 3600) / 60);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 border border-[var(--color-border)] p-6 sm:p-8 shadow-xl text-white">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  activeServer.status === 'online'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                {activeServer.status.toUpperCase()}
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-neutral-200 border border-white/10">
                {activeServer.hostType === 'localhost' ? (
                  <>
                    <Laptop className="w-3.5 h-3.5 text-orange-400" /> User's PC (Local Host)
                  </>
                ) : (
                  <>
                    <Server className="w-3.5 h-3.5 text-blue-400" /> Dedicated VPS Host
                  </>
                )}
              </span>

              <span className="px-2 py-0.5 rounded text-[11px] font-mono text-neutral-400 bg-black/40">
                {activeServer.os.toUpperCase()} • Port {activeServer.port}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {activeServer.name}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl line-clamp-2">
              {serverConfig.Description || 'High performance BeamMP multiplayer server with custom physics mods.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-neutral-400">
              <div>
                Active Map:{' '}
                <span className="font-semibold text-orange-400">
                  {mapFriendlyName || 'WEST COAST USA'}
                </span>
              </div>
              <div>•</div>
              <div>
                Uptime: <span className="font-semibold text-white">{uptimeHours}h {uptimeMinutes}m</span>
              </div>
              <div>•</div>
              <div>
                Server Path: <span className="font-mono text-neutral-300">{activeServer.serverFolderPath}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions in Hero */}
          <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('mods')}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition flex items-center gap-2"
            >
              <Upload className="w-4 h-4" /> Upload Mod to Server
            </button>
            <button
              type="button"
              onClick={restartServer}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs border border-neutral-700 transition flex items-center gap-2"
            >
              <RotateCw className="w-4 h-4 text-amber-400" /> Restart Server
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Players Card */}
        <div
          onClick={() => onNavigate('players')}
          className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-orange-500/50 transition cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between text-[var(--color-text-muted)] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Connected Players</span>
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[var(--color-text)]">{players.length}</span>
            <span className="text-xs text-[var(--color-text-muted)] font-semibold">
              / {serverConfig.MaxPlayers} slots
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[var(--color-text-muted)] truncate">
            {players.length > 0 ? (
              <span>Top car: {players[0].vehicle}</span>
            ) : (
              <span>No players connected currently</span>
            )}
          </div>
        </div>

        {/* Mods Card */}
        <div
          onClick={() => onNavigate('mods')}
          className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-orange-500/50 transition cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between text-[var(--color-text-muted)] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Resources / Client Mods</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition">
              <FolderOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[var(--color-text)]">{activeMods.length}</span>
            <span className="text-xs text-[var(--color-text-muted)] font-semibold">
              active ({formatBytes(totalModBytes)})
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[var(--color-text-muted)] flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            <span>Client sync hash up to date</span>
          </div>
        </div>

        {/* Host Usage Card */}
        <div
          onClick={() => onNavigate('analytics')}
          className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-orange-500/50 transition cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between text-[var(--color-text-muted)] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">
              {hostMetrics.hostType === 'localhost' ? "Local Host (User's PC)" : "Dedicated VPS Usage"}
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-black ${
                hostMetrics.cpuTotalPercent > 80 ? 'text-red-500' : 'text-[var(--color-text)]'
              }`}
            >
              {hostMetrics.cpuTotalPercent.toFixed(0)}%
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-semibold">
              CPU • {((hostMetrics.ramUsedBytes / hostMetrics.ramTotalBytes) * 100).toFixed(0)}% RAM
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[var(--color-text-muted)]">
            {hostMetrics.hostType === 'localhost' ? 'Dual: BeamNG Game + Server' : 'Isolated headless process'}
          </div>
        </div>

        {/* Tickrate Card */}
        <div
          onClick={() => onNavigate('analytics')}
          className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-orange-500/50 transition cursor-pointer shadow-sm group"
        >
          <div className="flex items-center justify-between text-[var(--color-text-muted)] mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Tick Rate Stability</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[var(--color-text)]">
              {hostMetrics.serverTickRateHz.toFixed(1)}
            </span>
            <span className="text-xs text-[var(--color-text-muted)] font-semibold">
              / 60.0 Hz target
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            <span>Physics clock in sync (2000 Hz)</span>
          </div>
        </div>
      </div>

      {/* Main Split Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connected Racers Roster (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2">
              <Users className="w-4 h-4 text-orange-500" /> Active Players on Server
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('players')}
              className="text-xs text-orange-500 hover:underline font-semibold flex items-center gap-1"
            >
              Manage Permissions & Bans <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
            {players.length === 0 ? (
              <div className="p-8 text-center text-[var(--color-text-muted)]">
                No players are connected right now. Server is waiting for connections on port {activeServer.port}.
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[var(--color-surface-hover)] transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-sm shrink-0">
                        {player.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-[var(--color-text)]">
                            {player.name}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                              player.role === 'owner'
                                ? 'bg-orange-500/15 text-orange-500'
                                : player.role === 'admin'
                                ? 'bg-red-500/15 text-red-500'
                                : player.role === 'vip'
                                ? 'bg-purple-500/15 text-purple-400'
                                : 'bg-neutral-500/15 text-neutral-400'
                            }`}
                          >
                            {player.role}
                          </span>
                          {player.isMuted && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-500/20 text-red-400 font-bold">
                              MUTED
                            </span>
                          )}
                          {player.isFrozen && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/20 text-cyan-400 font-bold">
                              FROZEN
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[var(--color-text-muted)] flex items-center gap-2 mt-0.5">
                          <span>Vehicle: <strong className="text-[var(--color-text)]">{player.vehicle}</strong></span>
                          <span>•</span>
                          <span>Speed: {player.speedKmh} km/h</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-right">
                        <div className="font-mono text-[var(--color-text)]">{player.ping} ms</div>
                        <div className="text-[10px] text-[var(--color-text-muted)]">{player.joinedAt}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigate('players')}
                        className="px-2.5 py-1 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-active)] text-[var(--color-text)] text-xs transition"
                      >
                        Moderate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Intelligent Resource Advisor banner */}
          <div className="p-4 rounded-xl bg-[var(--color-surface)] border border-orange-500/30 bg-orange-500/5 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-500">
              <Zap className="w-4 h-4" />
              <span>Optimal Resource Allocation Advisor</span>
            </div>
            <p className="text-xs text-[var(--color-text)]">
              {hostMetrics.recommendations[0] || 'Hardware allocation is operating at optimal efficiency.'}
            </p>
          </div>
        </div>

        {/* Right Column: Live Mini Console Stream & Backups */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2">
              <Terminal className="w-4 h-4 text-orange-500" /> Live Console Feed
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('console')}
              className="text-xs text-orange-500 hover:underline font-semibold"
            >
              Full Terminal &rarr;
            </button>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 font-mono text-[11px] h-64 overflow-y-auto space-y-2 shadow-inner">
            {consoleLogs.slice(-6).map((log) => (
              <div key={log.id} className="leading-tight">
                <span className="text-neutral-500">[{log.timestamp}] </span>
                <span
                  className={
                    log.level === 'error'
                      ? 'text-red-400 font-bold'
                      : log.level === 'warn'
                      ? 'text-amber-400'
                      : log.level === 'chat'
                      ? 'text-sky-300'
                      : log.level === 'system'
                      ? 'text-purple-400'
                      : log.level === 'rcon'
                      ? 'text-emerald-400'
                      : 'text-neutral-300'
                  }
                >
                  {log.message}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Backup Snapshot Box */}
          <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-text)]">
                <Archive className="w-4 h-4 text-orange-500" />
                <span>Automatic Backups</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('backups')}
                className="text-xs text-orange-500 hover:underline"
              >
                Schedule &rarr;
              </button>
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">
              Daily snapshots guard against broken vehicle mods or corrupted ServerConfig files.
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-mono text-[var(--color-text)]">
                Next: Today at 04:00
              </span>
              <button
                type="button"
                onClick={() => onNavigate('backups')}
                className="px-3 py-1 rounded-lg bg-[var(--color-surface-hover)] hover:bg-[var(--color-surface-active)] text-xs text-[var(--color-text)] font-semibold border border-[var(--color-border)] transition"
              >
                Snapshot Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

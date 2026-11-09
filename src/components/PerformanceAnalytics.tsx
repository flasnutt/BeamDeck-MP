import React from 'react';
import { useServer } from '../context/ServerContext';
import { formatBytes } from '../utils/beammp';
import { HostType, OperatingSystem } from '../types/beammp';
import {
  Laptop,
  Server,
  Cpu,
  Zap,
  Activity,
  HardDrive,
  Wifi,
  Sparkles,
  Info,
  CheckCircle,
  AlertTriangle,
  Flame,
  Layers,
  Thermometer
} from 'lucide-react';

export const PerformanceAnalytics: React.FC = () => {
  const { hostMetrics, toggleHostType, setOperatingSystem, activeServer, players, mods } = useServer();

  const isLocal = hostMetrics.hostType === 'localhost';

  const ramUsedGb = (hostMetrics.ramUsedBytes / (1024 * 1024 * 1024)).toFixed(1);
  const ramTotalGb = (hostMetrics.ramTotalBytes / (1024 * 1024 * 1024)).toFixed(1);
  const ramPercent = ((hostMetrics.ramUsedBytes / hostMetrics.ramTotalBytes) * 100).toFixed(0);

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                {isLocal ? <Laptop className="w-5 h-5" /> : <Server className="w-5 h-5" />}
              </span>
              <h1 className="text-xl font-bold text-[var(--color-text)]">
                Cross-Environment Hardware & Physics Analytics
              </h1>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Currently monitoring:{' '}
              <strong className="text-[var(--color-text)]">
                {isLocal ? "User's Gaming PC (Local Host Environment)" : 'Remote Dedicated Server (Headless VPS)'}
              </strong>
            </p>
          </div>

          {/* Toggle between Local Computer vs Remote Server */}
          <div className="flex items-center gap-1.5 p-1 bg-[var(--color-surface-hover)] rounded-xl border border-[var(--color-border)] self-start md:self-auto">
            <button
              type="button"
              onClick={() => toggleHostType('localhost')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                isLocal
                  ? 'bg-orange-500 text-white shadow'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>User's PC (Local)</span>
            </button>

            <button
              type="button"
              onClick={() => toggleHostType('remote_server')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
                !isLocal
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Dedicated VPS</span>
            </button>
          </div>
        </div>

        {/* Informational callout on why local vs hosted matters */}
        <div
          className={`p-4 rounded-xl border text-xs leading-relaxed ${
            isLocal
              ? 'bg-orange-500/5 border-orange-500/20 text-[var(--color-text)]'
              : 'bg-blue-500/5 border-blue-500/20 text-[var(--color-text)]'
          }`}
        >
          {isLocal ? (
            <div>
              <strong className="text-orange-500 font-bold block mb-1">
                Local PC Host Mode Architecture:
              </strong>
              BeamNG.drive is one of the most computationally demanding physics simulations in gaming. When hosting on your own PC, your system handles <strong>both</strong> the local 3D rendering client and the multiplayer server state synchronization. Core 0 and Core 1 handle soft-body real-time vehicle deformation.
            </div>
          ) : (
            <div>
              <strong className="text-blue-400 font-bold block mb-1">
                Dedicated Remote Server Mode:
              </strong>
              Server runs headless in an isolated Linux container with no graphical rendering overhead. All hardware resources are dedicated to high-frequency networking, player positions, and mod streaming.
            </div>
          )}
        </div>
      </div>

      {/* Primary Key Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Total */}
        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-semibold">
            <span>Overall CPU Load</span>
            <Cpu className="w-4 h-4 text-orange-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-black ${
                hostMetrics.cpuTotalPercent > 80 ? 'text-red-500' : 'text-[var(--color-text)]'
              }`}
            >
              {hostMetrics.cpuTotalPercent.toFixed(1)}%
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              {isLocal ? 'User PC Threads' : 'VPS Cores'}
            </span>
          </div>
          <div className="w-full bg-[var(--color-surface-hover)] rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                hostMetrics.cpuTotalPercent > 80 ? 'bg-red-500' : 'bg-orange-500'
              }`}
              style={{ width: `${hostMetrics.cpuTotalPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-[var(--color-text-muted)] truncate">
            {hostMetrics.systemModel}
          </div>
        </div>

        {/* RAM Usage */}
        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-semibold">
            <span>Memory Allocation</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[var(--color-text)]">{ramUsedGb}</span>
            <span className="text-xs text-[var(--color-text-muted)]">/ {ramTotalGb} GB ({ramPercent}%)</span>
          </div>
          <div className="w-full bg-[var(--color-surface-hover)] rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${ramPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-[var(--color-text-muted)]">
            BeamMP Server process + Mod resource pool
          </div>
        </div>

        {/* Tickrate Stability */}
        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-semibold">
            <span>Server Tick Frequency</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400">
              {hostMetrics.serverTickRateHz.toFixed(1)}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">/ 60.0 Hz</span>
          </div>
          <div className="text-[11px] text-emerald-500 flex items-center gap-1 font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>0.0% Packet Drop Rate</span>
          </div>
          <div className="text-[10px] text-[var(--color-text-muted)]">
            Physics sync step: {hostMetrics.physicsTickRateHz} Hz
          </div>
        </div>

        {/* Network Throughput */}
        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[var(--color-text-muted)] font-semibold">
            <span>Network Uplink</span>
            <Wifi className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[var(--color-text)]">
              {(hostMetrics.networkOutKbps / 1024).toFixed(2)}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">MB/s Out</span>
          </div>
          <div className="text-[11px] text-[var(--color-text-muted)]">
            Inbound: {(hostMetrics.networkInKbps / 1024).toFixed(2)} MB/s
          </div>
          <div className="text-[10px] text-[var(--color-text-muted)]">
            Serving {players.length} synchronized vehicle streams
          </div>
        </div>
      </div>

      {/* Core-by-Core CPU Gauge (Vital for BeamNG soft-body physics) */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-orange-500" /> Core-by-Core Physics & Worker Thread Breakdown
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              {isLocal
                ? 'BeamNG splits soft-body car nodes across physical CPU threads. Inspect threads to avoid bottlenecking.'
                : 'Linux kernel thread allocation across virtual cores.'}
            </p>
          </div>
          <span className="text-xs font-mono text-[var(--color-text-muted)]">
            {hostMetrics.cpuCores.length} Threads Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
          {hostMetrics.cpuCores.map((core) => (
            <div
              key={core.coreId}
              className={`p-3 rounded-xl border text-center transition space-y-2 ${
                core.isPhysicsThread && isLocal
                  ? 'border-orange-500/40 bg-orange-500/5'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-hover)]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-[var(--color-text)]">Core {core.coreId}</span>
                {core.isPhysicsThread && isLocal && (
                  <span className="px-1 py-0.2 rounded bg-orange-500 text-white text-[8px] uppercase">
                    PHYS
                  </span>
                )}
              </div>

              {/* Bar */}
              <div className="w-full bg-[var(--color-surface-active)] h-20 rounded-lg p-1 flex items-end justify-center">
                <div
                  className={`w-full rounded-md transition-all duration-300 ${
                    core.usagePercent > 80
                      ? 'bg-red-500'
                      : core.isPhysicsThread && isLocal
                      ? 'bg-orange-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ height: `${core.usagePercent}%` }}
                />
              </div>

              <div className="text-xs font-mono font-bold text-[var(--color-text)]">
                {core.usagePercent.toFixed(0)}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Intelligent Resource Allocation Advisor */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-orange-500/30 bg-orange-500/5 space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-orange-500" />
          <h2 className="text-base font-bold text-[var(--color-text)]">
            Intelligent Resource Allocation Advisor
          </h2>
        </div>

        <div className="space-y-2.5">
          {hostMetrics.recommendations.map((rec, index) => (
            <div
              key={index}
              className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text)] flex items-start gap-2.5 shadow-sm"
            >
              <CheckCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

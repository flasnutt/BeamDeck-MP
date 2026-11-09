import React, { useState, useRef, useEffect } from 'react';
import { useServer } from '../context/ServerContext';
import { ConsoleLogEntry } from '../types/beammp';
import {
  Terminal,
  Send,
  Trash2,
  Download,
  Pause,
  Play,
  Filter,
  CheckCircle2,
  Info,
  AlertTriangle,
  Flame,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export const LiveConsole: React.FC = () => {
  const { consoleLogs, executeConsoleCommand, clearConsole, activeServer } = useServer();

  const [inputCommand, setInputCommand] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [autoScroll, setAutoScroll] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new logs if enabled
  useEffect(() => {
    if (autoScroll && !isPaused && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [consoleLogs, autoScroll, isPaused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCommand.trim()) return;
    executeConsoleCommand(inputCommand);
    setInputCommand('');
  };

  const filteredLogs = consoleLogs.filter((log) => {
    if (filter === 'all') return true;
    if (filter === 'chat') return log.level === 'chat';
    if (filter === 'errors') return log.level === 'error' || log.level === 'warn';
    if (filter === 'rcon') return log.level === 'rcon';
    if (filter === 'system') return log.level === 'system' || log.source === 'Server';
    return true;
  });

  const handleDownloadLog = () => {
    const textContent = consoleLogs
      .map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.source}]: ${l.message}`)
      .join('\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BeamMP-Server-${activeServer.id}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const quickCommands = [
    { label: 'status', cmd: 'status' },
    { label: 'list players', cmd: 'list' },
    { label: 'reload mods', cmd: 'reloadmods' },
    { label: 'say announcement', cmd: 'say Welcome to the server!' },
    { label: 'save config', cmd: 'saveconfig' },
    { label: 'help', cmd: 'help' }
  ];

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
        <div>
          <h1 className="text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
            <Terminal className="w-5 h-5 text-orange-500" /> BeamMP Real-Time Server Console
          </h1>
          <p className="text-xs text-[var(--color-text-muted)]">
            Live interactive RCON terminal stream directly bound to {activeServer.host}:{activeServer.port}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition ${
              isPaused
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]'
            }`}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? 'Resume Feed' : 'Pause Feed'}</span>
          </button>

          <button
            type="button"
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
              autoScroll
                ? 'bg-orange-500/10 text-orange-500 border-orange-500/30'
                : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-hover)]'
            }`}
          >
            Auto-scroll: {autoScroll ? 'ON' : 'OFF'}
          </button>

          <button
            type="button"
            onClick={handleDownloadLog}
            className="p-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-orange-500 hover:bg-[var(--color-surface-hover)] transition"
            title="Download Server.log"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={clearConsole}
            className="p-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-red-400 hover:bg-[var(--color-surface-hover)] transition"
            title="Clear Console"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Output', count: consoleLogs.length },
          { id: 'chat', label: 'In-Game Chat', count: consoleLogs.filter((l) => l.level === 'chat').length },
          { id: 'errors', label: 'Errors & Warnings', count: consoleLogs.filter((l) => l.level === 'error' || l.level === 'warn').length },
          { id: 'rcon', label: 'RCON Commands', count: consoleLogs.filter((l) => l.level === 'rcon').length },
          { id: 'system', label: 'Server Engine', count: consoleLogs.filter((l) => l.source === 'Server').length }
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              filter === t.id
                ? 'bg-neutral-800 text-orange-400 border border-orange-500/40 shadow-sm'
                : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            <span>{t.label}</span>
            <span className="text-[10px] opacity-60">({t.count})</span>
          </button>
        ))}
      </div>

      {/* Terminal Display */}
      <div className="relative rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden shadow-2xl flex flex-col h-[520px]">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-neutral-300 font-semibold pl-2">
              BeamMP-Server — {activeServer.host}:{activeServer.port}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" /> LIVE SOCKET
            </span>
            <span>{filteredLogs.length} events</span>
          </div>
        </div>

        {/* Scrollable logs area */}
        <div
          ref={scrollRef}
          className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-1.5 leading-relaxed selection:bg-orange-500/30"
        >
          {filteredLogs.length === 0 ? (
            <div className="text-neutral-500 italic py-8 text-center">
              No console events match the current filter.
            </div>
          ) : (
            filteredLogs.map((log) => {
              let color = 'text-neutral-300';
              let badgeColor = 'bg-neutral-800 text-neutral-400';

              if (log.level === 'error') {
                color = 'text-red-400 font-semibold';
                badgeColor = 'bg-red-500/20 text-red-400';
              } else if (log.level === 'warn') {
                color = 'text-amber-300';
                badgeColor = 'bg-amber-500/20 text-amber-300';
              } else if (log.level === 'chat') {
                color = 'text-sky-300';
                badgeColor = 'bg-sky-500/20 text-sky-300';
              } else if (log.level === 'rcon') {
                color = 'text-emerald-400 font-bold';
                badgeColor = 'bg-emerald-500/20 text-emerald-400';
              } else if (log.level === 'system') {
                color = 'text-purple-300';
                badgeColor = 'bg-purple-500/20 text-purple-300';
              }

              return (
                <div key={log.id} className="flex items-start gap-2 group hover:bg-white/[0.03] px-1 py-0.5 rounded">
                  <span className="text-neutral-500 shrink-0 text-[11px] select-none">
                    [{log.timestamp}]
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase shrink-0 select-none ${badgeColor}`}
                  >
                    {log.level}
                  </span>
                  <span className={`break-all ${color}`}>{log.message}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Command Pills */}
        <div className="px-4 py-2 bg-neutral-900/90 border-t border-neutral-800/80 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider shrink-0">
            Presets:
          </span>
          {quickCommands.map((q) => (
            <button
              key={q.label}
              type="button"
              onClick={() => {
                executeConsoleCommand(q.cmd);
              }}
              className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-mono whitespace-nowrap transition"
            >
              /{q.label}
            </button>
          ))}
        </div>

        {/* Interactive Command Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center gap-2"
        >
          <span className="text-orange-500 font-mono font-bold pl-2">&gt;</span>
          <input
            type="text"
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            placeholder="Type server command (e.g. status, reloadmods, kick <player>, say <msg>)..."
            className="flex-1 bg-transparent text-neutral-200 placeholder-neutral-500 text-xs font-mono focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
          >
            <Send className="w-3.5 h-3.5" /> Run
          </button>
        </form>
      </div>
    </div>
  );
};

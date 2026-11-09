import React, { useState } from 'react';
import { useServer } from '../context/ServerContext';
import { formatBytes } from '../utils/beammp';
import { BackupSnapshot, BackupFrequency } from '../types/beammp';
import {
  Archive,
  Clock,
  RotateCcw,
  Trash2,
  Download,
  Plus,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  HardDrive,
  AlertCircle
} from 'lucide-react';

export const BackupScheduler: React.FC = () => {
  const {
    backups,
    backupSchedule,
    updateBackupSchedule,
    createManualSnapshot,
    restoreBackup,
    deleteBackup,
    activeServer,
    mods
  } = useServer();

  const [snapName, setSnapName] = useState('');
  const [restoreConfirmId, setRestoreConfirmId] = useState<string | null>(null);

  const totalBackupBytes = backups.reduce((acc, b) => acc + b.sizeBytes, 0);

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    createManualSnapshot(snapName.trim() || undefined);
    setSnapName('');
  };

  const selectedRestoreSnapshot = backups.find((b) => b.id === restoreConfirmId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <Archive className="w-5 h-5 text-orange-500" /> Automatic Backup Scheduling & Snapshots
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Safeguards your <span className="font-mono text-orange-500">ServerConfig.toml</span>, custom mods, and player permissions with automated snapshot rotations.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-surface-hover)] px-3 py-1.5 rounded-xl border border-[var(--color-border)]">
          <HardDrive className="w-4 h-4 text-orange-500" />
          <span>Total Snapshots: {formatBytes(totalBackupBytes)}</span>
        </div>
      </div>

      {/* Grid: Schedule Config (Left) & Create Manual Snapshot (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schedule Configuration Card */}
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <h2 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">
                Automated Schedule Engine
              </h2>
            </div>
            {/* Toggle Enabled */}
            <button
              type="button"
              onClick={() => updateBackupSchedule({ enabled: !backupSchedule.enabled })}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                backupSchedule.enabled ? 'bg-orange-500' : 'bg-neutral-600'
              }`}
              role="switch"
              aria-checked={backupSchedule.enabled}
              aria-label="Toggle automated backups"
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  backupSchedule.enabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text)] mb-1">
                  Backup Frequency
                </label>
                <select
                  value={backupSchedule.frequency}
                  onChange={(e) =>
                    updateBackupSchedule({ frequency: e.target.value as BackupFrequency })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs text-[var(--color-text)] focus:ring-2 focus:ring-orange-500"
                >
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily Maintenance</option>
                  <option value="weekly">Weekly Rotation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text)] mb-1">
                  Execution Time
                </label>
                <input
                  type="time"
                  value={backupSchedule.timeOfDay}
                  onChange={(e) => updateBackupSchedule({ timeOfDay: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs font-mono text-[var(--color-text)] focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text)] mb-1">
                  Retention Policy
                </label>
                <select
                  value={backupSchedule.maxRetention}
                  onChange={(e) => updateBackupSchedule({ maxRetention: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs text-[var(--color-text)] focus:ring-2 focus:ring-orange-500"
                >
                  <option value={5}>Keep Last 5 Snapshots</option>
                  <option value={10}>Keep Last 10 Snapshots</option>
                  <option value={20}>Keep Last 20 Snapshots</option>
                  <option value={30}>Keep Last 30 Snapshots</option>
                </select>
              </div>

              <div className="p-2.5 rounded-lg bg-[var(--color-surface-hover)] border border-[var(--color-border)] flex flex-col justify-center">
                <span className="text-[10px] text-[var(--color-text-muted)] uppercase">Next Run</span>
                <span className="text-xs font-mono font-bold text-orange-500">
                  {backupSchedule.nextBackupAt || 'Tomorrow at 04:00'}
                </span>
              </div>
            </div>

            {/* Inclusions */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text)] mb-2">
                Included Assets
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-[var(--color-text)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={backupSchedule.includeConfig}
                    onChange={(e) => updateBackupSchedule({ includeConfig: e.target.checked })}
                    className="rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span>ServerConfig.toml & environment configuration</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[var(--color-text)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={backupSchedule.includeMods}
                    onChange={(e) => updateBackupSchedule({ includeMods: e.target.checked })}
                    className="rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span>Resources/Client custom vehicle and map mods (.zip)</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-[var(--color-text)] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={backupSchedule.includePermissions}
                    onChange={(e) => updateBackupSchedule({ includePermissions: e.target.checked })}
                    className="rounded text-orange-500 focus:ring-orange-500"
                  />
                  <span>Player database, permissions roles, and active banlist</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Instant Snapshot Card */}
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-orange-500" />
              <h2 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">
                Create Instant Manual Snapshot
              </h2>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Freeze the current server configuration, installed mods ({mods.length} files), and player permissions into a restore point before installing new or experimental mods.
            </p>
          </div>

          <form onSubmit={handleCreateSnapshot} className="space-y-4 pt-4">
            <div>
              <label className="block text-xs font-medium text-[var(--color-text)] mb-1">
                Snapshot Label / Memo
              </label>
              <input
                type="text"
                value={snapName}
                onChange={(e) => setSnapName(e.target.value)}
                placeholder="e.g. pre-touge-map-install or tournament-backup"
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs text-[var(--color-text)] focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>

            <div className="p-3 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-xs text-[var(--color-text-muted)] space-y-1">
              <div className="flex justify-between">
                <span>Estimated Snapshot Size:</span>
                <strong className="text-[var(--color-text)] font-mono">
                  {formatBytes(mods.reduce((acc, m) => acc + m.sizeBytes, 500000))}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Active Server:</span>
                <strong className="text-[var(--color-text)]">{activeServer.name}</strong>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Snapshot Now
            </button>
          </form>
        </div>
      </div>

      {/* Snapshot History Table */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-[var(--color-text)]">
          Snapshot Repository & One-Click Restore Points
        </h2>

        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
          {backups.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--color-text-muted)]">
              No backups stored yet. Click "Create Snapshot Now" above.
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {backups.map((snap) => (
                <div
                  key={snap.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--color-surface-hover)] transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[var(--color-text)]">{snap.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          snap.type === 'hourly'
                            ? 'bg-blue-500/10 text-blue-400'
                            : snap.type === 'daily'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-purple-500/10 text-purple-400'
                        }`}
                      >
                        {snap.type}
                      </span>
                      <span className="text-xs font-mono text-[var(--color-text-muted)]">
                        {formatBytes(snap.sizeBytes)}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] flex flex-wrap items-center gap-2">
                      <span>Created: {snap.timestamp}</span>
                      <span>•</span>
                      <span>Trigger: {snap.trigger}</span>
                      <span>•</span>
                      <span>Mods Included: {snap.modCount} files</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => setRestoreConfirmId(snap.id)}
                      className="px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 text-xs font-bold border border-orange-500/30 transition flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Restore to Server
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        alert(`Downloading backup archive "${snap.name}.zip"`);
                      }}
                      className="p-2 text-[var(--color-text-muted)] hover:text-orange-500 rounded-lg hover:bg-[var(--color-surface-active)] transition"
                      title="Download backup archive"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteBackup(snap.id)}
                      className="p-2 text-[var(--color-text-muted)] hover:text-red-500 rounded-lg hover:bg-[var(--color-surface-active)] transition"
                      title="Delete snapshot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Restore Confirmation Modal */}
      {restoreConfirmId && selectedRestoreSnapshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-amber-500 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" /> Confirm Server Rollback
            </h3>
            <p className="text-xs text-[var(--color-text)] leading-relaxed">
              Are you sure you want to restore the server to snapshot{' '}
              <strong>"{selectedRestoreSnapshot.name}"</strong>?
            </p>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              This will overwrite the current <span className="font-mono">ServerConfig.toml</span> and reset the <span className="font-mono">Resources/Client</span> folder to the snapshot state, followed by a live server restart.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRestoreConfirmId(null)}
                className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  restoreBackup(selectedRestoreSnapshot.id);
                  setRestoreConfirmId(null);
                }}
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold"
              >
                Proceed with Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

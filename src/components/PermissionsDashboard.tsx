import React, { useState } from 'react';
import { useServer } from '../context/ServerContext';
import { PlayerRole, Player } from '../types/beammp';
import {
  Users,
  Shield,
  UserX,
  Ban,
  VolumeX,
  Volume2,
  Lock,
  Unlock,
  Navigation,
  Sliders,
  Check,
  X,
  UserCheck,
  Plus,
  AlertTriangle,
  Flame,
  Car
} from 'lucide-react';

export const PermissionsDashboard: React.FC = () => {
  const {
    players,
    kickPlayer,
    banPlayer,
    mutePlayer,
    freezePlayer,
    teleportPlayer,
    changePlayerRole,
    roles,
    updateRolePermissions,
    bans,
    unbanPlayer,
    whitelist,
    addToWhitelist,
    removeFromWhitelist
  } = useServer();

  const [activeSubTab, setActiveSubTab] = useState<'players' | 'roles' | 'bans' | 'whitelist'>('players');

  // Modals state
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [kickModalOpen, setKickModalOpen] = useState(false);
  const [kickReason, setKickReason] = useState('Reckless ramming in pitlane');

  const [banModalOpen, setBanModalOpen] = useState(false);
  const [banReason, setBanReason] = useState('Intentional physics lag exploitation');
  const [banDuration, setBanDuration] = useState('24 Hours');

  const [teleportModalOpen, setTeleportModalOpen] = useState(false);
  const [teleportTarget, setTeleportTarget] = useState('Pitlane Garage #1');

  // New whitelist state
  const [newWlName, setNewWlName] = useState('');
  const [newWlId, setNewWlId] = useState('');
  const [newWlNotes, setNewWlNotes] = useState('');

  const waypoints = [
    'Pitlane Garage #1',
    'Main Drag Strip Starting Line',
    'Airport Runway 09R',
    'Mountain Touge Summit',
    'Drift Arena Pad',
    'Downtown Intersection'
  ];

  return (
    <div className="space-y-6">
      {/* Header & Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-500" /> Remote Player & Permissions Dashboard
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Enforce role-based access control (RBAC), moderate live racers, and manage server whitelists.
          </p>
        </div>

        {/* Sub tabs */}
        <div className="flex items-center gap-1 bg-[var(--color-surface-hover)] p-1 rounded-xl border border-[var(--color-border)]">
          <button
            type="button"
            onClick={() => setActiveSubTab('players')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'players' ? 'bg-orange-500 text-white shadow' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Live Players ({players.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('roles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'roles' ? 'bg-orange-500 text-white shadow' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Role Permissions
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('bans')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'bans' ? 'bg-orange-500 text-white shadow' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Banlist ({bans.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('whitelist')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSubTab === 'whitelist' ? 'bg-orange-500 text-white shadow' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Whitelist ({whitelist.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Live Players */}
      {activeSubTab === 'players' && (
        <div className="space-y-4">
          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
            {players.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--color-text-muted)]">
                No racers currently connected to this server.
              </div>
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
                {players.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[var(--color-surface-hover)] transition"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-sm shrink-0">
                        {p.name.substring(0, 2).toUpperCase()}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-[var(--color-text)]">{p.name}</span>
                          <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
                            [{p.beammpId}]
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              p.role === 'owner'
                                ? 'bg-orange-500/15 text-orange-500'
                                : p.role === 'admin'
                                ? 'bg-red-500/15 text-red-500'
                                : p.role === 'vip'
                                ? 'bg-purple-500/15 text-purple-400'
                                : 'bg-neutral-500/15 text-neutral-400'
                            }`}
                          >
                            {p.role}
                          </span>
                          {p.isMuted && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-red-500/20 text-red-400 font-bold">
                              MUTED
                            </span>
                          )}
                          {p.isFrozen && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-cyan-500/20 text-cyan-400 font-bold">
                              PHYSICS FROZEN
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-[var(--color-text-muted)] flex flex-wrap items-center gap-3">
                          <span>
                            Car: <strong className="text-[var(--color-text)]">{p.vehicle}</strong>
                          </span>
                          <span>•</span>
                          <span>Speed: <strong>{p.speedKmh} km/h</strong></span>
                          <span>•</span>
                          <span>Ping: <strong className="text-emerald-400 font-mono">{p.ping} ms</strong></span>
                          <span>•</span>
                          <span>IP: <span className="font-mono">{p.ip}</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Moderation Actions */}
                    <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
                      {/* Role selector dropdown */}
                      <select
                        value={p.role}
                        onChange={(e) => changePlayerRole(p.id, e.target.value as PlayerRole)}
                        className="px-2 py-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:ring-1 focus:ring-orange-500"
                        aria-label={`Change role for ${p.name}`}
                      >
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                        <option value="vip">VIP</option>
                        <option value="player">Player</option>
                        <option value="guest">Guest</option>
                      </select>

                      {/* Mute button */}
                      <button
                        type="button"
                        onClick={() => mutePlayer(p.id)}
                        className={`p-1.5 rounded-lg border border-[var(--color-border)] text-xs transition ${
                          p.isMuted
                            ? 'bg-red-500/20 text-red-400 border-red-500/40'
                            : 'hover:bg-[var(--color-surface-active)] text-[var(--color-text-muted)]'
                        }`}
                        title={p.isMuted ? 'Unmute Player' : 'Mute in Chat'}
                      >
                        {p.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>

                      {/* Freeze physics button */}
                      <button
                        type="button"
                        onClick={() => freezePlayer(p.id)}
                        className={`p-1.5 rounded-lg border border-[var(--color-border)] text-xs transition ${
                          p.isFrozen
                            ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                            : 'hover:bg-[var(--color-surface-active)] text-[var(--color-text-muted)]'
                        }`}
                        title={p.isFrozen ? 'Unfreeze Vehicle' : 'Freeze Vehicle Physics'}
                      >
                        {p.isFrozen ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>

                      {/* Teleport button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPlayer(p);
                          setTeleportModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-orange-500 hover:bg-[var(--color-surface-active)] transition text-xs"
                        title="Teleport to Waypoint"
                      >
                        <Navigation className="w-4 h-4" />
                      </button>

                      {/* Kick button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPlayer(p);
                          setKickModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-semibold transition"
                      >
                        Kick
                      </button>

                      {/* Ban button */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPlayer(p);
                          setBanModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/20 transition"
                      >
                        Ban
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Role Permissions Matrix */}
      {activeSubTab === 'roles' && (
        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-[var(--color-text)]">
              Fine-Grained Role Permissions Matrix
            </h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              Configure what commands, vehicle spawning quantities, and administrative powers each role possesses.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--color-text-muted)]">
                  <th className="py-3 px-4 font-bold">Role</th>
                  <th className="py-3 px-3 font-bold text-center">Console Access</th>
                  <th className="py-3 px-3 font-bold text-center">Upload Mods</th>
                  <th className="py-3 px-3 font-bold text-center">Delete Mods</th>
                  <th className="py-3 px-3 font-bold text-center">Edit Config</th>
                  <th className="py-3 px-3 font-bold text-center">Kick & Ban</th>
                  <th className="py-3 px-3 font-bold text-center">Teleport</th>
                  <th className="py-3 px-3 font-bold text-center">Slow-Mo</th>
                  <th className="py-3 px-3 font-bold text-center">Max Vehicles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {roles.map((r) => (
                  <tr key={r.role} className="hover:bg-[var(--color-surface-hover)]">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[var(--color-text)]">{r.displayName}</div>
                      <div className="text-[10px] text-[var(--color-text-muted)] font-mono">{r.role}</div>
                    </td>

                    {/* Console Access */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={r.canAccessConsole}
                        disabled={r.role === 'owner'}
                        onChange={(e) => updateRolePermissions(r.role, { canAccessConsole: e.target.checked })}
                        className="rounded border-[var(--color-border)] text-orange-500 focus:ring-orange-500"
                      />
                    </td>

                    {/* Upload Mods */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={r.canUploadMods}
                        disabled={r.role === 'owner'}
                        onChange={(e) => updateRolePermissions(r.role, { canUploadMods: e.target.checked })}
                        className="rounded border-[var(--color-border)] text-orange-500 focus:ring-orange-500"
                      />
                    </td>

                    {/* Delete Mods */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={r.canDeleteMods}
                        disabled={r.role === 'owner'}
                        onChange={(e) => updateRolePermissions(r.role, { canDeleteMods: e.target.checked })}
                        className="rounded border-[var(--color-border)] text-orange-500 focus:ring-orange-500"
                      />
                    </td>

                    {/* Edit Config */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={r.canEditConfig}
                        disabled={r.role === 'owner'}
                        onChange={(e) => updateRolePermissions(r.role, { canEditConfig: e.target.checked })}
                        className="rounded border-[var(--color-border)] text-orange-500 focus:ring-orange-500"
                      />
                    </td>

                    {/* Kick & Ban */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={r.canKickBan}
                        disabled={r.role === 'owner'}
                        onChange={(e) => updateRolePermissions(r.role, { canKickBan: e.target.checked })}
                        className="rounded border-[var(--color-border)] text-orange-500 focus:ring-orange-500"
                      />
                    </td>

                    {/* Teleport */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={r.canTeleport}
                        disabled={r.role === 'owner'}
                        onChange={(e) => updateRolePermissions(r.role, { canTeleport: e.target.checked })}
                        className="rounded border-[var(--color-border)] text-orange-500 focus:ring-orange-500"
                      />
                    </td>

                    {/* Slow-mo */}
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={r.canSlowMotion}
                        disabled={r.role === 'owner'}
                        onChange={(e) => updateRolePermissions(r.role, { canSlowMotion: e.target.checked })}
                        className="rounded border-[var(--color-border)] text-orange-500 focus:ring-orange-500"
                      />
                    </td>

                    {/* Max Vehicles */}
                    <td className="py-3 px-3 text-center">
                      <select
                        value={r.maxSpawnedVehicles}
                        disabled={r.role === 'owner'}
                        onChange={(e) => updateRolePermissions(r.role, { maxSpawnedVehicles: Number(e.target.value) })}
                        className="px-2 py-0.5 rounded border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)]"
                      >
                        <option value={1}>1 Car</option>
                        <option value={2}>2 Cars</option>
                        <option value={3}>3 Cars</option>
                        <option value={5}>5 Cars</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Banlist */}
      {activeSubTab === 'bans' && (
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
          {bans.length === 0 ? (
            <div className="p-8 text-center text-xs text-[var(--color-text-muted)]">
              No active bans recorded. Server banlist is clean!
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {bans.map((b) => (
                <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[var(--color-text)]">{b.playerName}</span>
                      <span className="text-xs font-mono text-neutral-400">[{b.beammpId}]</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 font-bold">
                        BANNED: {b.expiresAt}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">
                      Reason: <span className="text-[var(--color-text)]">{b.reason}</span> • By {b.bannedBy} on {b.bannedAt}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => unbanPlayer(b.id)}
                    className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] text-xs font-semibold text-[var(--color-text)] transition"
                  >
                    Revoke Ban
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Whitelist */}
      {activeSubTab === 'whitelist' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text)] flex items-center gap-2">
              <Plus className="w-3.5 h-3.5 text-orange-500" /> Add Player to Whitelist
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Player Name"
                value={newWlName}
                onChange={(e) => setNewWlName(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs text-[var(--color-text)]"
              />
              <input
                type="text"
                placeholder="BeamMP ID (e.g. BMP-12345)"
                value={newWlId}
                onChange={(e) => setNewWlId(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs font-mono text-[var(--color-text)]"
              />
              <input
                type="text"
                placeholder="Notes (e.g. VIP League Driver)"
                value={newWlNotes}
                onChange={(e) => setNewWlNotes(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs text-[var(--color-text)]"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (newWlName && newWlId) {
                  addToWhitelist(newWlName, newWlId, newWlNotes);
                  setNewWlName('');
                  setNewWlId('');
                  setNewWlNotes('');
                }
              }}
              className="px-4 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition"
            >
              Add to Whitelist
            </button>
          </div>

          <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm divide-y divide-[var(--color-border)]">
            {whitelist.map((w) => (
              <div key={w.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-[var(--color-text)]">{w.playerName}</div>
                  <div className="text-xs text-[var(--color-text-muted)] font-mono">
                    {w.beammpId} • Added {w.addedAt} ({w.notes || 'No notes'})
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromWhitelist(w.id)}
                  className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg"
                  title="Remove from whitelist"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Kick Modal */}
      {kickModalOpen && selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[var(--color-text)]">
              Kick Player "{selectedPlayer.name}"
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              This will disconnect the player from the BeamMP server session immediately.
            </p>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Reason for Kick
              </label>
              <input
                type="text"
                value={kickReason}
                onChange={(e) => setKickReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs text-[var(--color-text)]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setKickModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  kickPlayer(selectedPlayer.id, kickReason);
                  setKickModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold"
              >
                Confirm Kick
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ban Modal */}
      {banModalOpen && selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-red-500 flex items-center gap-2">
              <Ban className="w-5 h-5" /> Ban Player "{selectedPlayer.name}"
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Blacklists the player's BeamMP ID ({selectedPlayer.beammpId}) and IP address ({selectedPlayer.ip}).
            </p>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Ban Duration
              </label>
              <select
                value={banDuration}
                onChange={(e) => setBanDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs text-[var(--color-text)]"
              >
                <option value="1 Hour">1 Hour</option>
                <option value="24 Hours">24 Hours</option>
                <option value="7 Days">7 Days</option>
                <option value="30 Days">30 Days</option>
                <option value="Permanent">Permanent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Reason for Ban
              </label>
              <input
                type="text"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs text-[var(--color-text)]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setBanModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  banPlayer(selectedPlayer.id, banReason, banDuration);
                  setBanModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Apply Ban
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teleport Modal */}
      {teleportModalOpen && selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2">
              <Navigation className="w-5 h-5 text-orange-500" /> Teleport "{selectedPlayer.name}"
            </h3>
            <p className="text-xs text-[var(--color-text-muted)]">
              Send player's active vehicle coordinates to a specific waypoint on the map.
            </p>
            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Select Destination Waypoint
              </label>
              <select
                value={teleportTarget}
                onChange={(e) => setTeleportTarget(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs text-[var(--color-text)]"
              >
                {waypoints.map((wp) => (
                  <option key={wp} value={wp}>
                    {wp}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTeleportModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-xs text-[var(--color-text)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  teleportPlayer(selectedPlayer.id, teleportTarget);
                  setTeleportModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold"
              >
                Teleport Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  ServerConnectionConfig,
  ModItem,
  Player,
  RolePermissions,
  BanEntry,
  WhitelistEntry,
  ConsoleLogEntry,
  BackupSnapshot,
  BackupScheduleConfig,
  HostPerformanceMetrics,
  ServerConfigToml,
  AccessibilitySettings,
  PlayerRole,
  HostType,
  OperatingSystem
} from '../types/beammp';
import {
  INITIAL_SERVERS,
  INITIAL_SERVER_CONFIG,
  INITIAL_MODS,
  INITIAL_PLAYERS,
  INITIAL_ROLES,
  INITIAL_BANS,
  INITIAL_WHITELIST,
  INITIAL_CONSOLE_LOGS,
  INITIAL_BACKUPS,
  INITIAL_BACKUP_SCHEDULE,
  INITIAL_HOST_METRICS_LOCAL,
  INITIAL_HOST_METRICS_REMOTE
} from '../data/initialData';
import {
  analyzeHostPerformance,
  calculateNextBackupRun,
  serializeServerConfigToml,
  validateModFile
} from '../utils/beammp';

interface ServerContextType {
  // Servers
  servers: ServerConnectionConfig[];
  activeServer: ServerConnectionConfig;
  setActiveServerId: (id: string) => void;
  connectNewServer: (config: Omit<ServerConnectionConfig, 'id' | 'uptimeSeconds' | 'lastPingMs' | 'version' | 'status'>) => void;
  updateServerStatus: (status: ServerConnectionConfig['status']) => void;
  restartServer: () => void;
  stopServer: () => void;
  startServer: () => void;

  // Mods
  mods: ModItem[];
  addMod: (file: { name: string; size: number }) => { success: boolean; error?: string };
  toggleModEnabled: (id: string) => void;
  removeMod: (id: string) => void;
  installPopularMod: (preset: { name: string; filename: string; category: ModItem['category']; sizeBytes: number; description: string }) => void;
  isSyncingMods: boolean;
  triggerClientModSync: () => void;

  // Players & Permissions
  players: Player[];
  kickPlayer: (playerId: string, reason: string) => void;
  banPlayer: (playerId: string, reason: string, duration: string) => void;
  mutePlayer: (playerId: string) => void;
  freezePlayer: (playerId: string) => void;
  teleportPlayer: (playerId: string, targetLocation: string) => void;
  changePlayerRole: (playerId: string, newRole: PlayerRole) => void;
  roles: RolePermissions[];
  updateRolePermissions: (roleName: PlayerRole, updates: Partial<RolePermissions>) => void;
  bans: BanEntry[];
  unbanPlayer: (banId: string) => void;
  whitelist: WhitelistEntry[];
  addToWhitelist: (playerName: string, beammpId: string, notes?: string) => void;
  removeFromWhitelist: (id: string) => void;

  // Console Logs
  consoleLogs: ConsoleLogEntry[];
  executeConsoleCommand: (command: string) => void;
  clearConsole: () => void;
  logFilter: string;
  setLogFilter: (filter: string) => void;

  // Backups
  backups: BackupSnapshot[];
  backupSchedule: BackupScheduleConfig;
  updateBackupSchedule: (updates: Partial<BackupScheduleConfig>) => void;
  createManualSnapshot: (name?: string) => void;
  restoreBackup: (id: string) => void;
  deleteBackup: (id: string) => void;

  // Host Performance Analytics
  hostMetrics: HostPerformanceMetrics;
  toggleHostType: (type: HostType) => void;
  setOperatingSystem: (os: OperatingSystem) => void;

  // Configuration
  serverConfig: ServerConfigToml;
  updateServerConfig: (updates: Partial<ServerConfigToml>) => void;
  saveServerConfigToml: () => void;

  // Accessibility & Themes
  accessibility: AccessibilitySettings;
  updateAccessibility: (updates: Partial<AccessibilitySettings>) => void;

  // Toast notifications
  toastMessage: { text: string; type: 'success' | 'info' | 'warn' | 'error' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'warn' | 'error') => void;
}

const ServerContext = createContext<ServerContextType | undefined>(undefined);

export const ServerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Saved servers list
  const [servers, setServers] = useState<ServerConnectionConfig[]>(INITIAL_SERVERS);
  const [activeServerId, setActiveServerId] = useState<string>(INITIAL_SERVERS[0].id);

  // Active server object
  const activeServer = servers.find((s) => s.id === activeServerId) || servers[0];

  // Mods
  const [mods, setMods] = useState<ModItem[]>(INITIAL_MODS);
  const [isSyncingMods, setIsSyncingMods] = useState<boolean>(false);

  // Players
  const [players, setPlayers] = useState<Player[]>(INITIAL_PLAYERS);
  const [roles, setRoles] = useState<RolePermissions[]>(INITIAL_ROLES);
  const [bans, setBans] = useState<BanEntry[]>(INITIAL_BANS);
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>(INITIAL_WHITELIST);

  // Console
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLogEntry[]>(INITIAL_CONSOLE_LOGS);
  const [logFilter, setLogFilter] = useState<string>('all');

  // Backups
  const [backups, setBackups] = useState<BackupSnapshot[]>(INITIAL_BACKUPS);
  const [backupSchedule, setBackupSchedule] = useState<BackupScheduleConfig>(INITIAL_BACKUP_SCHEDULE);

  // Host Metrics
  const [hostMetrics, setHostMetrics] = useState<HostPerformanceMetrics>(
    activeServer.hostType === 'localhost' ? INITIAL_HOST_METRICS_LOCAL : INITIAL_HOST_METRICS_REMOTE
  );

  // ServerConfig
  const [serverConfig, setServerConfig] = useState<ServerConfigToml>(INITIAL_SERVER_CONFIG);

  // Accessibility
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    theme: 'beam-orange',
    fontSize: 'md',
    reducedMotion: false,
    highContrast: false,
    soundAlerts: false
  });

  // Toasts
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warn' | 'error' } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'warn' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((cur) => (cur?.text === text ? null : cur));
    }, 4000);
  }, []);

  // Update server status helper
  const updateServerStatus = useCallback((status: ServerConnectionConfig['status']) => {
    setServers((prev) =>
      prev.map((s) => (s.id === activeServer.id ? { ...s, status } : s))
    );
  }, [activeServer.id]);

  // Connect new server
  const connectNewServer = useCallback(
    (config: Omit<ServerConnectionConfig, 'id' | 'uptimeSeconds' | 'lastPingMs' | 'version' | 'status'>) => {
      const newId = `srv-${Date.now().toString(36)}`;
      const newServer: ServerConnectionConfig = {
        ...config,
        id: newId,
        uptimeSeconds: 120,
        lastPingMs: config.hostType === 'localhost' ? 1 : 32,
        version: 'v3.4.1 (Build 824)',
        status: 'online'
      };

      setServers((prev) => [newServer, ...prev]);
      setActiveServerId(newId);

      // Adjust metrics for new server host type
      setHostMetrics(
        config.hostType === 'localhost' ? { ...INITIAL_HOST_METRICS_LOCAL, os: config.os } : { ...INITIAL_HOST_METRICS_REMOTE, os: config.os }
      );

      // Add log
      const timeStr = new Date().toLocaleTimeString();
      setConsoleLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}`,
          timestamp: timeStr,
          level: 'system',
          source: 'System',
          message: `Connected remote session to BeamMP server "${config.name}" (${config.host}:${config.port}). Authenticated with AuthKey.`
        }
      ]);

      showToast(`Successfully connected to ${config.name}!`, 'success');
    },
    [showToast]
  );

  // Server control actions
  const restartServer = useCallback(() => {
    updateServerStatus('restarting');
    const timeStr = new Date().toLocaleTimeString();
    setConsoleLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-restart`,
        timestamp: timeStr,
        level: 'warn',
        source: 'Server',
        message: 'Restart signal received from BeamDeck admin dashboard. Saving vehicle states and cycling process...'
      }
    ]);
    showToast('Restarting BeamMP server...', 'warn');

    setTimeout(() => {
      updateServerStatus('online');
      const nowStr = new Date().toLocaleTimeString();
      setConsoleLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}-online`,
          timestamp: nowStr,
          level: 'info',
          source: 'Server',
          message: 'BeamMP Server online. Sockets bound, resources verified.'
        }
      ]);
      showToast('BeamMP Server is now back online!', 'success');
    }, 2200);
  }, [updateServerStatus, showToast]);

  const stopServer = useCallback(() => {
    updateServerStatus('offline');
    const timeStr = new Date().toLocaleTimeString();
    setConsoleLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-stop`,
        timestamp: timeStr,
        level: 'warn',
        source: 'Server',
        message: 'BeamMP Server shutdown by administrator.'
      }
    ]);
    showToast('Server stopped.', 'info');
  }, [updateServerStatus, showToast]);

  const startServer = useCallback(() => {
    updateServerStatus('online');
    const timeStr = new Date().toLocaleTimeString();
    setConsoleLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}-start`,
        timestamp: timeStr,
        level: 'info',
        source: 'Server',
        message: 'BeamMP Server started successfully on port ' + activeServer.port
      }
    ]);
    showToast('Server started!', 'success');
  }, [updateServerStatus, activeServer.port, showToast]);

  // Mod management
  const addMod = useCallback(
    (file: { name: string; size: number }): { success: boolean; error?: string } => {
      const validation = validateModFile(file.name, file.size);
      if (!validation.valid) {
        showToast(validation.error || 'Invalid mod file', 'error');
        return { success: false, error: validation.error };
      }

      const newMod: ModItem = {
        id: `mod-${Date.now()}`,
        filename: file.name,
        name: validation.name,
        category: validation.category,
        sizeBytes: file.size,
        isEnabled: true,
        hash: Math.random().toString(16).substring(2, 12),
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        clientSyncCount: 0,
        description: `Uploaded directly into ${activeServer.serverFolderPath}\\Resources\\${validation.category === 'plugin' ? 'Server' : 'Client'}`
      };

      setMods((prev) => [newMod, ...prev]);

      // Console notification
      const timeStr = new Date().toLocaleTimeString();
      setConsoleLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}`,
          timestamp: timeStr,
          level: 'info',
          source: 'Server',
          message: `[Mod Manager] Added new mod "${newMod.filename}" (${(file.size / (1024 * 1024)).toFixed(1)} MB) to server folder.`
        }
      ]);

      showToast(`Mod "${validation.name}" uploaded to server folder!`, 'success');
      return { success: true };
    },
    [activeServer.serverFolderPath, showToast]
  );

  const toggleModEnabled = useCallback(
    (id: string) => {
      setMods((prev) =>
        prev.map((m) => {
          if (m.id === id) {
            const nextState = !m.isEnabled;
            const timeStr = new Date().toLocaleTimeString();
            setConsoleLogs((logs) => [
              ...logs,
              {
                id: `log-${Date.now()}`,
                timestamp: timeStr,
                level: 'info',
                source: 'Server',
                message: `[Mod Manager] ${m.filename} ${nextState ? 'enabled' : 'disabled (moved to inactive pool)'}.`
              }
            ]);
            showToast(`${m.name} is now ${nextState ? 'active' : 'disabled'}`, 'info');
            return { ...m, isEnabled: nextState };
          }
          return m;
        })
      );
    },
    [showToast]
  );

  const removeMod = useCallback(
    (id: string) => {
      const mod = mods.find((m) => m.id === id);
      setMods((prev) => prev.filter((m) => m.id !== id));
      if (mod) {
        showToast(`Removed mod "${mod.name}" from server folder`, 'info');
        const timeStr = new Date().toLocaleTimeString();
        setConsoleLogs((logs) => [
          ...logs,
          {
            id: `log-${Date.now()}`,
            timestamp: timeStr,
            level: 'info',
            source: 'Server',
            message: `[Mod Manager] File "${mod.filename}" deleted from server directory.`
          }
        ]);
      }
    },
    [mods, showToast]
  );

  const installPopularMod = useCallback(
    (preset: { name: string; filename: string; category: ModItem['category']; sizeBytes: number; description: string }) => {
      const exists = mods.some((m) => m.filename.toLowerCase() === preset.filename.toLowerCase());
      if (exists) {
        showToast(`Mod "${preset.name}" is already installed!`, 'warn');
        return;
      }

      const newMod: ModItem = {
        id: `mod-${Date.now()}`,
        filename: preset.filename,
        name: preset.name,
        category: preset.category,
        sizeBytes: preset.sizeBytes,
        isEnabled: true,
        hash: Math.random().toString(16).substring(2, 12),
        uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        clientSyncCount: 1,
        description: preset.description
      };

      setMods((prev) => [newMod, ...prev]);
      showToast(`Installed "${preset.name}" to server folder!`, 'success');
    },
    [mods, showToast]
  );

  const triggerClientModSync = useCallback(() => {
    setIsSyncingMods(true);
    showToast('Broadcasting mod resource reload to connected BeamNG clients...', 'info');
    setTimeout(() => {
      setIsSyncingMods(false);
      showToast('Client resource synchronization complete!', 'success');
      const timeStr = new Date().toLocaleTimeString();
      setConsoleLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}`,
          timestamp: timeStr,
          level: 'info',
          source: 'Server',
          message: 'Client mod cache hash recalculated. All connected clients notified of updated resources.'
        }
      ]);
    }, 1800);
  }, [showToast]);

  // Player Moderation
  const kickPlayer = useCallback(
    (playerId: string, reason: string) => {
      const p = players.find((pl) => pl.id === playerId);
      if (!p) return;

      setPlayers((prev) => prev.filter((pl) => pl.id !== playerId));

      const timeStr = new Date().toLocaleTimeString();
      setConsoleLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}`,
          timestamp: timeStr,
          level: 'warn',
          source: 'Server',
          message: `[KICK] Player "${p.name}" (${p.beammpId}) was kicked by admin. Reason: ${reason || 'No reason specified'}`
        }
      ]);
      showToast(`Kicked "${p.name}" from server`, 'warn');
    },
    [players, showToast]
  );

  const banPlayer = useCallback(
    (playerId: string, reason: string, duration: string) => {
      const p = players.find((pl) => pl.id === playerId);
      if (!p) return;

      const newBan: BanEntry = {
        id: `ban-${Date.now()}`,
        beammpId: p.beammpId,
        playerName: p.name,
        ip: p.ip,
        reason: reason || 'Violation of server rules',
        bannedBy: 'Console Admin',
        bannedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        expiresAt: duration
      };

      setBans((prev) => [newBan, ...prev]);
      setPlayers((prev) => prev.filter((pl) => pl.id !== playerId));

      const timeStr = new Date().toLocaleTimeString();
      setConsoleLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}`,
          timestamp: timeStr,
          level: 'error',
          source: 'Server',
          message: `[BAN] Player "${p.name}" (${p.beammpId}, IP: ${p.ip}) banned for ${duration}. Reason: ${newBan.reason}`
        }
      ]);
      showToast(`Banned "${p.name}" (${duration})`, 'error');
    },
    [players, showToast]
  );

  const mutePlayer = useCallback(
    (playerId: string) => {
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id === playerId) {
            const nextMuted = !p.isMuted;
            showToast(`${p.name} is now ${nextMuted ? 'muted in chat' : 'unmuted'}`, 'info');
            return { ...p, isMuted: nextMuted };
          }
          return p;
        })
      );
    },
    [showToast]
  );

  const freezePlayer = useCallback(
    (playerId: string) => {
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id === playerId) {
            const nextFrozen = !p.isFrozen;
            showToast(`${p.name} vehicle physics ${nextFrozen ? 'frozen' : 'unfrozen'}`, 'info');
            return { ...p, isFrozen: nextFrozen };
          }
          return p;
        })
      );
    },
    [showToast]
  );

  const teleportPlayer = useCallback(
    (playerId: string, targetLocation: string) => {
      const p = players.find((pl) => pl.id === playerId);
      if (!p) return;
      showToast(`Teleported ${p.name} to ${targetLocation}`, 'info');
      const timeStr = new Date().toLocaleTimeString();
      setConsoleLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}`,
          timestamp: timeStr,
          level: 'info',
          source: 'Server',
          message: `[TELEPORT] Admin teleported "${p.name}" to waypoint "${targetLocation}".`
        }
      ]);
    },
    [players, showToast]
  );

  const changePlayerRole = useCallback(
    (playerId: string, newRole: PlayerRole) => {
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id === playerId) {
            showToast(`Updated ${p.name}'s role to ${newRole}`, 'success');
            return { ...p, role: newRole };
          }
          return p;
        })
      );
    },
    [showToast]
  );

  const updateRolePermissions = useCallback((roleName: PlayerRole, updates: Partial<RolePermissions>) => {
    setRoles((prev) =>
      prev.map((r) => (r.role === roleName ? { ...r, ...updates } : r))
    );
  }, []);

  const unbanPlayer = useCallback(
    (banId: string) => {
      const b = bans.find((ban) => ban.id === banId);
      setBans((prev) => prev.filter((ban) => ban.id !== banId));
      if (b) {
        showToast(`Unbanned player ${b.playerName}`, 'info');
      }
    },
    [bans, showToast]
  );

  const addToWhitelist = useCallback(
    (playerName: string, beammpId: string, notes?: string) => {
      const newEntry: WhitelistEntry = {
        id: `wl-${Date.now()}`,
        playerName,
        beammpId,
        addedBy: 'Admin',
        addedAt: new Date().toISOString().substring(0, 10),
        notes
      };
      setWhitelist((prev) => [newEntry, ...prev]);
      showToast(`Added ${playerName} to whitelist`, 'success');
    },
    [showToast]
  );

  const removeFromWhitelist = useCallback(
    (id: string) => {
      setWhitelist((prev) => prev.filter((w) => w.id !== id));
      showToast('Removed from whitelist', 'info');
    },
    [showToast]
  );

  // Console Commands
  const executeConsoleCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim();
      if (!trimmed) return;

      const timeStr = new Date().toLocaleTimeString();
      const userLog: ConsoleLogEntry = {
        id: `log-${Date.now()}-in`,
        timestamp: timeStr,
        level: 'rcon',
        source: 'Console',
        message: `> ${trimmed}`
      };

      setConsoleLogs((prev) => [...prev, userLog]);

      // Handle common BeamMP commands
      const parts = trimmed.split(' ');
      const command = parts[0].toLowerCase().replace(/^[\/!]/, '');

      let responseText = '';
      let resLevel: ConsoleLogEntry['level'] = 'info';

      switch (command) {
        case 'help':
          responseText = `Available Commands:
- status: Display server uptime, tickrate, and connected players
- kick <player> [reason]: Disconnect a player
- ban <player> [reason]: Ban a player from joining
- say <message>: Broadcast system announcement
- reloadmods: Scan server folder and reload client resource hashes
- saveconfig: Flush ServerConfig.toml to disk
- restart: Restart the BeamMP server process
- list: List all currently connected players`;
          break;

        case 'status':
          responseText = `BeamMP Server Status:
- Version: ${activeServer.version}
- Uptime: ${Math.floor(activeServer.uptimeSeconds / 60)} minutes
- Host: ${activeServer.hostType === 'localhost' ? "User PC (Local Host)" : "Dedicated VPS Server"} (${activeServer.os})
- TickRate: ${hostMetrics.serverTickRateHz.toFixed(1)} / 60.0 Hz
- Players: ${players.length}/${serverConfig.MaxPlayers}
- Active Mods: ${mods.filter((m) => m.isEnabled).length} files`;
          break;

        case 'list':
          responseText = `Connected Players (${players.length}):\n` +
            players.map((p) => `* ${p.name} [${p.beammpId}] - Ping: ${p.ping}ms - Car: ${p.vehicle} (${p.speedKmh} km/h)`).join('\n');
          break;

        case 'say':
          const message = parts.slice(1).join(' ');
          responseText = `[Broadcast from Admin]: ${message || 'Hello racers!'}`;
          resLevel = 'chat';
          break;

        case 'reloadmods':
          responseText = `[Mod Manager] Reloading Resources directory. Found ${mods.length} files. Client caches refreshed.`;
          break;

        case 'saveconfig':
          responseText = `[Config] ServerConfig.toml written to ${activeServer.serverFolderPath}\\ServerConfig.toml.`;
          break;

        case 'restart':
          restartServer();
          return;

        default:
          if (command.startsWith('kick')) {
            const targetName = parts[1];
            const targetPlayer = players.find((p) => p.name.toLowerCase() === targetName?.toLowerCase());
            if (targetPlayer) {
              kickPlayer(targetPlayer.id, parts.slice(2).join(' ') || 'Kicked by console');
              return;
            } else {
              responseText = `Error: Player "${targetName}" not found.`;
              resLevel = 'error';
            }
          } else {
            responseText = `Unknown command "${command}". Type "help" for a list of available BeamMP commands.`;
            resLevel = 'warn';
          }
      }

      setTimeout(() => {
        setConsoleLogs((prev) => [
          ...prev,
          {
            id: `log-${Date.now()}-out`,
            timestamp: new Date().toLocaleTimeString(),
            level: resLevel,
            source: 'Server',
            message: responseText
          }
        ]);
      }, 100);
    },
    [activeServer, hostMetrics.serverTickRateHz, players, serverConfig.MaxPlayers, mods, restartServer, kickPlayer]
  );

  const clearConsole = useCallback(() => {
    setConsoleLogs([]);
    showToast('Console cleared', 'info');
  }, [showToast]);

  // Backups
  const updateBackupSchedule = useCallback(
    (updates: Partial<BackupScheduleConfig>) => {
      setBackupSchedule((prev) => {
        const next = { ...prev, ...updates };
        const nextDate = calculateNextBackupRun(next);
        next.nextBackupAt = nextDate.toISOString().replace('T', ' ').substring(0, 16);
        return next;
      });
      showToast('Backup schedule updated!', 'success');
    },
    [showToast]
  );

  const createManualSnapshot = useCallback(
    (name?: string) => {
      const snapName = name || `manual-snap-${new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19)}`;
      const totalModBytes = mods.reduce((acc, m) => acc + m.sizeBytes, 0);

      const newSnapshot: BackupSnapshot = {
        id: `bk-${Date.now()}`,
        name: snapName,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        sizeBytes: totalModBytes + 500000,
        type: 'manual',
        trigger: 'Admin Manual Snapshot',
        status: 'ready',
        modCount: mods.length,
        includesConfig: true,
        includesMods: true,
        includesPermissions: true
      };

      setBackups((prev) => [newSnapshot, ...prev]);

      const timeStr = new Date().toLocaleTimeString();
      setConsoleLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}`,
          timestamp: timeStr,
          level: 'system',
          source: 'System',
          message: `[Backup Engine] Created manual snapshot "${snapName}" (${(newSnapshot.sizeBytes / (1024 * 1024)).toFixed(1)} MB).`
        }
      ]);
      showToast(`Snapshot "${snapName}" created!`, 'success');
    },
    [mods, showToast]
  );

  const restoreBackup = useCallback(
    (id: string) => {
      const snap = backups.find((b) => b.id === id);
      if (!snap) return;

      showToast(`Restoring server from snapshot "${snap.name}"...`, 'warn');
      const timeStr = new Date().toLocaleTimeString();
      setConsoleLogs((prev) => [
        ...prev,
        {
          id: `log-${Date.now()}`,
          timestamp: timeStr,
          level: 'warn',
          source: 'Server',
          message: `[Restore Engine] Rolling back ServerConfig.toml and Resources folder to "${snap.name}". Server restarting...`
        }
      ]);

      setTimeout(() => {
        showToast(`Server successfully restored to snapshot "${snap.name}"!`, 'success');
        setConsoleLogs((prev) => [
          ...prev,
          {
            id: `log-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            level: 'info',
            source: 'Server',
            message: `[Restore Engine] Snapshot restore complete. Mod integrity hashes validated.`
          }
        ]);
      }, 2000);
    },
    [backups, showToast]
  );

  const deleteBackup = useCallback(
    (id: string) => {
      setBackups((prev) => prev.filter((b) => b.id !== id));
      showToast('Backup deleted', 'info');
    },
    [showToast]
  );

  // Host Performance toggling
  const toggleHostType = useCallback(
    (type: HostType) => {
      setServers((prev) =>
        prev.map((s) => (s.id === activeServer.id ? { ...s, hostType: type } : s))
      );
      setHostMetrics(type === 'localhost' ? INITIAL_HOST_METRICS_LOCAL : INITIAL_HOST_METRICS_REMOTE);
      showToast(`Switched performance monitoring to ${type === 'localhost' ? "User's Local PC" : "Remote Dedicated Server"}`, 'info');
    },
    [activeServer.id, showToast]
  );

  const setOperatingSystem = useCallback(
    (os: OperatingSystem) => {
      setServers((prev) =>
        prev.map((s) => (s.id === activeServer.id ? { ...s, os } : s))
      );
      setHostMetrics((prev) => ({ ...prev, os }));
      showToast(`Server OS profile set to ${os.toUpperCase()}`, 'info');
    },
    [activeServer.id, showToast]
  );

  // Live simulation of metrics
  useEffect(() => {
    const interval = setInterval(() => {
      setHostMetrics((prev) => {
        // Fluctuate CPU slightly
        const jitter = (Math.random() - 0.5) * 4;
        const newCpu = Math.min(98, Math.max(12, prev.cpuTotalPercent + jitter));

        // Fluctuate tickrate slightly around target
        const tickJitter = (Math.random() - 0.5) * 0.4;
        const newTick = Math.min(60.1, Math.max(58.5, prev.serverTickRateHz + tickJitter));

        // Fluctuate cores
        const updatedCores = prev.cpuCores.map((c) => ({
          ...c,
          usagePercent: Math.min(100, Math.max(10, c.usagePercent + (Math.random() - 0.5) * 6))
        }));

        const isLocal = prev.hostType === 'localhost';
        const ramUsedPercent = (prev.ramUsedBytes / prev.ramTotalBytes) * 100;

        const advice = analyzeHostPerformance({
          cpuTotalPercent: newCpu,
          ramUsedPercent,
          playerCount: players.length,
          activeModsCount: mods.filter((m) => m.isEnabled).length,
          isLocalHost: isLocal,
          tickRate: newTick,
          highPhysicsCoreUsage: updatedCores[0]?.usagePercent > 75
        });

        return {
          ...prev,
          cpuTotalPercent: parseFloat(newCpu.toFixed(1)),
          serverTickRateHz: parseFloat(newTick.toFixed(1)),
          cpuCores: updatedCores,
          networkInKbps: Math.floor(400 + players.length * 80 + Math.random() * 50),
          networkOutKbps: Math.floor(1500 + players.length * 320 + Math.random() * 200),
          recommendations: advice
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [players.length, mods]);

  // Server config updates
  const updateServerConfig = useCallback((updates: Partial<ServerConfigToml>) => {
    setServerConfig((prev) => ({ ...prev, ...updates }));
  }, []);

  const saveServerConfigToml = useCallback(() => {
    const serialized = serializeServerConfigToml(serverConfig);
    showToast('Saved ServerConfig.toml successfully!', 'success');
    const timeStr = new Date().toLocaleTimeString();
    setConsoleLogs((prev) => [
      ...prev,
      {
        id: `log-${Date.now()}`,
        timestamp: timeStr,
        level: 'info',
        source: 'Server',
        message: `[Config Manager] Configuration updated. Map: ${serverConfig.Map}, MaxPlayers: ${serverConfig.MaxPlayers}, TickRate: ${serverConfig.TickRate}Hz.`
      }
    ]);
  }, [serverConfig, showToast]);

  // Accessibility update
  const updateAccessibility = useCallback((updates: Partial<AccessibilitySettings>) => {
    setAccessibility((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <ServerContext.Provider
      value={{
        servers,
        activeServer,
        setActiveServerId,
        connectNewServer,
        updateServerStatus,
        restartServer,
        stopServer,
        startServer,

        mods,
        addMod,
        toggleModEnabled,
        removeMod,
        installPopularMod,
        isSyncingMods,
        triggerClientModSync,

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
        removeFromWhitelist,

        consoleLogs,
        executeConsoleCommand,
        clearConsole,
        logFilter,
        setLogFilter,

        backups,
        backupSchedule,
        updateBackupSchedule,
        createManualSnapshot,
        restoreBackup,
        deleteBackup,

        hostMetrics,
        toggleHostType,
        setOperatingSystem,

        serverConfig,
        updateServerConfig,
        saveServerConfigToml,

        accessibility,
        updateAccessibility,

        toastMessage,
        showToast
      }}
    >
      {children}
    </ServerContext.Provider>
  );
};

export const useServer = () => {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error('useServer must be used within a ServerProvider');
  }
  return context;
};

export type HostType = 'localhost' | 'remote_server';
export type OperatingSystem = 'windows' | 'linux' | 'macos';
export type ServerStatus = 'online' | 'offline' | 'restarting' | 'error';
export type PlayerRole = 'owner' | 'admin' | 'moderator' | 'vip' | 'player' | 'guest';
export type ModCategory = 'vehicle' | 'map' | 'plugin' | 'script' | 'ui';
export type LogLevel = 'info' | 'warn' | 'error' | 'chat' | 'rcon' | 'system';
export type BackupFrequency = 'hourly' | 'daily' | 'weekly';

export interface ServerConnectionConfig {
  id: string;
  name: string;
  host: string;
  port: number;
  authKey: string;
  rconPassword?: string;
  hostType: HostType;
  os: OperatingSystem;
  serverFolderPath: string;
  status: ServerStatus;
  uptimeSeconds: number;
  lastPingMs: number;
  version: string;
}

export interface ModItem {
  id: string;
  filename: string;
  name: string;
  category: ModCategory;
  sizeBytes: number;
  isEnabled: boolean;
  hash: string;
  author?: string;
  version?: string;
  description?: string;
  uploadedAt: string;
  clientSyncCount: number;
}

export interface Player {
  id: string;
  name: string;
  beammpId: string;
  ip: string;
  ping: number;
  joinedAt: string;
  vehicle: string;
  speedKmh: number;
  role: PlayerRole;
  isMuted: boolean;
  isFrozen: boolean;
  spawnedVehiclesCount: number;
}

export interface RolePermissions {
  role: PlayerRole;
  displayName: string;
  badgeColor: string;
  canAccessConsole: boolean;
  canUploadMods: boolean;
  canDeleteMods: boolean;
  canEditConfig: boolean;
  canKickBan: boolean;
  canTeleport: boolean;
  canSlowMotion: boolean;
  maxSpawnedVehicles: number;
  immuneToKick: boolean;
}

export interface BanEntry {
  id: string;
  beammpId: string;
  playerName: string;
  ip: string;
  reason: string;
  bannedBy: string;
  bannedAt: string;
  expiresAt: string | 'Permanent';
}

export interface WhitelistEntry {
  id: string;
  beammpId: string;
  playerName: string;
  addedBy: string;
  addedAt: string;
  notes?: string;
}

export interface ConsoleLogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: 'Server' | 'Console' | 'RCON' | 'Player' | 'System';
  message: string;
}

export interface BackupSnapshot {
  id: string;
  name: string;
  timestamp: string;
  sizeBytes: number;
  type: 'hourly' | 'daily' | 'weekly' | 'manual';
  trigger: string;
  status: 'ready' | 'restoring' | 'creating';
  modCount: number;
  includesConfig: boolean;
  includesMods: boolean;
  includesPermissions: boolean;
}

export interface BackupScheduleConfig {
  enabled: boolean;
  frequency: BackupFrequency;
  timeOfDay: string; // "04:00"
  maxRetention: number;
  includeMods: boolean;
  includeConfig: boolean;
  includePermissions: boolean;
  lastBackupAt?: string;
  nextBackupAt?: string;
}

export interface CpuCoreMetric {
  coreId: number;
  usagePercent: number;
  isPhysicsThread: boolean;
}

export interface HostPerformanceMetrics {
  hostType: HostType;
  os: OperatingSystem;
  cpuTotalPercent: number;
  cpuCores: CpuCoreMetric[];
  ramUsedBytes: number;
  ramTotalBytes: number;
  serverTickRateHz: number;
  targetTickRateHz: number;
  physicsTickRateHz: number;
  networkInKbps: number;
  networkOutKbps: number;
  diskUsedGb: number;
  diskTotalGb: number;
  temperatureC: number;
  systemModel: string;
  recommendations: string[];
}

export interface ServerConfigToml {
  Name: string;
  Description: string;
  Map: string;
  MaxPlayers: number;
  MaxCars: number;
  Port: number;
  AuthKey: string;
  Private: boolean;
  Debug: boolean;
  LogChat: boolean;
  ResourceFolder: string;
  TickRate: number;
}

export type ThemeId = 'beam-orange' | 'midnight-cyber' | 'contrast-dark' | 'contrast-light' | 'colorblind-safe';

export interface AccessibilitySettings {
  theme: ThemeId;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  reducedMotion: boolean;
  highContrast: boolean;
  soundAlerts: boolean;
}

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
  AccessibilitySettings
} from '../types/beammp';

export const INITIAL_SERVERS: ServerConnectionConfig[] = [
  {
    id: 'srv-local-01',
    name: 'My Rig - West Coast Drift & Cruise',
    host: '127.0.0.1',
    port: 30814,
    authKey: 'bmp_live_8f7b2c9e10a45d6e',
    rconPassword: 'admin_beam_local',
    hostType: 'localhost',
    os: 'windows',
    serverFolderPath: 'C:\\BeamMP-Server',
    status: 'online',
    uptimeSeconds: 14520,
    lastPingMs: 2,
    version: 'v3.4.1 (Build 824)'
  },
  {
    id: 'srv-remote-02',
    name: 'Apex Dedicated EU - Nordschleife Track Day',
    host: '198.51.100.42',
    port: 30814,
    authKey: 'bmp_live_a1b2c3d4e5f60718',
    rconPassword: 'eu_rcon_secure_99',
    hostType: 'remote_server',
    os: 'linux',
    serverFolderPath: '/opt/beammp',
    status: 'online',
    uptimeSeconds: 182400,
    lastPingMs: 28,
    version: 'v3.4.1 (Build 824)'
  }
];

export const INITIAL_SERVER_CONFIG: ServerConfigToml = {
  Name: 'My Rig - West Coast Drift & Cruise [BeamDeck]',
  Description: 'High performance cruise & drift server with custom JDM & Muscle mods. Owned by chickenisgone.',
  Map: '/levels/west_coast_usa/info.json',
  MaxPlayers: 10,
  MaxCars: 2,
  Port: 30814,
  AuthKey: 'bmp_live_8f7b2c9e10a45d6e',
  Private: false,
  Debug: false,
  LogChat: true,
  ResourceFolder: 'Resources',
  TickRate: 60
};

export const INITIAL_MODS: ModItem[] = [
  {
    id: 'mod-1',
    filename: 'gavril_vertex_v6_turbo.zip',
    name: 'Gavril Vertex Turbo Edition',
    category: 'vehicle',
    sizeBytes: 48 * 1024 * 1024,
    isEnabled: true,
    hash: 'e8b9f1a20cd49f3e4b11',
    author: 'InertiaMods',
    version: '2.4.1',
    description: 'Custom sports sedan with twin-turbo V6 engine and track-tuned suspension.',
    uploadedAt: '2026-11-08 14:22',
    clientSyncCount: 142
  },
  {
    id: 'mod-2',
    filename: 'ibishu_200bx_drift_spec.zip',
    name: 'Ibishu 200BX Pro Drift Spec',
    category: 'vehicle',
    sizeBytes: 32 * 1024 * 1024,
    isEnabled: true,
    hash: 'a3d4f8b912e76c04f99a',
    author: 'DriftKing99',
    version: '1.8.0',
    description: 'Welded diff, hydraulic e-brake, angle kit, and custom liveries.',
    uploadedAt: '2026-11-07 19:10',
    clientSyncCount: 189
  },
  {
    id: 'mod-3',
    filename: 'fujigoko_touge_drift_pass.zip',
    name: 'Mount Fujigoko Touge Mountain',
    category: 'map',
    sizeBytes: 185 * 1024 * 1024,
    isEnabled: true,
    hash: '90cf83b14a275e6d012e',
    author: 'TougeProject',
    version: '3.1.0',
    description: '14km winding downhill touge with high fidelity asphalt physics.',
    uploadedAt: '2026-11-05 10:45',
    clientSyncCount: 96
  },
  {
    id: 'mod-4',
    filename: 'beammp_cobalt_anticheat.lua',
    name: 'Cobalt Node-Grabber Anti-Exploit',
    category: 'plugin',
    sizeBytes: 28 * 1024,
    isEnabled: true,
    hash: '33e14a7802b9cdfa5198',
    author: 'BeamMP Core Contributors',
    version: '4.2.0',
    description: 'Server-side Lua plugin preventing unauthorized node-grabbing and speed manipulation.',
    uploadedAt: '2026-11-01 08:00',
    clientSyncCount: 310
  },
  {
    id: 'mod-5',
    filename: 'drift_telemetry_ui_app.zip',
    name: 'Live Drift Angle & Speed HUD',
    category: 'ui',
    sizeBytes: 4 * 1024 * 1024,
    isEnabled: true,
    hash: '55da08b1f237ce8100ab',
    author: 'BeamAppDev',
    version: '1.2.3',
    description: 'In-game UI overlay showing drift angle, combo multiplier, and exit velocity.',
    uploadedAt: '2026-11-06 16:30',
    clientSyncCount: 164
  },
  {
    id: 'mod-6',
    filename: 'hirochi_sbr4_gt3_cup.zip',
    name: 'Hirochi SBR4 GT3 Cup Car',
    category: 'vehicle',
    sizeBytes: 52 * 1024 * 1024,
    isEnabled: false,
    hash: 'bb781e990ad34fc81211',
    author: 'MotorsportSims',
    version: '2.0.0',
    description: 'Full carbon fiber GT3 aerodynamic kit, slick tires, sequential gearbox.',
    uploadedAt: '2026-11-04 12:15',
    clientSyncCount: 54
  }
];

export const INITIAL_PLAYERS: Player[] = [
  {
    id: 'p-1',
    name: 'TurboDrifter_99',
    beammpId: 'BMP-98214',
    ip: '192.168.1.104',
    ping: 18,
    joinedAt: '32 mins ago',
    vehicle: 'Ibishu 200BX Pro Drift Spec',
    speedKmh: 124,
    role: 'owner',
    isMuted: false,
    isFrozen: false,
    spawnedVehiclesCount: 1
  },
  {
    id: 'p-2',
    name: 'ApexCorner88',
    beammpId: 'BMP-44102',
    ip: '82.165.90.12',
    ping: 34,
    joinedAt: '18 mins ago',
    vehicle: 'Gavril Vertex Turbo Edition',
    speedKmh: 182,
    role: 'admin',
    isMuted: false,
    isFrozen: false,
    spawnedVehiclesCount: 2
  },
  {
    id: 'p-3',
    name: 'V8_Cruiser_Sam',
    beammpId: 'BMP-71932',
    ip: '104.28.19.45',
    ping: 48,
    joinedAt: '12 mins ago',
    vehicle: 'Gavril Barstow V8 Supercharged',
    speedKmh: 95,
    role: 'player',
    isMuted: false,
    isFrozen: false,
    spawnedVehiclesCount: 1
  },
  {
    id: 'p-4',
    name: 'BruckellFan_x',
    beammpId: 'BMP-15099',
    ip: '172.56.21.80',
    ping: 62,
    joinedAt: '5 mins ago',
    vehicle: 'Bruckell Bastion Redtail',
    speedKmh: 0,
    role: 'vip',
    isMuted: false,
    isFrozen: false,
    spawnedVehiclesCount: 1
  },
  {
    id: 'p-5',
    name: 'CrashTestDummy_0',
    beammpId: 'BMP-63201',
    ip: '185.220.101.5',
    ping: 110,
    joinedAt: '2 mins ago',
    vehicle: 'Ibishu Pigeon 3-Wheeled',
    speedKmh: 42,
    role: 'guest',
    isMuted: false,
    isFrozen: false,
    spawnedVehiclesCount: 1
  }
];

export const INITIAL_ROLES: RolePermissions[] = [
  {
    role: 'owner',
    displayName: 'Server Owner',
    badgeColor: '#F97316', // Orange
    canAccessConsole: true,
    canUploadMods: true,
    canDeleteMods: true,
    canEditConfig: true,
    canKickBan: true,
    canTeleport: true,
    canSlowMotion: true,
    maxSpawnedVehicles: 5,
    immuneToKick: true
  },
  {
    role: 'admin',
    displayName: 'Administrator',
    badgeColor: '#EF4444', // Red
    canAccessConsole: true,
    canUploadMods: true,
    canDeleteMods: true,
    canEditConfig: true,
    canKickBan: true,
    canTeleport: true,
    canSlowMotion: false,
    maxSpawnedVehicles: 3,
    immuneToKick: true
  },
  {
    role: 'moderator',
    displayName: 'Moderator',
    badgeColor: '#3B82F6', // Blue
    canAccessConsole: false,
    canUploadMods: false,
    canDeleteMods: false,
    canEditConfig: false,
    canKickBan: true,
    canTeleport: true,
    canSlowMotion: false,
    maxSpawnedVehicles: 2,
    immuneToKick: false
  },
  {
    role: 'vip',
    displayName: 'VIP Supporter',
    badgeColor: '#8B5CF6', // Purple
    canAccessConsole: false,
    canUploadMods: false,
    canDeleteMods: false,
    canEditConfig: false,
    canKickBan: false,
    canTeleport: true,
    canSlowMotion: false,
    maxSpawnedVehicles: 2,
    immuneToKick: false
  },
  {
    role: 'player',
    displayName: 'Registered Player',
    badgeColor: '#10B981', // Green
    canAccessConsole: false,
    canUploadMods: false,
    canDeleteMods: false,
    canEditConfig: false,
    canKickBan: false,
    canTeleport: false,
    canSlowMotion: false,
    maxSpawnedVehicles: 1,
    immuneToKick: false
  },
  {
    role: 'guest',
    displayName: 'Guest / Unverified',
    badgeColor: '#6B7280', // Gray
    canAccessConsole: false,
    canUploadMods: false,
    canDeleteMods: false,
    canEditConfig: false,
    canKickBan: false,
    canTeleport: false,
    canSlowMotion: false,
    maxSpawnedVehicles: 1,
    immuneToKick: false
  }
];

export const INITIAL_BANS: BanEntry[] = [
  {
    id: 'ban-1',
    beammpId: 'BMP-00912',
    playerName: 'RammerTroll_X',
    ip: '194.26.29.11',
    reason: 'Intentional head-on ramming at 250 km/h in pitlane',
    bannedBy: 'ApexCorner88',
    bannedAt: '2026-11-08 19:45',
    expiresAt: '2026-11-15 19:45 (7 Days)'
  },
  {
    id: 'ban-2',
    beammpId: 'BMP-88201',
    playerName: 'LagSwitchUser',
    ip: '45.154.255.8',
    reason: 'Packet flood and artificial tick de-sync',
    bannedBy: 'TurboDrifter_99',
    bannedAt: '2026-11-04 11:20',
    expiresAt: 'Permanent'
  }
];

export const INITIAL_WHITELIST: WhitelistEntry[] = [
  {
    id: 'wl-1',
    beammpId: 'BMP-98214',
    playerName: 'TurboDrifter_99',
    addedBy: 'System',
    addedAt: '2026-11-01',
    notes: 'Server Owner'
  },
  {
    id: 'wl-2',
    beammpId: 'BMP-44102',
    playerName: 'ApexCorner88',
    addedBy: 'TurboDrifter_99',
    addedAt: '2026-11-02',
    notes: 'Co-Host Admin'
  },
  {
    id: 'wl-3',
    beammpId: 'BMP-15099',
    playerName: 'BruckellFan_x',
    addedBy: 'ApexCorner88',
    addedAt: '2026-11-06',
    notes: 'Discord Verified'
  }
];

export const INITIAL_CONSOLE_LOGS: ConsoleLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '11:45:02',
    level: 'info',
    source: 'Server',
    message: 'BeamMP Server v3.4.1 (Build 824) initializing on 0.0.0.0:30814'
  },
  {
    id: 'log-2',
    timestamp: '11:45:03',
    level: 'info',
    source: 'Server',
    message: 'Authenticating server token with official BeamMP master server...'
  },
  {
    id: 'log-3',
    timestamp: '11:45:04',
    level: 'info',
    source: 'Server',
    message: 'AuthKey verified. Registered as "My Rig - West Coast Drift & Cruise".'
  },
  {
    id: 'log-4',
    timestamp: '11:45:05',
    level: 'info',
    source: 'Server',
    message: 'Loaded 5 client resource mods from C:\\BeamMP-Server\\Resources\\Client (321.4 MB total)'
  },
  {
    id: 'log-5',
    timestamp: '11:45:05',
    level: 'info',
    source: 'Server',
    message: 'Server physics clock synchronized. TickRate locked at 60 Hz.'
  },
  {
    id: 'log-6',
    timestamp: '11:48:19',
    level: 'info',
    source: 'Player',
    message: 'Player "TurboDrifter_99" (BMP-98214) connected from 192.168.1.104 [Ping: 18ms]'
  },
  {
    id: 'log-7',
    timestamp: '11:49:02',
    level: 'info',
    source: 'Player',
    message: 'TurboDrifter_99 spawned vehicle "Ibishu 200BX Pro Drift Spec" (Config: Drift_Tuned)'
  },
  {
    id: 'log-8',
    timestamp: '11:51:30',
    level: 'info',
    source: 'Player',
    message: 'Player "ApexCorner88" (BMP-44102) connected [Ping: 34ms]'
  },
  {
    id: 'log-9',
    timestamp: '11:52:10',
    level: 'chat',
    source: 'Player',
    message: '<TurboDrifter_99> Welcome to the server! Heading over to the highway loop.'
  },
  {
    id: 'log-10',
    timestamp: '11:52:25',
    level: 'chat',
    source: 'Player',
    message: '<ApexCorner88> Copy that, testing the new Vertex turbo spool.'
  },
  {
    id: 'log-11',
    timestamp: '11:54:12',
    level: 'warn',
    source: 'Server',
    message: 'High vehicle network sync delta (82ms) from 185.220.101.5. Throttling non-critical physics frames.'
  },
  {
    id: 'log-12',
    timestamp: '11:55:00',
    level: 'system',
    source: 'System',
    message: '[BeamDeck Scheduler] Automatic hourly snapshot snapshot-2026-11-09-1100 created (321.8 MB).'
  }
];

export const INITIAL_BACKUPS: BackupSnapshot[] = [
  {
    id: 'bk-1',
    name: 'auto-hourly-2026-11-09-1100',
    timestamp: '2026-11-09 11:00:00',
    sizeBytes: 321800000,
    type: 'hourly',
    trigger: 'Automated Hourly Schedule',
    status: 'ready',
    modCount: 5,
    includesConfig: true,
    includesMods: true,
    includesPermissions: true
  },
  {
    id: 'bk-2',
    name: 'auto-daily-2026-11-09-0400',
    timestamp: '2026-11-09 04:00:00',
    sizeBytes: 321500000,
    type: 'daily',
    trigger: 'Daily Maintenance Schedule',
    status: 'ready',
    modCount: 5,
    includesConfig: true,
    includesMods: true,
    includesPermissions: true
  },
  {
    id: 'bk-3',
    name: 'pre-fujigoko-touge-install',
    timestamp: '2026-11-08 18:30:15',
    sizeBytes: 136200000,
    type: 'manual',
    trigger: 'Manual Admin Snapshot',
    status: 'ready',
    modCount: 4,
    includesConfig: true,
    includesMods: true,
    includesPermissions: true
  }
];

export const INITIAL_BACKUP_SCHEDULE: BackupScheduleConfig = {
  enabled: true,
  frequency: 'daily',
  timeOfDay: '04:00',
  maxRetention: 10,
  includeMods: true,
  includeConfig: true,
  includePermissions: true,
  lastBackupAt: '2026-11-09 11:00',
  nextBackupAt: '2026-11-10 04:00'
};

export const INITIAL_HOST_METRICS_LOCAL: HostPerformanceMetrics = {
  hostType: 'localhost',
  os: 'windows',
  cpuTotalPercent: 44.5,
  cpuCores: [
    { coreId: 0, usagePercent: 78.2, isPhysicsThread: true }, // Main physics thread
    { coreId: 1, usagePercent: 62.4, isPhysicsThread: true }, // Secondary vehicle physics
    { coreId: 2, usagePercent: 45.1, isPhysicsThread: false }, // BeamMP networking
    { coreId: 3, usagePercent: 38.0, isPhysicsThread: false },
    { coreId: 4, usagePercent: 42.6, isPhysicsThread: false },
    { coreId: 5, usagePercent: 33.1, isPhysicsThread: false },
    { coreId: 6, usagePercent: 28.5, isPhysicsThread: false },
    { coreId: 7, usagePercent: 26.2, isPhysicsThread: false }
  ],
  ramUsedBytes: 14.8 * 1024 * 1024 * 1024,
  ramTotalBytes: 32 * 1024 * 1024 * 1024,
  serverTickRateHz: 59.9,
  targetTickRateHz: 60,
  physicsTickRateHz: 2000,
  networkInKbps: 450,
  networkOutKbps: 1820,
  diskUsedGb: 482,
  diskTotalGb: 1000,
  temperatureC: 64,
  systemModel: 'AMD Ryzen 7 7800X3D (User PC - Local Host)',
  recommendations: [
    'Local Host Mode Active: CPU Core 0 is currently processing primary BeamNG soft-body physics.',
    'System RAM headroom is healthy (17.2 GB available). Up to 12 simultaneous players supported.',
    'Bandwidth upload utilization at 14% of typical 100 Mbps broadband connection.'
  ]
};

export const INITIAL_HOST_METRICS_REMOTE: HostPerformanceMetrics = {
  hostType: 'remote_server',
  os: 'linux',
  cpuTotalPercent: 22.8,
  cpuCores: [
    { coreId: 0, usagePercent: 32.1, isPhysicsThread: false },
    { coreId: 1, usagePercent: 28.4, isPhysicsThread: false },
    { coreId: 2, usagePercent: 18.2, isPhysicsThread: false },
    { coreId: 3, usagePercent: 12.5, isPhysicsThread: false }
  ],
  ramUsedBytes: 3.2 * 1024 * 1024 * 1024,
  ramTotalBytes: 16 * 1024 * 1024 * 1024,
  serverTickRateHz: 60.0,
  targetTickRateHz: 60,
  physicsTickRateHz: 2000,
  networkInKbps: 1250,
  networkOutKbps: 5800,
  diskUsedGb: 38,
  diskTotalGb: 200,
  temperatureC: 48,
  systemModel: 'Dedicated Cloud VPS (4 vCPU / 16GB ECC / 1Gbps Uplink - Frankfurt)',
  recommendations: [
    'Dedicated Server Mode: Linux process isolation active. Zero gaming client contention.',
    'Network uplink headroom is > 95%. Can safely enable 20+ player capacity.',
    'Tickrate standard deviation is < 0.2 Hz (Rock-solid performance).'
  ]
};

export const MAP_PRESETS = [
  { id: '/levels/west_coast_usa/info.json', name: 'West Coast, USA', type: 'City / Highway', size: 'Large' },
  { id: '/levels/gridmap_v2/info.json', name: 'Gridmap v2', type: 'Testing & Physics Sandbox', size: 'Medium' },
  { id: '/levels/italy/info.json', name: 'Italy', type: 'Scenic Countryside & Coastal', size: 'Very Large' },
  { id: '/levels/east_coast_usa/info.json', name: 'East Coast, USA', type: 'Rural Towns & Roads', size: 'Large' },
  { id: '/levels/utah/info.json', name: 'Utah', type: 'Canyon & Off-road Desert', size: 'Large' },
  { id: '/levels/automation_test_track/info.json', name: 'Automation Test Track', type: 'Formula & Handling Circuit', size: 'Medium' },
  { id: '/levels/industrial/info.json', name: 'Industrial Site', type: 'Drift & Demolition Yards', size: 'Small' },
  { id: '/levels/small_island/info.json', name: 'Small Island', type: 'Rally & Dirt Tracks', size: 'Small' },
  { id: '/levels/jungle_rock_island/info.json', name: 'Jungle Rock Island', type: 'Mountain & Tropical Trails', size: 'Large' }
];

export const POPULAR_MOD_PRESETS = [
  {
    name: 'Bruckell Moonhawk Drag Strip Edition',
    filename: 'bruckell_moonhawk_drag.zip',
    category: 'vehicle' as const,
    sizeBytes: 38 * 1024 * 1024,
    description: 'Wheelie bars, parachute, twin supercharged 502 V8 pushing 2400hp.'
  },
  {
    name: 'BeamMP Cobalt Voice & Proximity Chat',
    filename: 'cobalt_proximity_voice.lua',
    category: 'plugin' as const,
    sizeBytes: 35 * 1024,
    description: '3D spatial directional proximity voice chat plugin for BeamMP servers.'
  },
  {
    name: 'Nordschleife Nürburgring Laser Scan',
    filename: 'nordschleife_tourist_layout.zip',
    category: 'map' as const,
    sizeBytes: 245 * 1024 * 1024,
    description: 'Laser-scanned 20.8 km green hell circuit with pitlane speed limits.'
  },
  {
    name: 'Speed Trap & Radar Enforcement Plugin',
    filename: 'server_speedtrap_enforcer.lua',
    category: 'plugin' as const,
    sizeBytes: 22 * 1024,
    description: 'Logs top speed runs, announces records in server chat, warns speeders.'
  }
];

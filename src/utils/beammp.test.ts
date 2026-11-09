import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatBytes,
  parseServerConfigToml,
  serializeServerConfigToml,
  validateModFile,
  analyzeHostPerformance,
  checkPermission,
  calculateNextBackupRun,
  generateOsStartupScript
} from './beammp';
import { RolePermissions, ServerConfigToml, BackupScheduleConfig } from '../types/beammp';

test('formatBytes formats file sizes correctly', () => {
  assert.equal(formatBytes(0), '0 B');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(1024 * 1024 * 4.5), '4.5 MB');
  assert.equal(formatBytes(1024 * 1024 * 1024 * 2), '2 GB');
});

test('parseServerConfigToml parses standard BeamMP toml fields', () => {
  const sampleToml = `
[General]
Name = "Official West Coast Drift"
Description = "Custom Gavril & Ibishu builds"
Map = "/levels/west_coast_usa/info.json"
MaxPlayers = 10
MaxCars = 2
Port = 30814
AuthKey = "my-secret-key-123"
Private = false
Debug = true
LogChat = true
ResourceFolder = "Resources"
TickRate = 60
`;

  const parsed = parseServerConfigToml(sampleToml);
  assert.equal(parsed.Name, 'Official West Coast Drift');
  assert.equal(parsed.Description, 'Custom Gavril & Ibishu builds');
  assert.equal(parsed.Map, '/levels/west_coast_usa/info.json');
  assert.equal(parsed.MaxPlayers, 10);
  assert.equal(parsed.MaxCars, 2);
  assert.equal(parsed.Port, 30814);
  assert.equal(parsed.AuthKey, 'my-secret-key-123');
  assert.equal(parsed.Private, false);
  assert.equal(parsed.Debug, true);
  assert.equal(parsed.TickRate, 60);
});

test('serializeServerConfigToml produces valid BeamMP toml format', () => {
  const config: ServerConfigToml = {
    Name: 'Apex BeamMP Server',
    Description: 'Physics playground',
    Map: '/levels/gridmap_v2/info.json',
    MaxPlayers: 8,
    MaxCars: 1,
    Port: 30814,
    AuthKey: 'apex-key-456',
    Private: true,
    Debug: false,
    LogChat: true,
    ResourceFolder: 'Resources',
    TickRate: 60
  };

  const toml = serializeServerConfigToml(config);
  assert.ok(toml.includes('Name = "Apex BeamMP Server"'));
  assert.ok(toml.includes('Port = 30814'));
  assert.ok(toml.includes('Private = true'));
  assert.ok(toml.includes('MaxPlayers = 8'));

  // Round-trip verification
  const roundTrip = parseServerConfigToml(toml);
  assert.equal(roundTrip.Name, config.Name);
  assert.equal(roundTrip.Port, config.Port);
  assert.equal(roundTrip.Private, true);
});

test('validateModFile correctly detects categories and validates zip/lua', () => {
  // Vehicle zip
  const vResult = validateModFile('gavril_vertex_turbo.zip', 45 * 1024 * 1024);
  assert.equal(vResult.valid, true);
  assert.equal(vResult.category, 'vehicle');
  assert.equal(vResult.name, 'Gavril Vertex Turbo');

  // Map zip
  const mResult = validateModFile('mount_akina_drift_track.zip', 120 * 1024 * 1024);
  assert.equal(mResult.valid, true);
  assert.equal(mResult.category, 'map');

  // Plugin lua
  const pResult = validateModFile('cobalt_auto_restart.lua', 12 * 1024);
  assert.equal(pResult.valid, true);
  assert.equal(pResult.category, 'plugin');

  // Invalid file type
  const badResult = validateModFile('malicious_executable.exe', 5000);
  assert.equal(badResult.valid, false);
  assert.ok(badResult.error?.includes('.zip client resources or .lua'));

  // Oversized mod (> 750MB)
  const hugeResult = validateModFile('giant_map.zip', 800 * 1024 * 1024);
  assert.equal(hugeResult.valid, false);
  assert.ok(hugeResult.error?.includes('exceeds maximum recommended size'));
});

test('analyzeHostPerformance gives specific advice for local PC vs dedicated server', () => {
  // Local host with high CPU
  const localAdvice = analyzeHostPerformance({
    cpuTotalPercent: 88,
    ramUsedPercent: 90,
    playerCount: 6,
    activeModsCount: 18,
    isLocalHost: true,
    tickRate: 49.5,
    highPhysicsCoreUsage: true
  });

  assert.ok(localAdvice.some((a) => a.includes('Local PC Host Mode')));
  assert.ok(localAdvice.some((a) => a.includes('Critical CPU Load')));
  assert.ok(localAdvice.some((a) => a.includes('High RAM Allocation')));
  assert.ok(localAdvice.some((a) => a.includes('Core 0/1 Physics Spike')));
  assert.ok(localAdvice.some((a) => a.includes('High Mod Count')));
  assert.ok(localAdvice.some((a) => a.includes('Tickrate Warning')));

  // Dedicated server optimal
  const remoteAdvice = analyzeHostPerformance({
    cpuTotalPercent: 35,
    ramUsedPercent: 40,
    playerCount: 12,
    activeModsCount: 5,
    isLocalHost: false,
    tickRate: 60.0
  });

  assert.ok(remoteAdvice.some((a) => a.includes('Dedicated Server Mode')));
  assert.ok(remoteAdvice.some((a) => a.includes('Tickrate Optimal')));
});

test('checkPermission handles role capabilities properly', () => {
  const adminRole: RolePermissions = {
    role: 'admin',
    displayName: 'Administrator',
    badgeColor: '#EF4444',
    canAccessConsole: true,
    canUploadMods: true,
    canDeleteMods: true,
    canEditConfig: true,
    canKickBan: true,
    canTeleport: true,
    canSlowMotion: false,
    maxSpawnedVehicles: 3,
    immuneToKick: true
  };

  const guestRole: RolePermissions = {
    role: 'guest',
    displayName: 'Guest Player',
    badgeColor: '#9CA3AF',
    canAccessConsole: false,
    canUploadMods: false,
    canDeleteMods: false,
    canEditConfig: false,
    canKickBan: false,
    canTeleport: false,
    canSlowMotion: false,
    maxSpawnedVehicles: 1,
    immuneToKick: false
  };

  assert.equal(checkPermission(adminRole, 'console'), true);
  assert.equal(checkPermission(adminRole, 'upload_mod'), true);
  assert.equal(checkPermission(adminRole, 'kick_ban'), true);

  assert.equal(checkPermission(guestRole, 'console'), false);
  assert.equal(checkPermission(guestRole, 'upload_mod'), false);
  assert.equal(checkPermission(guestRole, 'edit_config'), false);
});

test('calculateNextBackupRun calculates hourly and daily schedules', () => {
  const schedule: BackupScheduleConfig = {
    enabled: true,
    frequency: 'hourly',
    timeOfDay: '04:00',
    maxRetention: 10,
    includeMods: true,
    includeConfig: true,
    includePermissions: true
  };

  const ref = new Date('2026-11-09T12:00:00Z');
  const nextHourly = calculateNextBackupRun(schedule, ref);
  assert.ok(nextHourly.getTime() > ref.getTime());

  schedule.frequency = 'daily';
  const nextDaily = calculateNextBackupRun(schedule, ref);
  assert.ok(nextDaily.getTime() > ref.getTime());
});

test('generateOsStartupScript outputs cross-platform scripts', () => {
  const win = generateOsStartupScript('windows', 'C:\\BeamMP-Server', 30814);
  assert.equal(win.filename, 'run_beammp_server.bat');
  assert.ok(win.content.includes('netsh advfirewall'));
  assert.ok(win.content.includes('BeamMPServer.exe'));

  const linux = generateOsStartupScript('linux', '/opt/beammp', 30814);
  assert.equal(linux.filename, 'beammp.service');
  assert.ok(linux.content.includes('WorkingDirectory=/opt/beammp'));

  const mac = generateOsStartupScript('macos', '~/BeamMP-Server', 30814);
  assert.equal(mac.filename, 'start_beammp.command');
  assert.ok(mac.content.includes('chmod +x ./BeamMP-Server'));
});

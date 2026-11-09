import React, { useState } from 'react';
import { useServer } from '../context/ServerContext';
import { MAP_PRESETS } from '../data/initialData';
import { parseServerConfigToml, serializeServerConfigToml } from '../utils/beammp';
import {
  FileCode,
  Save,
  RotateCcw,
  Sliders,
  CheckCircle,
  ExternalLink,
  MapPin,
  Lock,
  Globe,
  SlidersHorizontal,
  Code
} from 'lucide-react';

export const ConfigEditor: React.FC = () => {
  const { serverConfig, updateServerConfig, saveServerConfigToml, activeServer } = useServer();

  const [mode, setMode] = useState<'visual' | 'raw'>('visual');
  const [rawToml, setRawToml] = useState(serializeServerConfigToml(serverConfig));
  const [parseError, setParseError] = useState<string | null>(null);

  const handleVisualChange = (field: string, value: any) => {
    updateServerConfig({ [field]: value });
  };

  const handleSwitchToRaw = () => {
    setRawToml(serializeServerConfigToml(serverConfig));
    setParseError(null);
    setMode('raw');
  };

  const handleSaveRaw = () => {
    try {
      const parsed = parseServerConfigToml(rawToml);
      if (!parsed.Name || !parsed.Port) {
        setParseError('Parsed TOML is missing critical fields (Name or Port).');
        return;
      }
      updateServerConfig(parsed);
      saveServerConfigToml();
      setParseError(null);
    } catch (e: any) {
      setParseError('Failed to parse TOML: ' + e.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <FileCode className="w-5 h-5 text-orange-500" /> BeamMP Server Configuration
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Managing <span className="font-mono text-orange-500">{activeServer.serverFolderPath}\ServerConfig.toml</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-[var(--color-surface-hover)] rounded-xl border border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => setMode('visual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                mode === 'visual'
                  ? 'bg-orange-500 text-white shadow'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Visual Editor</span>
            </button>

            <button
              type="button"
              onClick={handleSwitchToRaw}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                mode === 'raw'
                  ? 'bg-orange-500 text-white shadow'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Raw TOML</span>
            </button>
          </div>

          <button
            type="button"
            onClick={mode === 'visual' ? saveServerConfigToml : handleSaveRaw}
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save & Flush to Server
          </button>
        </div>
      </div>

      {/* Visual Form Mode */}
      {mode === 'visual' ? (
        <div className="space-y-6">
          {/* General Information Card */}
          <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">
              General Server Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Server Public Name
                </label>
                <input
                  type="text"
                  value={serverConfig.Name}
                  onChange={(e) => handleVisualChange('Name', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs text-[var(--color-text)] focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  BeamMP AuthKey (Required for official master list)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={serverConfig.AuthKey}
                    onChange={(e) => handleVisualChange('AuthKey', e.target.value)}
                    placeholder="Key obtained from keymaster.beammp.com"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs font-mono text-[var(--color-text)] focus:ring-2 focus:ring-orange-500 focus:outline-none pr-8"
                  />
                  <a
                    href="https://keymaster.beammp.com"
                    target="_blank"
                    rel="noreferrer"
                    className="absolute right-2.5 top-2.5 text-orange-500 hover:text-orange-400"
                    title="Get official BeamMP AuthKey"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Server Description
              </label>
              <textarea
                value={serverConfig.Description}
                onChange={(e) => handleVisualChange('Description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs text-[var(--color-text)] focus:ring-2 focus:ring-orange-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Map Selection Card */}
          <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500" /> Active Level / Map Selection
                </h2>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Pick an official BeamNG map or type the path of an installed custom mod map.
                </p>
              </div>
              <span className="text-xs font-mono text-orange-500 font-bold">{serverConfig.Map}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {MAP_PRESETS.map((m) => {
                const isSelected = serverConfig.Map === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleVisualChange('Map', m.id)}
                    className={`p-3.5 rounded-xl border text-left transition ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500/10 text-orange-500 ring-1 ring-orange-500 shadow-sm'
                        : 'border-[var(--color-border)] bg-[var(--color-surface-hover)] text-[var(--color-text)] hover:border-orange-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{m.name}</span>
                      <span className="text-[10px] opacity-75 font-mono">{m.size}</span>
                    </div>
                    <div className="text-[11px] text-[var(--color-text-muted)]">{m.type}</div>
                    <div className="text-[9px] font-mono text-neutral-400 mt-2 truncate">
                      {m.id}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                Custom Mod Map File Path
              </label>
              <input
                type="text"
                value={serverConfig.Map}
                onChange={(e) => handleVisualChange('Map', e.target.value)}
                placeholder="/levels/custom_map_name/info.json"
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs font-mono text-[var(--color-text)] focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Slots & Networking Card */}
          <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">
              Slots, Limits & Networking
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Max Player Slots
                </label>
                <input
                  type="number"
                  min={1}
                  max={64}
                  value={serverConfig.MaxPlayers}
                  onChange={(e) => handleVisualChange('MaxPlayers', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs font-mono text-[var(--color-text)] focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Max Cars per Player
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={serverConfig.MaxCars}
                  onChange={(e) => handleVisualChange('MaxCars', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs font-mono text-[var(--color-text)] focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--color-text)] mb-1">
                  Listening Port (Default 30814)
                </label>
                <input
                  type="number"
                  value={serverConfig.Port}
                  onChange={(e) => handleVisualChange('Port', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs font-mono text-[var(--color-text)] focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Tickrate slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1">
                <span className="text-[var(--color-text)]">
                  Server Tick Rate ({serverConfig.TickRate} Hz)
                </span>
                <span className="text-[var(--color-text-muted)] font-mono">
                  Standard: 60 Hz • Recommended for local: 50-60 Hz
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={60}
                step={5}
                value={serverConfig.TickRate}
                onChange={(e) => handleVisualChange('TickRate', Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <label className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)] flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={serverConfig.Private}
                  onChange={(e) => handleVisualChange('Private', e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <div>
                  <div className="text-xs font-bold text-[var(--color-text)]">Private Server</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">Hide from public master list</div>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)] flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={serverConfig.LogChat}
                  onChange={(e) => handleVisualChange('LogChat', e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <div>
                  <div className="text-xs font-bold text-[var(--color-text)]">Log Chat Messages</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">Record chat to Server.log</div>
                </div>
              </label>

              <label className="p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)] flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={serverConfig.Debug}
                  onChange={(e) => handleVisualChange('Debug', e.target.checked)}
                  className="rounded text-orange-500 focus:ring-orange-500"
                />
                <div>
                  <div className="text-xs font-bold text-[var(--color-text)]">Debug Logging</div>
                  <div className="text-[10px] text-[var(--color-text-muted)]">Verbose sync packet logs</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      ) : (
        /* Raw TOML Mode */
        <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 shadow-sm">
          {parseError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {parseError}
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--color-text-muted)]">
              Edit the raw TOML syntax below. Standard BeamMP sections: [General]
            </span>
            <button
              type="button"
              onClick={() => setRawToml(serializeServerConfigToml(serverConfig))}
              className="text-xs text-orange-500 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to Current Config
            </button>
          </div>

          <textarea
            value={rawToml}
            onChange={(e) => setRawToml(e.target.value)}
            rows={18}
            className="w-full p-4 rounded-xl font-mono text-xs bg-neutral-950 text-neutral-200 border border-neutral-800 focus:outline-none focus:ring-2 focus:ring-orange-500 leading-relaxed"
          />
        </div>
      )}
    </div>
  );
};

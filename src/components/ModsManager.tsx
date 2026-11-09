import React, { useState, useRef } from 'react';
import { useServer } from '../context/ServerContext';
import { formatBytes } from '../utils/beammp';
import { ModCategory, ModItem } from '../types/beammp';
import { POPULAR_MOD_PRESETS } from '../data/initialData';
import {
  FolderOpen,
  Upload,
  CheckCircle2,
  Trash2,
  Download,
  RefreshCw,
  Sliders,
  Car,
  MapPin,
  Cpu,
  FileCode,
  Gauge,
  Sparkles,
  Info,
  HardDrive,
  FileArchive,
  Search,
  Filter
} from 'lucide-react';

export const ModsManager: React.FC = () => {
  const {
    activeServer,
    mods,
    addMod,
    toggleModEnabled,
    removeMod,
    installPopularMod,
    triggerClientModSync,
    isSyncingMods
  } = useServer();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [folderTab, setFolderTab] = useState<'client' | 'server'>('client');
  const [showSimulator, setShowSimulator] = useState(true);

  // File upload handling
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      addMod({ name: file.name, size: file.size });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  // Filter mods
  const filteredMods = mods.filter((mod) => {
    // folder tab match: client mods vs server plugins
    const isServerPlugin = mod.category === 'plugin';
    if (folderTab === 'client' && isServerPlugin) return false;
    if (folderTab === 'server' && !isServerPlugin) return false;

    // Search query
    const matchesSearch =
      mod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.filename.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory =
      selectedCategory === 'all' ||
      (selectedCategory === 'enabled' && mod.isEnabled) ||
      (selectedCategory === 'disabled' && !mod.isEnabled) ||
      mod.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const activeMods = mods.filter((m) => m.isEnabled);
  const totalSizeBytes = activeMods.reduce((acc, m) => acc + m.sizeBytes, 0);
  const totalSizeMb = totalSizeBytes / (1024 * 1024);

  // Download times calculation
  const download50Mbps = (totalSizeMb / (50 / 8)).toFixed(1);
  const download100Mbps = (totalSizeMb / (100 / 8)).toFixed(1);
  const download300Mbps = (totalSizeMb / (300 / 8)).toFixed(1);

  const getCategoryBadge = (category: ModCategory) => {
    switch (category) {
      case 'vehicle':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <Car className="w-3 h-3" /> Vehicle Mod
          </span>
        );
      case 'map':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <MapPin className="w-3 h-3" /> Custom Map
          </span>
        );
      case 'plugin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <FileCode className="w-3 h-3" /> Server Plugin (.lua)
          </span>
        );
      case 'ui':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Gauge className="w-3 h-3" /> UI Telemetry
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-500/10 text-neutral-400">
            Script
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Server Path Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-orange-500" /> Server Mod & Plugin Directory
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Files added here are synchronized to connected players from{' '}
            <span className="font-mono text-orange-500">
              {activeServer.serverFolderPath}\Resources\{folderTab === 'client' ? 'Client' : 'Server'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={triggerClientModSync}
            disabled={isSyncingMods}
            className="px-3.5 py-2 rounded-xl bg-[var(--color-surface-hover)] hover:bg-[var(--color-surface-active)] text-xs font-semibold text-[var(--color-text)] border border-[var(--color-border)] transition flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-orange-500 ${isSyncingMods ? 'animate-spin' : ''}`} />
            <span>Recalculate Mod Hashes</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center ${
          dragOver
            ? 'border-orange-500 bg-orange-500/10 scale-[1.01]'
            : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-orange-500/50 hover:bg-[var(--color-surface-hover)]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip,.lua"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
        <div className="max-w-md mx-auto space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto shadow-inner">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[var(--color-text)]">
            Drag & Drop Custom Mods directly to Server Folder
          </h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            Supports <strong className="text-[var(--color-text)]">.zip</strong> client mods (vehicles, maps, sounds, UI apps) and <strong className="text-[var(--color-text)]">.lua</strong> server plugins.
          </p>
          <div className="pt-2">
            <span className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition inline-flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5" /> Browse Computer Files
            </span>
          </div>
        </div>
      </div>

      {/* Client Join Time Impact Simulator */}
      {showSimulator && (
        <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">
                Client Join Bandwidth & Sync Estimator
              </span>
            </div>
            <span className="text-xs font-mono font-semibold text-orange-500">
              Total Active Download: {formatBytes(totalSizeBytes)}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-center">
              <div className="text-[11px] text-[var(--color-text-muted)]">Broadband (50 Mbps)</div>
              <div className="text-lg font-bold text-[var(--color-text)] font-mono">{download50Mbps}s</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">join sync time</div>
            </div>
            <div className="p-3 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-center">
              <div className="text-[11px] text-[var(--color-text-muted)]">Fiber (100 Mbps)</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">{download100Mbps}s</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">optimal speed</div>
            </div>
            <div className="p-3 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] text-center">
              <div className="text-[11px] text-[var(--color-text-muted)]">Gigabit (300+ Mbps)</div>
              <div className="text-lg font-bold text-cyan-400 font-mono">{download300Mbps}s</div>
              <div className="text-[10px] text-[var(--color-text-muted)]">instant join</div>
            </div>
          </div>
        </div>
      )}

      {/* Folder Tabs & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Folder tabs */}
          <div className="flex items-center gap-2 bg-[var(--color-surface)] p-1 rounded-xl border border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => setFolderTab('client')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                folderTab === 'client'
                  ? 'bg-orange-500 text-white shadow'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <FileArchive className="w-3.5 h-3.5" />
              <span>Resources/Client (Mods)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
                {mods.filter((m) => m.category !== 'plugin').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setFolderTab('server')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                folderTab === 'server'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Resources/Server (Plugins)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
                {mods.filter((m) => m.category === 'plugin').length}
              </span>
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search mods..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:ring-2 focus:ring-orange-500 focus:outline-none w-44"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-text)] focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="all">All States</option>
              <option value="enabled">Active Only</option>
              <option value="disabled">Disabled Only</option>
              <option value="vehicle">Vehicles</option>
              <option value="map">Maps</option>
              <option value="ui">UI Apps</option>
            </select>
          </div>
        </div>

        {/* Mods Table */}
        <div className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] overflow-hidden shadow-sm">
          {filteredMods.length === 0 ? (
            <div className="p-8 text-center text-[var(--color-text-muted)] text-xs">
              No files found matching your search. Drop a mod above to add it.
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {filteredMods.map((mod) => (
                <div
                  key={mod.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                    !mod.isEnabled ? 'opacity-60 bg-[var(--color-surface-hover)]/30' : 'hover:bg-[var(--color-surface-hover)]'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3">
                    {/* Enable toggle switch */}
                    <button
                      type="button"
                      onClick={() => toggleModEnabled(mod.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                        mod.isEnabled ? 'bg-orange-500' : 'bg-neutral-600'
                      }`}
                      role="switch"
                      aria-checked={mod.isEnabled}
                      aria-label={`Toggle ${mod.name}`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          mod.isEnabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs sm:text-sm text-[var(--color-text)]">
                          {mod.name}
                        </span>
                        {getCategoryBadge(mod.category)}
                        {!mod.isEnabled && (
                          <span className="text-[10px] font-semibold text-amber-500 uppercase">
                            (Disabled in Server)
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-[var(--color-text-muted)] flex flex-wrap items-center gap-3 mt-1">
                        <span className="font-mono text-neutral-400">{mod.filename}</span>
                        <span>•</span>
                        <span>Size: <strong className="text-[var(--color-text)]">{formatBytes(mod.sizeBytes)}</strong></span>
                        <span>•</span>
                        <span>SHA: <span className="font-mono">{mod.hash}</span></span>
                        <span>•</span>
                        <span>Synced: {mod.clientSyncCount} players</span>
                      </div>

                      {mod.description && (
                        <p className="text-[11px] text-[var(--color-text-muted)] mt-1 line-clamp-1">
                          {mod.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        // Simulated mod download
                        alert(`Downloading "${mod.filename}" from server Resources folder.`);
                      }}
                      className="p-1.5 text-[var(--color-text-muted)] hover:text-orange-500 rounded-lg hover:bg-[var(--color-surface-active)] transition"
                      title="Download file"
                      aria-label={`Download ${mod.filename}`}
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => removeMod(mod.id)}
                      className="p-1.5 text-[var(--color-text-muted)] hover:text-red-500 rounded-lg hover:bg-[var(--color-surface-active)] transition"
                      title="Delete from server"
                      aria-label={`Delete ${mod.name}`}
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

      {/* Popular Preset Mods Shelf */}
      <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-orange-500" />
          <h2 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">
            1-Click Popular BeamMP Community Mod Presets
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {POPULAR_MOD_PRESETS.map((preset) => {
            const alreadyInstalled = mods.some(
              (m) => m.filename.toLowerCase() === preset.filename.toLowerCase()
            );

            return (
              <div
                key={preset.filename}
                className="p-3.5 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    {getCategoryBadge(preset.category)}
                    <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                      {formatBytes(preset.sizeBytes)}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-[var(--color-text)]">{preset.name}</h4>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-1 line-clamp-2">
                    {preset.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => installPopularMod(preset)}
                  disabled={alreadyInstalled}
                  className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition ${
                    alreadyInstalled
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm'
                  }`}
                >
                  {alreadyInstalled ? 'Installed' : '+ Add to Server'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

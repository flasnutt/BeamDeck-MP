import React, { useState } from 'react';
import { useServer } from '../context/ServerContext';
import { HostType, OperatingSystem } from '../types/beammp';
import { Server, X, Shield, Cpu, HardDrive, Key, Link2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({ isOpen, onClose }) => {
  const { connectNewServer, servers, setActiveServerId } = useServer();

  const [name, setName] = useState('My Custom BeamMP Server');
  const [host, setHost] = useState('127.0.0.1');
  const [port, setPort] = useState(30814);
  const [authKey, setAuthKey] = useState('');
  const [rconPassword, setRconPassword] = useState('');
  const [hostType, setHostType] = useState<HostType>('localhost');
  const [os, setOs] = useState<OperatingSystem>('windows');
  const [serverFolderPath, setServerFolderPath] = useState('C:\\BeamMP-Server');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleHostTypeChange = (type: HostType) => {
    setHostType(type);
    if (type === 'localhost') {
      setHost('127.0.0.1');
      setServerFolderPath(os === 'windows' ? 'C:\\BeamMP-Server' : os === 'linux' ? '/opt/beammp' : '~/BeamMP-Server');
    } else {
      if (host === '127.0.0.1') setHost('149.202.88.192');
      setOs('linux');
      setServerFolderPath('/opt/beammp');
    }
  };

  const handleOsChange = (newOs: OperatingSystem) => {
    setOs(newOs);
    if (newOs === 'windows') {
      setServerFolderPath('C:\\BeamMP-Server');
    } else if (newOs === 'linux') {
      setServerFolderPath('/opt/beammp');
    } else {
      setServerFolderPath('~/BeamMP-Server');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide a server name.');
      return;
    }

    if (!host.trim()) {
      setError('Please provide a valid server IP address or hostname.');
      return;
    }

    if (!port || port < 1024 || port > 65535) {
      setError('Port must be a valid number between 1024 and 65535 (Default is 30814).');
      return;
    }

    connectNewServer({
      name: name.trim(),
      host: host.trim(),
      port: Number(port),
      authKey: authKey.trim() || 'bmp_key_' + Math.random().toString(36).substring(2, 10),
      rconPassword: rconPassword.trim() || undefined,
      hostType,
      os,
      serverFolderPath: serverFolderPath.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text)]">Connect Your BeamMP Server</h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Connect exclusively to a server you own via Local Host or Remote IP
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded-lg hover:bg-[var(--color-surface-active)] transition"
            aria-label="Close connection modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick presets */}
          <div>
            <label className="block text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              Fast Presets / Existing Servers
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {servers.map((srv) => (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => {
                    setActiveServerId(srv.id);
                    onClose();
                  }}
                  className="p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-hover)] hover:border-orange-500 text-left text-xs transition flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-[var(--color-text)]">{srv.name}</div>
                    <div className="text-[11px] text-[var(--color-text-muted)] font-mono">
                      {srv.host}:{srv.port} • {srv.hostType === 'localhost' ? 'Local PC' : 'VPS'}
                    </div>
                  </div>
                  <span className="text-orange-500 font-medium">Switch &rarr;</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] pt-4 space-y-4">
            <h3 className="text-sm font-bold text-[var(--color-text)] flex items-center gap-2">
              <Link2 className="w-4 h-4 text-orange-500" /> Server Connection Parameters
            </h3>

            {/* Host Type Selector */}
            <div>
              <label className="block text-xs font-medium text-[var(--color-text)] mb-2">
                Deployment Environment (Where does the server process run?)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleHostTypeChange('localhost')}
                  className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                    hostType === 'localhost'
                      ? 'border-orange-500 bg-orange-500/10 text-orange-500 font-semibold ring-1 ring-orange-500'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-hover)] text-[var(--color-text)]'
                  }`}
                >
                  <Cpu className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold">User's PC (Local Host)</div>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                      Server runs on your gaming computer alongside BeamNG. Shows PC CPU threads & physics load.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleHostTypeChange('remote_server')}
                  className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
                    hostType === 'remote_server'
                      ? 'border-orange-500 bg-orange-500/10 text-orange-500 font-semibold ring-1 ring-orange-500'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-hover)] text-[var(--color-text)]'
                  }`}
                >
                  <Server className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold">Dedicated Server (VPS)</div>
                    <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                      Runs on a remote Linux or Windows server. Monitors hosted server usage & uplink.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Server Name & Host IP */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[var(--color-text)] mb-1">
                  Server Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. My West Coast Cruise Server"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text)] mb-1">
                  Port
                </label>
                <input
                  type="number"
                  value={port}
                  onChange={(e) => setPort(Number(e.target.value))}
                  placeholder="30814"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] text-xs font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Server Host / IP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text)] mb-1">
                  Server IP / Hostname
                </label>
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder={hostType === 'localhost' ? '127.0.0.1' : '198.51.100.42'}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] text-xs font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text)] mb-1">
                  Host Operating System
                </label>
                <select
                  value={os}
                  onChange={(e) => handleOsChange(e.target.value as OperatingSystem)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                >
                  <option value="windows">Windows 10 / 11 / Server</option>
                  <option value="linux">Linux (Ubuntu / Debian / Arch)</option>
                  <option value="macos">macOS (Apple Silicon / Intel)</option>
                </select>
              </div>
            </div>

            {/* AuthKey & Folder Path */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text)] mb-1">
                  BeamMP AuthKey (Server Ownership Key)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={authKey}
                    onChange={(e) => setAuthKey(e.target.value)}
                    placeholder="Paste official key from beammp.com"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] text-xs font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none pr-8"
                  />
                  <Key className="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute right-2.5 top-2.5" />
                </div>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                  Generate free key at <span className="text-orange-500 font-mono">keymaster.beammp.com</span>
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-text)] mb-1">
                  Server Installation Folder
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={serverFolderPath}
                    onChange={(e) => setServerFolderPath(e.target.value)}
                    placeholder="C:\BeamMP-Server or /opt/beammp"
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-[var(--color-text)] text-xs font-mono focus:ring-2 focus:ring-orange-500 focus:outline-none pr-8"
                  />
                  <HardDrive className="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute right-2.5 top-2.5" />
                </div>
                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                  Path where <span className="font-mono">Resources/Client</span> and <span className="font-mono">ServerConfig.toml</span> reside.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-xs font-medium text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Connect & Mount Dashboard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

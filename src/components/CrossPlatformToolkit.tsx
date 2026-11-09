import React, { useState } from 'react';
import { useServer } from '../context/ServerContext';
import { OperatingSystem } from '../types/beammp';
import { generateOsStartupScript } from '../utils/beammp';
import {
  Globe,
  Terminal,
  Copy,
  Check,
  Download,
  Shield,
  FolderTree,
  ExternalLink,
  Laptop,
  CheckCircle2
} from 'lucide-react';

export const CrossPlatformToolkit: React.FC = () => {
  const { activeServer, setOperatingSystem } = useServer();

  const [selectedOs, setSelectedOs] = useState<OperatingSystem>(activeServer.os);
  const [copied, setCopied] = useState(false);

  const scriptData = generateOsStartupScript(selectedOs, activeServer.serverFolderPath, activeServer.port);

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptData.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOsSelect = (os: OperatingSystem) => {
    setSelectedOs(os);
    setOperatingSystem(os);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-text)] flex items-center gap-2">
            <Globe className="w-5 h-5 text-orange-500" /> Cross-Platform Compatibility Hub
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            Native startup scripts, systemd daemons, and firewall automation for Windows, Linux, and macOS.
          </p>
        </div>

        {/* OS Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[var(--color-surface-hover)] rounded-xl border border-[var(--color-border)]">
          {(['windows', 'linux', 'macos'] as OperatingSystem[]).map((os) => (
            <button
              key={os}
              type="button"
              onClick={() => handleOsSelect(os)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                selectedOs === os
                  ? 'bg-orange-500 text-white shadow'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {os === 'macos' ? 'macOS' : os}
            </button>
          ))}
        </div>
      </div>

      {/* Directory & Paths layout */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-orange-500" /> Platform Directory Structure & Paths ({selectedOs.toUpperCase()})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
            <div className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold">
              Root Executable Folder
            </div>
            <div className="font-mono text-orange-400 font-bold mt-1 break-all">
              {selectedOs === 'windows' ? 'C:\\BeamMP-Server\\' : selectedOs === 'linux' ? '/opt/beammp/' : '~/BeamMP-Server/'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
            <div className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold">
              Client Mods Directory (.zip)
            </div>
            <div className="font-mono text-[var(--color-text)] font-bold mt-1 break-all">
              {selectedOs === 'windows'
                ? 'C:\\BeamMP-Server\\Resources\\Client\\'
                : selectedOs === 'linux'
                ? '/opt/beammp/Resources/Client/'
                : '~/BeamMP-Server/Resources/Client/'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
            <div className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold">
              Server Plugins Directory (.lua)
            </div>
            <div className="font-mono text-[var(--color-text)] font-bold mt-1 break-all">
              {selectedOs === 'windows'
                ? 'C:\\BeamMP-Server\\Resources\\Server\\'
                : selectedOs === 'linux'
                ? '/opt/beammp/Resources/Server/'
                : '~/BeamMP-Server/Resources/Server/'}
            </div>
          </div>
        </div>
      </div>

      {/* Script Generator & Instructions */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-orange-500" /> Native Startup Runner: {scriptData.filename}
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-1 whitespace-pre-line">
              {scriptData.instructions}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-[var(--color-surface-hover)] hover:bg-[var(--color-surface-active)] text-xs font-semibold text-[var(--color-text)] border border-[var(--color-border)] transition flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-orange-500" /> Copy Script
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                const blob = new Blob([scriptData.content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = scriptData.filename;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <Download className="w-3.5 h-3.5" /> Download Script
            </button>
          </div>
        </div>

        {/* Code Box */}
        <pre className="p-4 rounded-xl bg-neutral-950 text-neutral-200 border border-neutral-800 font-mono text-xs overflow-x-auto leading-relaxed shadow-inner">
          {scriptData.content}
        </pre>
      </div>

      {/* Firewall & Port 30814 Guide */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-orange-500" />
          <h2 className="text-sm font-bold text-[var(--color-text)] uppercase tracking-wider">
            Port Forwarding & Firewall Quick Checklist (Port {activeServer.port})
          </h2>
        </div>

        <p className="text-xs text-[var(--color-text-muted)]">
          BeamMP uses UDP port {activeServer.port} for multiplayer vehicle physics state sync and TCP for initial authentication handshake and mod resource downloads.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] space-y-1">
            <div className="font-bold text-[var(--color-text)]">1. Router / WAN Port Forwarding</div>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Log into your router (e.g. 192.168.1.1) and forward Port {activeServer.port} (Both UDP & TCP) to your local IP address.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] space-y-1">
            <div className="font-bold text-[var(--color-text)]">2. BeamMP AuthKey Heartbeat</div>
            <p className="text-[11px] text-[var(--color-text-muted)]">
              Verify your key is active at <span className="font-mono text-orange-500">keymaster.beammp.com</span> so public players can locate your server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useSpotify } from '../context/SpotifyContext';
import {
  X,
  Radio,
  Key,
  Laptop,
  CheckCircle2,
  ExternalLink,
  Shield,
  Copy,
  Check,
  Disc,
  Play
} from 'lucide-react';

export const SpotifyConnectModal: React.FC = () => {
  const { isConnectModalOpen, setIsConnectModalOpen, state, setActiveDevice, connectSpotifyAccount } = useSpotify();

  const [clientId, setClientId] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(state.activeDevice);

  if (!isConnectModalOpen) return null;

  const callbackUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/auth/callback`
    : 'https://ais-dev-qleohogz5zijdik42rpwmc-600898032425.europe-west2.run.app/auth/callback';

  const handleCopyCallback = () => {
    navigator.clipboard.writeText(callbackUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setActiveDevice(selectedDevice);
    connectSpotifyAccount(undefined, clientId);
    setIsConnectModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Radio className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--color-text)]">
                Spotify Connect & Account Settings
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Control Spotify music playback while driving or hosting in BeamMP
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsConnectModalOpen(false)}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded-lg hover:bg-[var(--color-surface-active)] transition"
            aria-label="Close Spotify settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Active Device Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--color-text)] mb-2 flex items-center gap-2">
              <Laptop className="w-4 h-4 text-emerald-500" /> Target Spotify Playback Device
            </label>
            <div className="space-y-1.5">
              {state.devices.map((device) => (
                <button
                  key={device}
                  type="button"
                  onClick={() => setSelectedDevice(device)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between ${
                    selectedDevice === device
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400 font-bold'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-hover)] text-[var(--color-text)]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{device}</span>
                  </span>
                  {selectedDevice === device && <Check className="w-4 h-4 text-emerald-500" />}
                </button>
              ))}
            </div>
          </div>

          {/* Spotify Web API Credentials (Optional custom app) */}
          <div className="border-t border-[var(--color-border)] pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[var(--color-text)] uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-500" /> Link Custom Spotify Developer App
              </span>
              <a
                href="https://developer.spotify.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                Spotify Developer Dashboard <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-[11px] text-[var(--color-text-muted)] leading-relaxed">
              BeamDeck includes ready-to-play Eurobeat, Phonk, and Synthwave presets. To connect your personal Spotify Premium account directly, create a free Spotify Developer App and add this redirect URI:
            </p>

            <div className="p-3 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)] space-y-2">
              <div className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold">
                OAuth Redirect Callback URI:
              </div>
              <div className="flex items-center justify-between gap-2">
                <code className="text-[11px] font-mono text-emerald-400 break-all bg-black/40 px-2 py-1 rounded">
                  {callbackUrl}
                </code>
                <button
                  type="button"
                  onClick={handleCopyCallback}
                  className="px-2.5 py-1 rounded-lg border border-[var(--color-border)] text-[11px] hover:bg-[var(--color-surface-active)] shrink-0 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[var(--color-text)] mb-1">
                Spotify Client ID (Optional)
              </label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Paste Client ID from developer.spotify.com"
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs font-mono text-[var(--color-text)] focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-hover)] flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsConnectModalOpen(false)}
            className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs text-[var(--color-text)] hover:bg-[var(--color-surface-active)] transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold shadow transition flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useServer } from '../context/ServerContext';
import { useSpotify } from '../context/SpotifyContext';
import {
  HelpCircle,
  Search,
  Key,
  Radio,
  Server,
  Shield,
  FolderOpen,
  Cpu,
  Laptop,
  Archive,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Flame,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  Move
} from 'lucide-react';

export const HelpDashboard: React.FC = () => {
  const { activeServer } = useServer();
  const { setIsVisible, setIsConnectModalOpen } = useSpotify();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-spotify');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const callbackUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/auth/callback`
    : 'https://ais-dev-qleohogz5zijdik42rpwmc-600898032425.europe-west2.run.app/auth/callback';

  const categories = [
    { id: 'all', label: 'All Help Guides' },
    { id: 'spotify', label: 'Spotify & Music' },
    { id: 'authkey', label: 'BeamMP AuthKey' },
    { id: 'portforwarding', label: 'Port Forwarding (30814)' },
    { id: 'mods', label: 'Mods & Folder Control' },
    { id: 'hardware', label: 'PC vs VPS Hardware' },
    { id: 'moderation', label: 'Moderation & RCON' },
    { id: 'backups', label: 'Backups & Recovery' }
  ];

  const faqs = [
    {
      id: 'faq-spotify',
      category: 'spotify',
      title: 'How do I connect Spotify and control music from BeamDeck?',
      content: `1. Built-in Drift Radio: BeamDeck comes pre-loaded with high-energy Eurobeat, Drift Phonk, and Synthwave playlists. You can immediately play, pause, skip, seek, and adjust volume without entering any API key!
2. Moving the Player: The Spotify box can be freely dragged anywhere on the screen using the top grip bar, and clicking the minimize icon (_) shrinks it to a tiny pill.
3. Official Spotify Account Connect:
   - Visit https://developer.spotify.com/dashboard and log in with your Spotify account.
   - Click "Create App". Name it "BeamDeck MP Controller".
   - Under "Redirect URIs", paste: ${callbackUrl}
   - Copy your Client ID and enter it into BeamDeck's Spotify Connect Settings.
   - Now you can control any active Spotify device (Desktop PC, Mobile, Wireless Headset) seamlessly!`
    },
    {
      id: 'faq-authkey',
      category: 'authkey',
      title: 'How do I get an official BeamMP Server AuthKey?',
      content: `1. Visit the official BeamMP Keymaster website: https://keymaster.beammp.com
2. Sign in with your Discord account (required by BeamMP to combat spam servers).
3. On the left navigation, click "Keys".
4. Click "+ Generate Key" and give it a label (e.g. "My Drift Server").
5. Copy the generated AuthKey string (e.g. bmp_live_xxxxxxxx).
6. Paste it into BeamDeck's "ServerConfig" tab or the "Connect Server" dialog under AuthKey.
Note: A server cannot register on the BeamMP public master list without a valid AuthKey.`
    },
    {
      id: 'faq-ports',
      category: 'portforwarding',
      title: 'Why do friends get "Connection Failed / Server Unreachable"?',
      content: `BeamMP servers require port 30814 to be opened on your router and firewall:
- UDP Port 30814: Transmits real-time vehicle positions, soft-body deformations, steering angles, and physics updates.
- TCP Port 30814: Transmits authentication handshakes, chat messages, and custom client mod (.zip) downloads.
To fix:
1. Open your router administration page (typically http://192.168.1.1 or 192.168.0.1).
2. Look for "Port Forwarding" or "Virtual Servers".
3. Add a new rule for Port 30814 with Protocol set to "BOTH" (or separate UDP and TCP rules) pointing to your local machine's IP address.
4. If hosting on Windows, use BeamDeck's auto-generated run_beammp_server.bat script from the "OS & Deployment" tab, which automatically executes netsh firewall rules.`
    },
    {
      id: 'faq-mods',
      category: 'mods',
      title: 'Where do custom vehicle and map mods go, and how do clients download them?',
      content: `BeamMP organizes resources into two distinct directories inside your server folder:
1. Resources/Client/: Holds all .zip mod files (custom cars, trucks, drift skins, maps, UI telemetry apps). When a racer joins your server, the BeamMP client checks file hashes and automatically downloads these .zip files directly from your server!
2. Resources/Server/: Holds server-side .lua scripts and plugins (e.g., anti-cheat, speed traps, auto-restart).
Tips:
- Keep total active client mods under 500MB to avoid long loading times for players on slower broadband.
- Use BeamDeck's "Enable / Disable" switch to test mods without deleting files from disk.`
    },
    {
      id: 'faq-hardware',
      category: 'hardware',
      title: 'Why does hosting on my PC show high CPU usage on Core 0?',
      content: `BeamNG.drive is fundamentally different from other racing games. Instead of rigid bodies, it calculates thousands of spring-damper equations across vertices (jbeam).
When hosting locally on your gaming PC:
- Your CPU handles BOTH the BeamNG rendering client AND the physics networking for all 5–10 players.
- BeamNG reserves Core 0 and Core 1 for the primary vehicle physics integration step (running at 2000 Hz).
- Advice: Set "MaxCars" to 1 or 2 per player in the ServerConfig tab, close background browser tabs, and ensure your CPU has at least 6 physical cores.`
    },
    {
      id: 'faq-rcon',
      category: 'moderation',
      title: 'What commands can I type into the Live Console?',
      content: `Available BeamMP interactive RCON commands:
- status: Shows server uptime, tickrate, player count, and active mods
- list: Displays all connected racers, their BeamMP IDs, pings, and cars
- kick <player> [reason]: Disconnects a disruptive player
- ban <player> [reason]: Blacklists a player's BeamMP ID and IP
- say <message>: Broadcasts a server-wide announcement in chat
- reloadmods: Rescans the Resources directory and recalculates checksums
- saveconfig: Flushes ServerConfig.toml updates to disk
- restart: Gracefully restarts the server process`
    },
    {
      id: 'faq-backups',
      category: 'backups',
      title: 'How do automated backups prevent broken server configurations?',
      content: `BeamDeck features a built-in automated backup scheduler.
- You can configure hourly, daily, or weekly snapshots.
- Each snapshot packages ServerConfig.toml, Resources/Client mods, and player banlists.
- If a recently uploaded vehicle mod causes the server to crash on startup, navigate to the "Auto Backups" tab and click "Restore to Server" next to your last stable snapshot. BeamDeck will roll back files and restart the server automatically.`
    }
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                <HelpCircle className="w-6 h-6" />
              </span>
              <h1 className="text-xl font-bold text-[var(--color-text)]">
                BeamDeck MP — Comprehensive Knowledge & Help Center
              </h1>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Complete setup instructions for Spotify control, BeamMP AuthKeys, port forwarding, mod folders, and host optimization.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsVisible(true);
              setIsConnectModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-bold shadow transition flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Radio className="w-4 h-4" /> Open Spotify Settings
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative pt-2">
          <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3.5 top-5.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help topics (e.g. Spotify, AuthKey, Port 30814, Core 0, Mods, RCON commands)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-input-bg)] text-xs text-[var(--color-text)] focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeCategory === cat.id
                ? 'bg-orange-500 text-white shadow'
                : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Fast Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Spotify Setup */}
        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
              <Radio className="w-4 h-4" /> Spotify Control & Keys
            </div>
            <h3 className="text-sm font-bold text-[var(--color-text)]">
              Control Music Directly in BeamDeck
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              Drag the Spotify mini player anywhere on your screen. Play Eurobeat, Phonk, or link your Spotify Developer Client ID.
            </p>
          </div>
          <div className="space-y-1.5 pt-2 border-t border-[var(--color-border)]">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[var(--color-text-muted)]">OAuth Callback URI:</span>
              <button
                type="button"
                onClick={() => handleCopy(callbackUrl, 'cb-card')}
                className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[10px]"
              >
                {copiedKey === 'cb-card' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                Copy URI
              </button>
            </div>
            <a
              href="https://developer.spotify.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1"
            >
              Spotify Developer Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Card 2: BeamMP AuthKey */}
        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-xs uppercase tracking-wider">
              <Key className="w-4 h-4" /> BeamMP Official AuthKey
            </div>
            <h3 className="text-sm font-bold text-[var(--color-text)]">
              Claim Server Ownership
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              To broadcast your server to the global BeamMP browser, generate a free AuthKey linked to your Discord account.
            </p>
          </div>
          <div className="pt-2 border-t border-[var(--color-border)]">
            <a
              href="https://keymaster.beammp.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-orange-500 hover:underline font-semibold flex items-center gap-1"
            >
              Open Keymaster Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Card 3: Port Forwarding */}
        <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-3 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4" /> Networking & Firewall
            </div>
            <h3 className="text-sm font-bold text-[var(--color-text)]">
              Open Port 30814 UDP & TCP
            </h3>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              UDP delivers real-time car collisions; TCP downloads vehicle .zip mods. Ensure both are allowed in router and firewall.
            </p>
          </div>
          <div className="pt-2 border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)]">
            Target Port: <strong className="text-[var(--color-text)] font-mono">30814</strong> (Both UDP/TCP)
          </div>
        </div>
      </div>

      {/* Accordion Knowledge Base Section */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-orange-500" /> Frequently Asked Questions & Technical Reference
          </h2>
          <span className="text-xs text-[var(--color-text-muted)]">
            Showing {filteredFaqs.length} guides
          </span>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)] overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-[var(--color-text)] hover:bg-[var(--color-surface-active)] transition"
                  aria-expanded={isExpanded}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="p-1 rounded-md bg-orange-500/10 text-orange-500">
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </span>
                    <span>{faq.title}</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-black/20 text-[var(--color-text-muted)]">
                    {faq.category}
                  </span>
                </button>

                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-[var(--color-border)] text-xs leading-relaxed text-[var(--color-text)] whitespace-pre-line space-y-2">
                    <p>{faq.content}</p>

                    {faq.category === 'spotify' && (
                      <div className="mt-3 p-3 rounded-lg bg-black/40 border border-neutral-700 space-y-2">
                        <div className="font-semibold text-emerald-400 text-[11px]">
                          Quick Copy: Spotify OAuth Redirect URI
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-[10px] font-mono text-neutral-300 break-all select-all">
                            {callbackUrl}
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopy(callbackUrl, 'cb-faq')}
                            className="px-2 py-1 rounded bg-emerald-500 text-black font-bold text-[10px] shrink-0"
                          >
                            {copiedKey === 'cb-faq' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RCON Quick Command Cheat Sheet */}
      <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-orange-500" />
          <h2 className="text-base font-bold text-[var(--color-text)]">
            BeamMP Server Command Cheat Sheet
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-text-muted)]">
                <th className="py-2.5 px-3 font-mono font-bold">Command</th>
                <th className="py-2.5 px-3 font-bold">Arguments</th>
                <th className="py-2.5 px-3 font-bold">Description</th>
                <th className="py-2.5 px-3 font-bold">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)] font-mono text-[11px]">
              <tr className="hover:bg-[var(--color-surface-hover)]">
                <td className="py-2.5 px-3 text-orange-400 font-bold">status</td>
                <td className="py-2.5 px-3 text-neutral-400">None</td>
                <td className="py-2.5 px-3 font-sans text-[var(--color-text)]">Reports uptime, tickrate, and slots.</td>
                <td className="py-2.5 px-3 text-neutral-400">status</td>
              </tr>
              <tr className="hover:bg-[var(--color-surface-hover)]">
                <td className="py-2.5 px-3 text-orange-400 font-bold">list</td>
                <td className="py-2.5 px-3 text-neutral-400">None</td>
                <td className="py-2.5 px-3 font-sans text-[var(--color-text)]">Lists all active racers & cars.</td>
                <td className="py-2.5 px-3 text-neutral-400">list</td>
              </tr>
              <tr className="hover:bg-[var(--color-surface-hover)]">
                <td className="py-2.5 px-3 text-orange-400 font-bold">kick</td>
                <td className="py-2.5 px-3 text-neutral-400">&lt;player&gt; [reason]</td>
                <td className="py-2.5 px-3 font-sans text-[var(--color-text)]">Disconnects player from session.</td>
                <td className="py-2.5 px-3 text-neutral-400">kick ApexCorner88 Ramming</td>
              </tr>
              <tr className="hover:bg-[var(--color-surface-hover)]">
                <td className="py-2.5 px-3 text-orange-400 font-bold">ban</td>
                <td className="py-2.5 px-3 text-neutral-400">&lt;player&gt; [reason]</td>
                <td className="py-2.5 px-3 font-sans text-[var(--color-text)]">Bans BeamMP ID and IP permanently.</td>
                <td className="py-2.5 px-3 text-neutral-400">ban RammerTroll Cheating</td>
              </tr>
              <tr className="hover:bg-[var(--color-surface-hover)]">
                <td className="py-2.5 px-3 text-orange-400 font-bold">say</td>
                <td className="py-2.5 px-3 text-neutral-400">&lt;message&gt;</td>
                <td className="py-2.5 px-3 font-sans text-[var(--color-text)]">Broadcasts announcement in chat.</td>
                <td className="py-2.5 px-3 text-neutral-400">say Highway race starting in 2m</td>
              </tr>
              <tr className="hover:bg-[var(--color-surface-hover)]">
                <td className="py-2.5 px-3 text-orange-400 font-bold">reloadmods</td>
                <td className="py-2.5 px-3 text-neutral-400">None</td>
                <td className="py-2.5 px-3 font-sans text-[var(--color-text)]">Refreshes Resources hashes for clients.</td>
                <td className="py-2.5 px-3 text-neutral-400">reloadmods</td>
              </tr>
              <tr className="hover:bg-[var(--color-surface-hover)]">
                <td className="py-2.5 px-3 text-orange-400 font-bold">saveconfig</td>
                <td className="py-2.5 px-3 text-neutral-400">None</td>
                <td className="py-2.5 px-3 font-sans text-[var(--color-text)]">Flushes ServerConfig.toml to disk.</td>
                <td className="py-2.5 px-3 text-neutral-400">saveconfig</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

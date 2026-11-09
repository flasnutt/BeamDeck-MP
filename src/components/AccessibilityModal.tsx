import React from 'react';
import { useServer } from '../context/ServerContext';
import { ThemeId } from '../types/beammp';
import {
  Eye,
  X,
  Palette,
  Type,
  Move,
  Volume2,
  Check,
  Sparkles,
  Sun,
  Moon,
  Contrast
} from 'lucide-react';

interface AccessibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({ isOpen, onClose }) => {
  const { accessibility, updateAccessibility } = useServer();

  if (!isOpen) return null;

  const themes: { id: ThemeId; name: string; desc: string; previewClass: string }[] = [
    {
      id: 'beam-orange',
      name: 'Beam Orange (Classic)',
      desc: 'BeamNG motorsport dark theme with vivid orange racing accents.',
      previewClass: 'from-neutral-900 to-orange-950 border-orange-500'
    },
    {
      id: 'midnight-cyber',
      name: 'Midnight Cyber',
      desc: 'Deep oceanic navy with vibrant electric cyan indicators.',
      previewClass: 'from-slate-950 to-cyan-950 border-cyan-500'
    },
    {
      id: 'contrast-dark',
      name: 'High Contrast Dark',
      desc: 'WCAG AAA certified high-contrast dark theme with sharp borders.',
      previewClass: 'from-black to-neutral-900 border-white'
    },
    {
      id: 'contrast-light',
      name: 'High Contrast Light',
      desc: 'Clean daylight theme with crisp slate boundaries for bright rooms.',
      previewClass: 'from-white to-neutral-100 border-neutral-400'
    },
    {
      id: 'colorblind-safe',
      name: 'Colorblind Safe (Tritan/Deutan)',
      desc: 'Optimized cobalt & amber palette avoiding red/green ambiguity.',
      previewClass: 'from-slate-900 to-amber-950 border-amber-400'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)] bg-[var(--color-surface-hover)]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--color-text)]">
                Custom Themes & Accessibility
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Personalize contrast, typography scale, motion, and visual clarity
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded-lg hover:bg-[var(--color-surface-active)] transition"
            aria-label="Close accessibility modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Themes Selector */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-orange-500" /> Color Schemes
            </h3>
            <div className="space-y-2.5">
              {themes.map((t) => {
                const isSelected = accessibility.theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => updateAccessibility({ theme: t.id })}
                    className={`w-full p-3.5 rounded-xl border text-left transition flex items-center justify-between ${
                      isSelected
                        ? 'border-orange-500 bg-orange-500/10 ring-1 ring-orange-500 shadow-sm'
                        : 'border-[var(--color-border)] bg-[var(--color-surface-hover)] hover:border-orange-500/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full bg-gradient-to-br ${t.previewClass} border shrink-0`}
                      />
                      <div>
                        <div className="text-xs font-bold text-[var(--color-text)]">{t.name}</div>
                        <div className="text-[11px] text-[var(--color-text-muted)]">{t.desc}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="p-1 rounded-full bg-orange-500 text-white shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Scaling */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-3 flex items-center gap-2">
              <Type className="w-4 h-4 text-orange-500" /> Typography & Font Scale
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => updateAccessibility({ fontSize: size })}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase transition ${
                    accessibility.fontSize === size
                      ? 'border-orange-500 bg-orange-500 text-white shadow'
                      : 'border-[var(--color-border)] bg-[var(--color-surface-hover)] text-[var(--color-text)]'
                  }`}
                >
                  {size === 'sm' ? 'Compact' : size === 'md' ? 'Normal' : size === 'lg' ? 'Large' : 'XL'}
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Toggles */}
          <div className="space-y-3 pt-2 border-t border-[var(--color-border)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
              Accessibility Enhancements
            </h3>

            {/* Reduced Motion */}
            <label className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)] flex items-center justify-between cursor-pointer">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[var(--color-text)]">Reduced Motion Mode</div>
                <div className="text-[11px] text-[var(--color-text-muted)]">
                  Disables pulsing badges, real-time gauge animations, and transitions.
                </div>
              </div>
              <input
                type="checkbox"
                checked={accessibility.reducedMotion}
                onChange={(e) => updateAccessibility({ reducedMotion: e.target.checked })}
                className="rounded text-orange-500 focus:ring-orange-500 h-4 w-4"
              />
            </label>

            {/* High Contrast Borders */}
            <label className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)] flex items-center justify-between cursor-pointer">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[var(--color-text)]">High Contrast Borders</div>
                <div className="text-[11px] text-[var(--color-text-muted)]">
                  Emphasizes interactive buttons and card boundaries for low-vision environments.
                </div>
              </div>
              <input
                type="checkbox"
                checked={accessibility.highContrast}
                onChange={(e) => updateAccessibility({ highContrast: e.target.checked })}
                className="rounded text-orange-500 focus:ring-orange-500 h-4 w-4"
              />
            </label>

            {/* Sound Effects */}
            <label className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-hover)] flex items-center justify-between cursor-pointer">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-[var(--color-text)]">Sound Alert Effects</div>
                <div className="text-[11px] text-[var(--color-text-muted)]">
                  Plays audio cues on player joins, disconnects, and server warnings.
                </div>
              </div>
              <input
                type="checkbox"
                checked={accessibility.soundAlerts}
                onChange={(e) => updateAccessibility({ soundAlerts: e.target.checked })}
                className="rounded text-orange-500 focus:ring-orange-500 h-4 w-4"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface-hover)] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow transition"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Format milliseconds into standard mm:ss string
 */
export function formatDurationMs(ms: number): string {
  if (ms < 0) return '0:00';
  const totalSec = Math.floor(ms / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Clamp seek position within track duration
 */
export function clampSeekProgress(progressMs: number, durationMs: number): number {
  return Math.max(0, Math.min(progressMs, durationMs));
}

/**
 * Clamp volume between 0 and 100
 */
export function clampVolume(volume: number): number {
  return Math.max(0, Math.min(100, Math.round(volume)));
}

/**
 * Cycle repeat mode
 */
export function getNextRepeatMode(current: 'off' | 'context' | 'track'): 'off' | 'context' | 'track' {
  if (current === 'off') return 'context';
  if (current === 'context') return 'track';
  return 'off';
}

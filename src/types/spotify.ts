export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumArt: string;
  durationMs: number;
  uri: string;
}

export interface SpotifyPlaybackState {
  isConnected: boolean;
  isPlaying: boolean;
  currentTrack: SpotifyTrack;
  progressMs: number;
  volume: number; // 0 - 100
  isMuted: boolean;
  shuffle: boolean;
  repeat: 'off' | 'context' | 'track';
  activeDevice: string;
  devices: string[];
}

export interface SpotifyPlaylistPreset {
  id: string;
  name: string;
  genre: string;
  tracksCount: number;
  coverArt: string;
  tracks: SpotifyTrack[];
}

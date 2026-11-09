import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { SpotifyTrack, SpotifyPlaybackState, SpotifyPlaylistPreset } from '../types/spotify';

export const SPOTIFY_PLAYLIST_PRESETS: SpotifyPlaylistPreset[] = [
  {
    id: 'pl-eurobeat',
    name: 'Initial D & Touge Eurobeat',
    genre: 'Eurobeat / Drift',
    tracksCount: 4,
    coverArt: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=150&auto=format&fit=crop&q=80',
    tracks: [
      {
        id: 'tr-1',
        title: 'Running in the 90s',
        artist: 'Maurizio De Jorio',
        album: 'Initial D Super Eurobeat',
        albumArt: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=150&auto=format&fit=crop&q=80',
        durationMs: 292000,
        uri: 'spotify:track:running_in_the_90s'
      },
      {
        id: 'tr-2',
        title: 'Deja Vu (Akina Downhill Spec)',
        artist: 'Dave Rodgers',
        album: 'Super Eurobeat Vol. 100',
        albumArt: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=150&auto=format&fit=crop&q=80',
        durationMs: 264000,
        uri: 'spotify:track:deja_vu'
      },
      {
        id: 'tr-3',
        title: 'Gas Gas Gas',
        artist: 'Manuel',
        album: 'Initial D Fifth Stage',
        albumArt: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=150&auto=format&fit=crop&q=80',
        durationMs: 312000,
        uri: 'spotify:track:gas_gas_gas'
      },
      {
        id: 'tr-4',
        title: 'Night of Fire',
        artist: 'Niko',
        album: 'Euromach Collection',
        albumArt: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=150&auto=format&fit=crop&q=80',
        durationMs: 280000,
        uri: 'spotify:track:night_of_fire'
      }
    ]
  },
  {
    id: 'pl-phonk',
    name: 'Drift Phonk & Tokyo Nightline',
    genre: 'Drift Phonk',
    tracksCount: 3,
    coverArt: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=150&auto=format&fit=crop&q=80',
    tracks: [
      {
        id: 'tr-5',
        title: 'Midnight Highway Drift',
        artist: 'KSLV Noh',
        album: 'Tokyo Underground',
        albumArt: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=150&auto=format&fit=crop&q=80',
        durationMs: 145000,
        uri: 'spotify:track:midnight_highway'
      },
      {
        id: 'tr-6',
        title: 'Neon Blade (BeamNG Slow-Mo)',
        artist: 'MoonDeity',
        album: 'Phonk Masters',
        albumArt: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=150&auto=format&fit=crop&q=80',
        durationMs: 182000,
        uri: 'spotify:track:neon_blade'
      },
      {
        id: 'tr-7',
        title: 'Shadow Touge 3000',
        artist: 'DVRST & Hensonn',
        album: 'Downhill Records',
        albumArt: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=150&auto=format&fit=crop&q=80',
        durationMs: 160000,
        uri: 'spotify:track:shadow_touge'
      }
    ]
  },
  {
    id: 'pl-synthwave',
    name: 'West Coast Sunset Chillwave',
    genre: 'Synthwave / Retro',
    tracksCount: 3,
    coverArt: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=150&auto=format&fit=crop&q=80',
    tracks: [
      {
        id: 'tr-8',
        title: 'Resonance on Highway 101',
        artist: 'HOME & Lorn',
        album: 'Odyssey',
        albumArt: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=150&auto=format&fit=crop&q=80',
        durationMs: 212000,
        uri: 'spotify:track:resonance'
      },
      {
        id: 'tr-9',
        title: 'Sunset Cruiser in Belasco City',
        artist: 'The Midnight',
        album: 'Endless Summer',
        albumArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=150&auto=format&fit=crop&q=80',
        durationMs: 258000,
        uri: 'spotify:track:sunset_cruiser'
      },
      {
        id: 'tr-10',
        title: 'Pacific Coast Highway Vibe',
        artist: 'Kavinsky',
        album: 'OutRun',
        albumArt: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=150&auto=format&fit=crop&q=80',
        durationMs: 236000,
        uri: 'spotify:track:pacific_vibe'
      }
    ]
  }
];

interface SpotifyContextType {
  state: SpotifyPlaybackState;
  isVisible: boolean;
  isMinimized: boolean;
  setIsVisible: (visible: boolean) => void;
  setIsMinimized: (minimized: boolean) => void;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seek: (progressMs: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setActiveDevice: (device: string) => void;
  loadPlaylist: (playlistId: string) => void;
  connectSpotifyAccount: (accessToken?: string, clientId?: string) => void;
  disconnectSpotify: () => void;
  isConnectModalOpen: boolean;
  setIsConnectModalOpen: (open: boolean) => void;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export const SpotifyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const initialPlaylist = SPOTIFY_PLAYLIST_PRESETS[0];

  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);

  const [state, setState] = useState<SpotifyPlaybackState>({
    isConnected: true, // Connected to Spotify Controller
    isPlaying: false,
    currentTrack: initialPlaylist.tracks[0],
    progressMs: 42000,
    volume: 75,
    isMuted: false,
    shuffle: false,
    repeat: 'off',
    activeDevice: "BeamDeck PC (Spotify Desktop)",
    devices: [
      "BeamDeck PC (Spotify Desktop)",
      "Living Room Hi-Fi Receiver",
      "Wireless Gaming Headset",
      "Mobile Phone (Spotify Connect)"
    ]
  });

  const [activePlaylistId, setActivePlaylistId] = useState<string>(initialPlaylist.id);

  // Advance playback timer when playing
  useEffect(() => {
    if (!state.isPlaying) return;

    const interval = setInterval(() => {
      setState((prev) => {
        if (!prev.isPlaying) return prev;
        const nextProgress = prev.progressMs + 1000;
        if (nextProgress >= prev.currentTrack.durationMs) {
          // Track ended, go to next track
          const currentPlaylist = SPOTIFY_PLAYLIST_PRESETS.find((p) => p.id === activePlaylistId) || SPOTIFY_PLAYLIST_PRESETS[0];
          const curIndex = currentPlaylist.tracks.findIndex((t) => t.id === prev.currentTrack.id);
          const nextIndex = (curIndex + 1) % currentPlaylist.tracks.length;
          return {
            ...prev,
            currentTrack: currentPlaylist.tracks[nextIndex],
            progressMs: 0
          };
        }
        return {
          ...prev,
          progressMs: nextProgress
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isPlaying, activePlaylistId]);

  const togglePlay = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const play = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: true }));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const nextTrack = useCallback(() => {
    const currentPlaylist = SPOTIFY_PLAYLIST_PRESETS.find((p) => p.id === activePlaylistId) || SPOTIFY_PLAYLIST_PRESETS[0];
    setState((prev) => {
      const curIndex = currentPlaylist.tracks.findIndex((t) => t.id === prev.currentTrack.id);
      let nextIndex = (curIndex + 1) % currentPlaylist.tracks.length;
      if (prev.shuffle) {
        nextIndex = Math.floor(Math.random() * currentPlaylist.tracks.length);
      }
      return {
        ...prev,
        currentTrack: currentPlaylist.tracks[nextIndex],
        progressMs: 0,
        isPlaying: true
      };
    });
  }, [activePlaylistId]);

  const previousTrack = useCallback(() => {
    const currentPlaylist = SPOTIFY_PLAYLIST_PRESETS.find((p) => p.id === activePlaylistId) || SPOTIFY_PLAYLIST_PRESETS[0];
    setState((prev) => {
      if (prev.progressMs > 4000) {
        // Rewind to start of track if played > 4s
        return { ...prev, progressMs: 0 };
      }
      const curIndex = currentPlaylist.tracks.findIndex((t) => t.id === prev.currentTrack.id);
      const prevIndex = (curIndex - 1 + currentPlaylist.tracks.length) % currentPlaylist.tracks.length;
      return {
        ...prev,
        currentTrack: currentPlaylist.tracks[prevIndex],
        progressMs: 0,
        isPlaying: true
      };
    });
  }, [activePlaylistId]);

  const seek = useCallback((progressMs: number) => {
    setState((prev) => ({ ...prev, progressMs: Math.max(0, Math.min(progressMs, prev.currentTrack.durationMs)) }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setState((prev) => ({ ...prev, volume: Math.max(0, Math.min(100, volume)), isMuted: false }));
  }, []);

  const toggleMute = useCallback(() => {
    setState((prev) => ({ ...prev, isMuted: !prev.isMuted }));
  }, []);

  const toggleShuffle = useCallback(() => {
    setState((prev) => ({ ...prev, shuffle: !prev.shuffle }));
  }, []);

  const cycleRepeat = useCallback(() => {
    setState((prev) => {
      const nextRepeat: SpotifyPlaybackState['repeat'] =
        prev.repeat === 'off' ? 'context' : prev.repeat === 'context' ? 'track' : 'off';
      return { ...prev, repeat: nextRepeat };
    });
  }, []);

  const setActiveDevice = useCallback((device: string) => {
    setState((prev) => ({ ...prev, activeDevice: device }));
  }, []);

  const loadPlaylist = useCallback((playlistId: string) => {
    const playlist = SPOTIFY_PLAYLIST_PRESETS.find((p) => p.id === playlistId);
    if (!playlist) return;
    setActivePlaylistId(playlistId);
    setState((prev) => ({
      ...prev,
      currentTrack: playlist.tracks[0],
      progressMs: 0,
      isPlaying: true
    }));
  }, []);

  const connectSpotifyAccount = useCallback((accessToken?: string, clientId?: string) => {
    setState((prev) => ({ ...prev, isConnected: true }));
    setIsConnectModalOpen(false);
  }, []);

  const disconnectSpotify = useCallback(() => {
    setState((prev) => ({ ...prev, isConnected: false, isPlaying: false }));
  }, []);

  return (
    <SpotifyContext.Provider
      value={{
        state,
        isVisible,
        isMinimized,
        setIsVisible,
        setIsMinimized,
        togglePlay,
        play,
        pause,
        nextTrack,
        previousTrack,
        seek,
        setVolume,
        toggleMute,
        toggleShuffle,
        cycleRepeat,
        setActiveDevice,
        loadPlaylist,
        connectSpotifyAccount,
        disconnectSpotify,
        isConnectModalOpen,
        setIsConnectModalOpen
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};

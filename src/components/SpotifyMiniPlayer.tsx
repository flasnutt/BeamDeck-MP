import React, { useState, useRef, useEffect } from 'react';
import { useSpotify, SPOTIFY_PLAYLIST_PRESETS } from '../context/SpotifyContext';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Minimize2,
  Maximize2,
  X,
  Music,
  Laptop,
  Radio,
  ExternalLink,
  Disc,
  ListMusic,
  GripHorizontal,
  RotateCcw
} from 'lucide-react';

export const SpotifyMiniPlayer: React.FC = () => {
  const {
    state,
    isVisible,
    isMinimized,
    setIsVisible,
    setIsMinimized,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    loadPlaylist,
    setIsConnectModalOpen
  } = useSpotify();

  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);

  // Dragging state
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initX: number; initY: number }>({
    startX: 0,
    startY: 0,
    initX: 16,
    initY: 0
  });

  const playerRef = useRef<HTMLDivElement>(null);

  // Set initial position safely once mounted
  useEffect(() => {
    if (position === null && typeof window !== 'undefined') {
      setPosition({
        x: 16,
        y: Math.max(20, window.innerHeight - (isMinimized ? 70 : 340))
      });
    }
  }, [position, isMinimized]);

  // Adjust on window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => {
        if (!prev) return null;
        const maxX = Math.max(10, window.innerWidth - (isMinimized ? 280 : 340));
        const maxY = Math.max(10, window.innerHeight - (isMinimized ? 60 : 350));
        return {
          x: Math.min(prev.x, maxX),
          y: Math.min(prev.y, maxY)
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMinimized]);

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag from handle or header, ignore buttons/sliders/inputs
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('a')) {
      return;
    }

    e.preventDefault();
    setIsDragging(true);

    const currentX = position ? position.x : 16;
    const currentY = position ? position.y : window.innerHeight - 340;

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: currentX,
      initY: currentY
    };

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    const boxWidth = isMinimized ? 280 : 320;
    const boxHeight = isMinimized ? 50 : 330;

    const newX = Math.max(10, Math.min(window.innerWidth - boxWidth, dragStartRef.current.initX + deltaX));
    const newY = Math.max(10, Math.min(window.innerHeight - boxHeight, dragStartRef.current.initY + deltaY));

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    }
  };

  const resetPosition = () => {
    setPosition({
      x: 16,
      y: Math.max(20, window.innerHeight - (isMinimized ? 70 : 340))
    });
  };

  if (!isVisible) return null;

  // Format mm:ss
  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = Math.min(100, (state.progressMs / state.currentTrack.durationMs) * 100);

  const handleSeekClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    seek(ratio * state.currentTrack.durationMs);
  };

  const currentX = position?.x ?? 16;
  const currentY = position?.y ?? (typeof window !== 'undefined' ? window.innerHeight - 340 : 500);

  // Minimized Sleek Pill Bar (Draggable across the screen)
  if (isMinimized) {
    return (
      <div
        ref={playerRef}
        style={{ left: `${currentX}px`, top: `${currentY}px` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`fixed z-40 flex items-center gap-2 px-3 py-2 rounded-full bg-neutral-900/95 backdrop-blur-md border shadow-2xl text-white text-xs select-none touch-none transition-shadow ${
          isDragging
            ? 'border-emerald-500 shadow-emerald-500/25 ring-2 ring-emerald-500/50 cursor-grabbing'
            : 'border-neutral-700/80 hover:border-emerald-500/50 cursor-grab'
        }`}
        role="region"
        aria-label="Spotify Mini Controller (Draggable Pill)"
      >
        {/* Drag Grip Handle */}
        <div className="text-neutral-500 hover:text-neutral-300 pr-0.5" title="Click & Drag to reposition">
          <GripHorizontal className="w-3.5 h-3.5" />
        </div>

        {/* Animated green Spotify icon / equalizer */}
        <div className="relative w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <Music className={`w-3.5 h-3.5 ${state.isPlaying ? 'animate-pulse text-emerald-400' : 'text-neutral-400'}`} />
        </div>

        {/* Track Title */}
        <div
          onClick={() => setIsMinimized(false)}
          className="truncate max-w-[120px] sm:max-w-[160px] cursor-pointer"
          title={`${state.currentTrack.title} - ${state.currentTrack.artist} (Click to expand)`}
        >
          <span className="font-bold text-[11px] text-white truncate block">
            {state.currentTrack.title}
          </span>
          <span className="text-[10px] text-neutral-400 truncate block">
            {state.currentTrack.artist}
          </span>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={previousTrack}
            className="p-1 text-neutral-400 hover:text-white transition"
            aria-label="Previous track"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            className="w-6 h-6 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition shadow-sm"
            aria-label={state.isPlaying ? 'Pause Spotify' : 'Play Spotify'}
          >
            {state.isPlaying ? (
              <Pause className="w-3 h-3 fill-current" />
            ) : (
              <Play className="w-3 h-3 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={nextTrack}
            className="p-1 text-neutral-400 hover:text-white transition"
            aria-label="Next track"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Expand & Close */}
        <div className="flex items-center gap-1 border-l border-neutral-700 pl-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="p-1 text-neutral-400 hover:text-white transition"
            title="Expand Spotify Controller"
            aria-label="Expand Spotify Controller"
          >
            <Maximize2 className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="p-1 text-neutral-500 hover:text-neutral-300 transition"
            title="Hide Spotify Controller"
            aria-label="Hide Spotify Controller"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  // Expanded Floating Draggable Player Box
  return (
    <div
      ref={playerRef}
      style={{ left: `${currentX}px`, top: `${currentY}px` }}
      className={`fixed z-40 w-80 rounded-2xl bg-neutral-950/95 backdrop-blur-md border shadow-2xl overflow-hidden text-white transition-shadow select-none touch-none ${
        isDragging
          ? 'border-emerald-500 ring-2 ring-emerald-500/40 shadow-emerald-500/20'
          : 'border-neutral-800 shadow-2xl'
      }`}
      role="region"
      aria-label="Spotify BeamDeck Controller (Draggable)"
    >
      {/* Top Bar with Drag Handle */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`px-3.5 py-2.5 bg-neutral-900/90 border-b border-neutral-800/80 flex items-center justify-between transition-colors ${
          isDragging ? 'cursor-grabbing bg-neutral-800/90' : 'cursor-grab hover:bg-neutral-900'
        }`}
        title="Click and drag anywhere on this header bar to move the Spotify player"
      >
        <div className="flex items-center gap-2">
          {/* Drag indicator grip */}
          <GripHorizontal className="w-3.5 h-3.5 text-neutral-500" />
          {/* Spotify Green Logo Icon */}
          <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-black">
            <Radio className="w-2.5 h-2.5 stroke-[3]" />
          </div>
          <span className="text-[11px] font-extrabold tracking-wide text-neutral-200 uppercase">
            Spotify <span className="text-emerald-400">Connect</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5" onPointerDown={(e) => e.stopPropagation()}>
          {/* Reset position icon */}
          <button
            type="button"
            onClick={resetPosition}
            className="p-1 rounded text-neutral-400 hover:text-white transition"
            title="Reset position to bottom-left corner"
            aria-label="Reset position"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          {/* Playlist selector toggle */}
          <button
            type="button"
            onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
            className={`p-1 rounded text-xs transition ${
              showPlaylistMenu
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="Switch Driving Playlist"
            aria-label="Driving Playlists"
          >
            <ListMusic className="w-3.5 h-3.5" />
          </button>

          {/* Minimize button */}
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-1 text-neutral-400 hover:text-white rounded transition"
            title="Minimize to Pill"
            aria-label="Minimize Spotify Controller"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>

          {/* Hide button */}
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="p-1 text-neutral-400 hover:text-white rounded transition"
            title="Close Spotify widget"
            aria-label="Close Spotify widget"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Playlist Selector Dropdown */}
      {showPlaylistMenu && (
        <div className="p-2 bg-neutral-900 border-b border-neutral-800 space-y-1 text-xs">
          <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider px-2 py-0.5">
            BeamNG Driving Playlists
          </div>
          {SPOTIFY_PLAYLIST_PRESETS.map((pl) => (
            <button
              key={pl.id}
              type="button"
              onClick={() => {
                loadPlaylist(pl.id);
                setShowPlaylistMenu(false);
              }}
              className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-neutral-800 text-[11px] flex items-center justify-between text-neutral-300 hover:text-white transition"
            >
              <div className="truncate">
                <div className="font-semibold">{pl.name}</div>
                <div className="text-[10px] text-neutral-500">{pl.genre}</div>
              </div>
              <Disc className="w-3 h-3 text-emerald-400 shrink-0" />
            </button>
          ))}
        </div>
      )}

      {/* Track Info & Artwork */}
      <div className="p-3.5 flex items-center gap-3">
        {/* Album Art with Equalizer bars when playing */}
        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-800 shrink-0 shadow-md">
          <img
            src={state.currentTrack.albumArt}
            alt={state.currentTrack.album}
            className="w-full h-full object-cover"
          />
          {state.isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5">
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
            </div>
          )}
        </div>

        {/* Titles */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-xs text-white truncate" title={state.currentTrack.title}>
            {state.currentTrack.title}
          </div>
          <div className="text-[11px] text-neutral-400 truncate mt-0.5" title={state.currentTrack.artist}>
            {state.currentTrack.artist}
          </div>
          <div className="text-[10px] text-neutral-500 truncate" title={state.currentTrack.album}>
            {state.currentTrack.album}
          </div>
        </div>
      </div>

      {/* Scrub Bar & Times */}
      <div className="px-3.5 space-y-1">
        <div
          onClick={handleSeekClick}
          className="w-full h-1.5 bg-neutral-800 rounded-full cursor-pointer relative overflow-hidden group hover:h-2 transition-all"
        >
          <div
            className="h-full bg-emerald-500 group-hover:bg-emerald-400 rounded-full transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-neutral-400">
          <span>{formatTime(state.progressMs)}</span>
          <span>{formatTime(state.currentTrack.durationMs)}</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="p-3.5 pt-2 flex items-center justify-between">
        {/* Shuffle */}
        <button
          type="button"
          onClick={toggleShuffle}
          className={`p-1.5 rounded transition ${
            state.shuffle ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-300'
          }`}
          title="Shuffle"
          aria-label="Toggle shuffle"
        >
          <Shuffle className="w-3.5 h-3.5" />
        </button>

        {/* Previous */}
        <button
          type="button"
          onClick={previousTrack}
          className="p-1.5 text-neutral-300 hover:text-white transition"
          title="Previous Track"
          aria-label="Previous track"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* Play / Pause */}
        <button
          type="button"
          onClick={togglePlay}
          className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center transition shadow-lg shadow-emerald-500/25 active:scale-95"
          aria-label={state.isPlaying ? 'Pause Spotify' : 'Play Spotify'}
        >
          {state.isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current translate-x-0.5" />
          )}
        </button>

        {/* Next */}
        <button
          type="button"
          onClick={nextTrack}
          className="p-1.5 text-neutral-300 hover:text-white transition"
          title="Next Track"
          aria-label="Next track"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        {/* Repeat */}
        <button
          type="button"
          onClick={cycleRepeat}
          className={`p-1.5 rounded transition ${
            state.repeat !== 'off' ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-300'
          }`}
          title={`Repeat: ${state.repeat}`}
          aria-label={`Cycle repeat mode (currently ${state.repeat})`}
        >
          {state.repeat === 'track' ? (
            <Repeat1 className="w-3.5 h-3.5" />
          ) : (
            <Repeat className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {/* Volume & Device Switcher Footer */}
      <div className="px-3.5 py-2 bg-neutral-900/60 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
        {/* Volume Slider */}
        <div className="flex items-center gap-1.5 w-32">
          <button
            type="button"
            onClick={toggleMute}
            className="hover:text-white transition"
            aria-label={state.isMuted ? 'Unmute' : 'Mute'}
          >
            {state.isMuted || state.volume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={state.isMuted ? 0 : state.volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-1 bg-neutral-800 accent-emerald-500 rounded-lg cursor-pointer"
            aria-label="Volume slider"
          />
        </div>

        {/* Device indicator */}
        <button
          type="button"
          onClick={() => setIsConnectModalOpen(true)}
          className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 truncate max-w-[130px]"
          title="Connected Device / Account Settings"
        >
          <Laptop className="w-3 h-3 shrink-0" />
          <span className="truncate">{state.activeDevice.split(' ')[0]}</span>
        </button>
      </div>
    </div>
  );
};

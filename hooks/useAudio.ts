'use client';

import { useRef, useCallback, useEffect } from 'react';

interface AudioOptions {
  volume?: number;
  loop?: boolean;
}

// Global audio registry (singleton across components)
const audioInstances: Map<string, HTMLAudioElement> = new Map();

export function useAudio() {
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  const playBGM = useCallback((src: string, options: AudioOptions = {}) => {
    if (bgmRef.current) {
      bgmRef.current.pause();
    }
    const audio = new Audio(src);
    audio.loop = options.loop ?? true;
    audio.volume = options.volume ?? 0.4;
    audio.play().catch(() => {
      // Autoplay blocked — user interaction required (expected on first load)
    });
    bgmRef.current = audio;
  }, []);

  const stopBGM = useCallback(() => {
    bgmRef.current?.pause();
    bgmRef.current = null;
  }, []);

  const toggleBGM = useCallback(() => {
    if (!bgmRef.current) return;
    if (bgmRef.current.paused) {
      bgmRef.current.play().catch(() => {});
    } else {
      bgmRef.current.pause();
    }
  }, []);

  const playSFX = useCallback((src: string, options: AudioOptions = {}) => {
    // Reuse or create instance per src key
    let audio = audioInstances.get(src);
    if (!audio) {
      audio = new Audio(src);
      audioInstances.set(src, audio);
    }
    audio.volume = options.volume ?? 0.6;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }, []);

  // Cleanup BGM on unmount
  useEffect(() => {
    return () => {
      bgmRef.current?.pause();
    };
  }, []);

  return { playBGM, stopBGM, toggleBGM, playSFX };
}

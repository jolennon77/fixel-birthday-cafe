'use client';

import { useCallback } from 'react';

interface AudioOptions {
  volume?: number;
  loop?: boolean;
}

// Global audio registry (singleton across components)
const audioInstances: Map<string, HTMLAudioElement> = new Map();

// BGM은 여러 컴포넌트(입장화면, 주크박스 등)에서 같은 트랙 하나를 공유 재생해야 하므로
// 훅 인스턴스별 ref가 아닌 모듈 스코프 싱글턴으로 관리한다.
let bgmAudio: HTMLAudioElement | null = null;

export function useAudio() {
  const playBGM = useCallback((src: string, options: AudioOptions = {}) => {
    bgmAudio?.pause();
    const audio = new Audio(src);
    audio.loop = options.loop ?? true;
    audio.volume = options.volume ?? 0.4;
    audio.play().catch(() => {
      // Autoplay blocked — user interaction required (expected on first load)
    });
    bgmAudio = audio;
  }, []);

  const stopBGM = useCallback(() => {
    bgmAudio?.pause();
    bgmAudio = null;
  }, []);

  const toggleBGM = useCallback(() => {
    if (!bgmAudio) return;
    if (bgmAudio.paused) {
      bgmAudio.play().catch(() => {});
    } else {
      bgmAudio.pause();
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

  return { playBGM, stopBGM, toggleBGM, playSFX };
}

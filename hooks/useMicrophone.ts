'use client';

import { useRef, useCallback, useState } from 'react';

interface UseMicrophoneOptions {
  threshold?: number; // dB threshold (0-100), default 60
  onThresholdReached?: () => void;
}

export function useMicrophone({ threshold = 60, onThresholdReached }: UseMicrophoneOptions = {}) {
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const [isListening, setIsListening] = useState(false);
  const [volume, setVolume] = useState(0);
  const firedRef = useRef(false);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      firedRef.current = false;
      setIsListening(true);

      const data = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        const normalized = Math.min(100, (avg / 255) * 100 * 2.5);
        setVolume(normalized);

        if (!firedRef.current && normalized >= threshold) {
          firedRef.current = true;
          onThresholdReached?.();
        }

        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // Microphone permission denied
      setIsListening(false);
    }
  }, [threshold, onThresholdReached]);

  const stopListening = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    analyserRef.current = null;
    setIsListening(false);
    setVolume(0);
  }, []);

  return { startListening, stopListening, isListening, volume };
}

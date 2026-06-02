'use client';

import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';
import { useAudio } from '@/hooks/useAudio';
import { BGM_TRACKS } from '@/data/config';

export function JukeboxModal() {
  const activeModal   = useCafeStore((s) => s.activeModal);
  const currentBgmId  = useCafeStore((s) => s.currentBgmId);
  const setCurrentBgm = useCafeStore((s) => s.setCurrentBgm);
  const { playBGM, stopBGM } = useAudio();

  const handleSelect = (id: string, src: string) => {
    if (currentBgmId === id) {
      stopBGM();
      setCurrentBgm(null);
    } else {
      playBGM(src, { loop: true, volume: 0.35 });
      setCurrentBgm(id);
    }
  };

  return (
    <Modal isOpen={activeModal === 'jukebox'} maxWidth="max-w-xs">
      <div className="p-5">
        <div className="text-center mb-4">
          <p style={{ fontSize: '2rem', lineHeight: 1, marginBottom: '6px' }}>🎵</p>
          <h2 className="font-pixel" style={{ fontSize: '0.55rem', color: '#3d2310' }}>★ 주크박스 ★</h2>
          <p style={{ fontSize: '0.65rem', color: '#6b4423', marginTop: '4px' }}>BGM을 선택하세요</p>
        </div>

        <div className="space-y-2">
          {BGM_TRACKS.map((track) => {
            const isPlaying = currentBgmId === track.id;
            return (
              <button
                key={track.id}
                onClick={() => handleSelect(track.id, track.src)}
                className="w-full flex items-center gap-3 px-3 py-2.5"
                style={{
                  background: isPlaying ? '#fef08a' : '#e8d0a0',
                  border: `3px solid ${isPlaying ? '#a16207' : '#3d2310'}`,
                  boxShadow: isPlaying
                    ? 'inset 2px 2px 0 #fdf4d0, inset -2px -2px 0 #a07000, 2px 2px 0 rgba(0,0,0,0.3)'
                    : 'inset 2px 2px 0 #f5e8c0, inset -2px -2px 0 #c9a87c, 2px 2px 0 rgba(0,0,0,0.3)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{track.emoji}</span>
                <span style={{ flex: 1, fontSize: '0.7rem', color: '#3d2310' }}>{track.label}</span>
                <span
                  className="font-pixel"
                  style={{ fontSize: '0.45rem', color: isPlaying ? '#7a4f00' : '#8a6040' }}
                >
                  {isPlaying ? '▶ 재생 중' : '재생'}
                </span>
              </button>
            );
          })}
        </div>

        {currentBgmId && (
          <button
            onClick={() => { stopBGM(); setCurrentBgm(null); }}
            className="px-btn px-btn-red w-full mt-3"
          >
            ■ 정지
          </button>
        )}

        <p className="text-center mt-3 font-pixel" style={{ fontSize: '0.4rem', color: '#a08060' }}>
          /public/audio/ 에 mp3 추가
        </p>
      </div>
    </Modal>
  );
}

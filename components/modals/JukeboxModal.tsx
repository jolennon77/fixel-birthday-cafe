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
        <div className="text-center mb-5">
          <div className="text-3xl mb-1">🎵</div>
          <h2 className="font-bold text-sm">카페 주크박스</h2>
          <p className="text-xs text-gray-400 mt-0.5">BGM을 선택하세요</p>
        </div>

        <div className="space-y-2">
          {BGM_TRACKS.map((track) => {
            const isPlaying = currentBgmId === track.id;
            return (
              <button
                key={track.id}
                onClick={() => handleSelect(track.id, track.src)}
                className={[
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all',
                  isPlaying
                    ? 'border-indigo-400 bg-indigo-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 active:scale-[0.98]',
                ].join(' ')}
              >
                <span className="text-xl">{track.emoji}</span>
                <span className="flex-1 text-sm font-medium text-left">{track.label}</span>
                <span className="text-xs">
                  {isPlaying ? (
                    <span className="text-indigo-500 font-bold">▶ 재생 중</span>
                  ) : (
                    <span className="text-gray-400">재생</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {currentBgmId && (
          <button
            onClick={() => { stopBGM(); setCurrentBgm(null); }}
            className="mt-3 w-full py-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            ■ 정지
          </button>
        )}

        <p className="text-center text-[10px] text-gray-300 mt-3">
          /public/audio/ 폴더에 mp3 파일을 추가하세요
        </p>
      </div>
    </Modal>
  );
}

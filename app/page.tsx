'use client';

import { useCafeStore } from '@/store/cafeStore';
import { CafeScene } from '@/components/cafe/CafeScene';
import { EntranceScreen } from '@/components/EntranceScreen';

export default function Home() {
  const playerInfo = useCafeStore((s) => s.playerInfo);

  return (
    <>
      <CafeScene />
      {!playerInfo && <EntranceScreen />}
    </>
  );
}

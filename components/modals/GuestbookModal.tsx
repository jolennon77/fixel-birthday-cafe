'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCafeStore } from '@/store/cafeStore';
import { Modal } from '@/components/ui/Modal';
import { BIRTHDAY_DATE } from '@/data/config';
import { supabase } from '@/lib/supabase';

const RIBBON_OPTIONS = [
  { emoji: '🎀', color: { bg: '#fce8f0', border: '#b87a94' } },
  { emoji: '🌟', color: { bg: '#fdf8e4', border: '#b8992a' } },
  { emoji: '🍀', color: { bg: '#e8f5ec', border: '#6fa07a' } },
  { emoji: '🔮', color: { bg: '#ede8f8', border: '#8a72b8' } },
];

const FIRST_YEAR      = BIRTHDAY_DATE.getFullYear();
const ADMIN_PW        = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? '';
const EASTER_EGG_HITS = 10;

interface Message {
  id: string;
  message: string;
  nickname: string;
  color: { bg: string; border: string };
  emoji: string;
  date: string;
}

export function GuestbookModal() {
  const activeModal  = useCafeStore((s) => s.activeModal);
  const playerInfo   = useCafeStore((s) => s.playerInfo);

  const currentYear                         = new Date().getFullYear();
  const [year, setYear]                     = useState(Math.max(FIRST_YEAR, currentYear));
  const [messages, setMessages]             = useState<Message[]>([]);
  const [loading, setLoading]               = useState(false);
  const [input, setInput]                   = useState('');
  const [submitted, setSubmitted]           = useState(false);
  const [selectedRibbon, setSelectedRibbon] = useState(RIBBON_OPTIONS[0]);
  const [dropdownOpen, setDropdownOpen]     = useState(false);

  // 어드민
  const [adminMode, setAdminMode]           = useState(false);
  const [eggCount, setEggCount]             = useState(0);
  const [showPwPrompt, setShowPwPrompt]     = useState(false);
  const [pwInput, setPwInput]               = useState('');
  const [pwError, setPwError]               = useState(false);
  const eggTimer                            = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 세션 복원
  useEffect(() => {
    if (sessionStorage.getItem('gb_admin') === '1') setAdminMode(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeModal !== 'guestbook') return;
    fetchMessages(year);
  }, [year, activeModal]);

  const fetchMessages = async (y: number) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('guestbook')
      .select('id, message, nickname, emoji, bg, border, created_at')
      .eq('year', y)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMessages(data.map((row) => ({
        id:       row.id,
        message:  row.message,
        nickname: row.nickname ?? '익명',
        emoji:    row.emoji,
        color:    { bg: row.bg, border: row.border },
        date:     row.created_at.slice(0, 10).replace(/-/g, '.'),
      })));
    }
    setLoading(false);
  };

  // 이스터에그: 나무 클릭 10회
  const handleTreeClick = () => {
    if (adminMode) return;
    if (eggTimer.current) clearTimeout(eggTimer.current);
    eggTimer.current = setTimeout(() => setEggCount(0), 2000);

    setEggCount((prev) => {
      const next = prev + 1;
      if (next >= EASTER_EGG_HITS) {
        setShowPwPrompt(true);
        return 0;
      }
      return next;
    });
  };

  const handleAdminLogin = () => {
    if (pwInput === ADMIN_PW) {
      setAdminMode(true);
      sessionStorage.setItem('gb_admin', '1');
      setShowPwPrompt(false);
      setPwInput('');
      setPwError(false);
    } else {
      setPwError(true);
      setTimeout(() => setPwError(false), 1200);
    }
  };

  const handleAdminLogout = () => {
    setAdminMode(false);
    sessionStorage.removeItem('gb_admin');
  };

  const canPrev = year > FIRST_YEAR;
  const canNext = year < currentYear;

  const goYear = (delta: number) => {
    const next = year + delta;
    if (next < FIRST_YEAR || next > currentYear) return;
    setYear(next);
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const payload = {
      year,
      message:  input.trim(),
      nickname: playerInfo?.nickname?.trim() || '익명',
      emoji:    selectedRibbon.emoji,
      bg:       selectedRibbon.color.bg,
      border:   selectedRibbon.color.border,
    };

    const { data, error } = await supabase
      .from('guestbook')
      .insert(payload)
      .select('id, message, nickname, emoji, bg, border, created_at')
      .single();

    if (!error && data) {
      setMessages((prev) => [{
        id:       data.id,
        message:  data.message,
        nickname: data.nickname ?? '익명',
        emoji:    data.emoji,
        color:    { bg: data.bg, border: data.border },
        date:     data.created_at.slice(0, 10).replace(/-/g, '.'),
      }, ...prev]);
    }

    setInput('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <Modal isOpen={activeModal === 'guestbook'} maxWidth="max-w-2xl">
      <div className="flex" style={{ height: '400px' }}>

        {/* ── 왼쪽: 나무 이미지 (세로 모드 소형 화면에서 숨김) ── */}
        <div
          className="hidden sm:block flex-shrink-0"
          onClick={handleTreeClick}
          style={{
            width: '200px',
            position: 'relative',
            background: 'linear-gradient(to bottom, #c8eaf8 0%, #d8f0c0 70%, #c8a870 100%)',
            borderRight: '3px solid #3d2310',
            cursor: adminMode ? 'default' : 'pointer',
          }}
        >
          <Image
            src="/tree.png"
            alt="방명록 나무"
            fill
            unoptimized
            className="pixel-crisp"
            style={{
              objectFit: 'contain',
              objectPosition: 'bottom',
              imageRendering: 'pixelated',
            }}
            priority
          />

          {/* 이스터에그 카운트 힌트 (선택적) */}
          {eggCount > 0 && eggCount < EASTER_EGG_HITS && (
            <div style={{
              position: 'absolute', top: 6, right: 6,
              fontSize: '0.55rem', color: '#3d2310',
              background: 'rgba(255,255,255,0.7)',
              padding: '2px 5px',
              border: '2px solid #3d2310',
            }}>
              {eggCount}/{EASTER_EGG_HITS}
            </div>
          )}
        </div>

        {/* ── 오른쪽: 컨텐츠 ── */}
        <div className="flex-1 flex flex-col min-w-0" style={{ position: 'relative' }}>

          {/* 비밀번호 프롬프트 오버레이 */}
          <AnimatePresence>
            {showPwPrompt && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute', inset: 0, zIndex: 10,
                  background: 'rgba(61,35,16,0.55)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  style={{
                    background: '#fdf6e8',
                    border: '3px solid #3d2310',
                    padding: '20px',
                    width: '220px',
                    boxShadow: '4px 4px 0 rgba(0,0,0,0.25)',
                  }}
                >
                  <p style={{ fontSize: '0.7rem', color: '#3d2310', marginBottom: '10px', textAlign: 'center' }}>
                    🌳 관리자 비밀번호
                  </p>
                  <input
                    type="password"
                    value={pwInput}
                    onChange={(e) => setPwInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                    autoFocus
                    className="px-input"
                    style={{
                      width: '100%', marginBottom: '8px',
                      outline: pwError ? '2px solid #b87a94' : undefined,
                    }}
                    placeholder="비밀번호 입력"
                  />
                  {pwError && (
                    <p style={{ fontSize: '0.6rem', color: '#b87a94', marginBottom: '6px', textAlign: 'center' }}>
                      비밀번호가 틀렸어요
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button className="px-btn flex-1" onClick={handleAdminLogin}>확인</button>
                    <button
                      className="px-btn flex-1"
                      onClick={() => { setShowPwPrompt(false); setPwInput(''); setPwError(false); }}
                    >
                      취소
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 년도 네비게이션 */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: '3px solid #3d2310', background: '#e8d0a0', flexShrink: 0 }}
          >
            <button
              onClick={() => goYear(-1)}
              disabled={!canPrev}
              className="px-btn px-btn-amber"
              style={{ padding: '4px 10px', opacity: canPrev ? 1 : 0.3 }}
            >
              ◀
            </button>

            <div className="text-center">
              <p style={{ fontSize: '0.65rem', color: '#3d2310' }}>
                {year}년 방명록
                {adminMode && (
                  <button
                    onClick={handleAdminLogout}
                    style={{ marginLeft: '6px', fontSize: '0.55rem', color: '#b87a94', cursor: 'pointer' }}
                  >
                    [관리자 ✕]
                  </button>
                )}
              </p>
              <p style={{ fontSize: '0.65rem', color: '#6b4423', marginTop: '3px' }}>
                쪽지 {messages.length}개가 달려있어요
              </p>
            </div>

            <button
              onClick={() => goYear(1)}
              disabled={!canNext}
              className="px-btn px-btn-amber"
              style={{ padding: '4px 10px', opacity: canNext ? 1 : 0.3 }}
            >
              ▶
            </button>
          </div>

          {/* 쪽지 리스트 */}
          <div className="flex-1 px-3 py-2 overflow-y-auto">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center h-full"
                >
                  <p style={{ fontSize: '0.72rem', color: '#8a6040' }}>불러오는 중...</p>
                </motion.div>
              ) : messages.length === 0 ? (
                <motion.div
                  key={`empty-${year}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full py-10"
                >
                  <span style={{ fontSize: '2rem', opacity: 0.35 }}>🌱</span>
                  <p style={{ fontSize: '0.72rem', color: '#8a6040', marginTop: '10px' }}>
                    {year}년 방명록은 아직 비어있어요
                  </p>
                  <p style={{ fontSize: '0.62rem', color: '#a08060', marginTop: '4px' }}>
                    첫 번째 쪽지를 달아보세요!
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={`list-${year}`}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.16 }}
                  className="space-y-2 py-1"
                >
                  {messages.map((m, i) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i < 5 ? i * 0.04 : 0 }}
                      className="flex items-start gap-2 p-2.5"
                      style={{
                        background: m.color.bg,
                        border: `3px solid ${m.color.border}`,
                        boxShadow: `inset 1px 1px 0 rgba(255,255,255,0.55), 2px 2px 0 rgba(0,0,0,0.18)`,
                      }}
                    >
                      <span style={{ fontSize: '0.9rem', flexShrink: 0, lineHeight: 1, marginTop: '2px' }}>
                        {m.emoji ?? '🎀'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: '0.8rem', color: '#1a0e00', lineHeight: 1.5, wordBreak: 'break-word' }}>
                          {m.message}
                        </p>
                        <p style={{ fontSize: '0.6rem', color: m.color.border, marginTop: '4px', opacity: 0.8 }}>
                          {adminMode ? m.nickname : '익명'} · {m.date}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 입력 영역 */}
          <div
            className="px-3 pb-3 pt-2.5"
            style={{ borderTop: '3px solid #3d2310', flexShrink: 0 }}
          >
            {submitted ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-2"
                style={{ fontSize: '0.65rem', color: '#166534' }}
              >
                {selectedRibbon.emoji} {year}년 방명록에 쪽지가 달렸어요!
              </motion.p>
            ) : (
              <>
                {/* 이모지 + 메시지 + 달기 */}
                <div className="flex gap-2">

                  {/* 이모지 드롭다운 */}
                  <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
                    <button
                      onClick={() => setDropdownOpen((v) => !v)}
                      style={{
                        height: '100%',
                        minWidth: '52px',
                        padding: '0 6px',
                        border: `3px solid ${selectedRibbon.color.border}`,
                        background: selectedRibbon.color.bg,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '1rem',
                      }}
                    >
                      {selectedRibbon.emoji}
                      <span style={{ fontSize: '0.5rem', color: selectedRibbon.color.border, lineHeight: 1 }}>
                        {dropdownOpen ? '▲' : '▼'}
                      </span>
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 4 }}
                          transition={{ duration: 0.1 }}
                          style={{
                            position: 'absolute',
                            bottom: 'calc(100% + 6px)',
                            left: 0,
                            border: '3px solid #3d2310',
                            background: '#fdf6e8',
                            zIndex: 50,
                            minWidth: '52px',
                            boxShadow: '3px 3px 0 rgba(0,0,0,0.18)',
                          }}
                        >
                          {RIBBON_OPTIONS.map((opt) => (
                            <button
                              key={opt.emoji}
                              onClick={() => { setSelectedRibbon(opt); setDropdownOpen(false); }}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                width: '100%',
                                padding: '6px 10px',
                                fontSize: '0.85rem',
                                background: selectedRibbon.emoji === opt.emoji ? opt.color.bg : 'transparent',
                                borderBottom: '2px solid #e8d0a0',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                color: '#3d2310',
                              }}
                            >
                              <span style={{ fontSize: '1rem' }}>{opt.emoji}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* 텍스트 입력 */}
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value.slice(0, 40))}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder={`메세지를 남겨주세요. (최대 40자)`}
                    className="px-input flex-1"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!input.trim()}
                    className="px-btn"
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    남기기
                  </button>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </Modal>
  );
}

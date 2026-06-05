// components/Lightbox.tsx

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type Item = { title: string; imageUrl: string };

type LightboxProps = {
  items: Item[];
  index: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function Lightbox({ items, index, onClose, onNext, onPrev }: LightboxProps) {
  const [mounted, setMounted] = useState(false);
  const safeIndex = items.length > 0 ? Math.min(Math.max(index, 0), items.length - 1) : 0;
  const item = items[safeIndex];

  // lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // portal ready
  useEffect(() => setMounted(true), []);

  // keyboard: Esc / arrows
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPrev();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, onNext, onPrev]);

  // preload neighbors (use the DOM Image constructor explicitly)
  useEffect(() => {
    if (typeof window === 'undefined' || items.length < 2) return;
    const nextIdx = (safeIndex + 1) % items.length;
    const prevIdx = (safeIndex - 1 + items.length) % items.length;
    const n = new window.Image();
    n.src = items[nextIdx].imageUrl;
    const p = new window.Image();
    p.src = items[prevIdx].imageUrl;
  }, [safeIndex, items]);

  // touch swipe
  const startX = useRef(0);
  const deltaX = useRef(0);
  const threshold = 40;
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    deltaX.current = e.touches[0].clientX - startX.current;
  };
  const onTouchEnd = () => {
    if (deltaX.current > threshold) onPrev();
    else if (deltaX.current < -threshold) onNext();
  };

  // simple focus trap across 3 buttons
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
  }, []);
  function handleTrap(e: React.KeyboardEvent) {
    if (e.key !== 'Tab') return;
    const focusables = [prevRef.current, closeRef.current, nextRef.current].filter(
      Boolean,
    ) as HTMLElement[];
    const i = focusables.indexOf(document.activeElement as HTMLElement);
    if (e.shiftKey) {
      if (i <= 0) {
        e.preventDefault();
        focusables[focusables.length - 1].focus();
      }
    } else {
      if (i === focusables.length - 1) {
        e.preventDefault();
        focusables[0].focus();
      }
    }
  }

  if (!item) return null;

  const overlay = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title || 'Photo'}. Photo ${safeIndex + 1} of ${items.length}.`}
      className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-sm"
      onKeyDown={handleTrap}
      onClick={onClose}
    >
      <div
        className="absolute inset-0 flex items-center justify-center px-4"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative max-h-[85vh] w-full max-w-6xl">
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
            <img
              src={item.imageUrl}
              alt={item.title || 'Gallery photo'}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 rounded-b-2xl bg-gradient-to-t from-black/60 to-transparent p-4">
              <div className="pointer-events-auto">
                <p className="text-sm font-semibold text-white md:text-base">{item.title}</p>
                <p className="text-xs text-white/70">
                  {safeIndex + 1} / {items.length}
                </p>
              </div>
            </div>
          </div>

          <button
            ref={prevRef}
            aria-label="Previous image"
            onClick={onPrev}
            className="group absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-white/10 p-3 backdrop-blur transition hover:bg-white/20 focus:ring-2 focus:ring-white/40 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 md:h-7 md:w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            ref={nextRef}
            aria-label="Next image"
            onClick={onNext}
            className="group absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-white/10 p-3 backdrop-blur transition hover:bg-white/20 focus:ring-2 focus:ring-white/40 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 md:h-7 md:w-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            ref={closeRef}
            aria-label="Close"
            onClick={onClose}
            className="absolute top-2 right-2 rounded-full bg-white/10 p-2 backdrop-blur transition hover:bg-white/20 focus:ring-2 focus:ring-white/40 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 md:h-6 md:w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return mounted ? createPortal(overlay, document.body) : null;
}

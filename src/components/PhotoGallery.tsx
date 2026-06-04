
import Image from '@/lib/Image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Lightbox from './Lightbox';

export type PhotoItem = {
  title: string;
  imageUrl: string; // full-size URL (used by lightbox)
};

type PhotoGalleryProps = {
  items: PhotoItem[];
};

function withWidthParam(src: string, width: number): string {
  try {
    const u = new URL(src);
    u.searchParams.set('width', String(width));
    return u.toString();
  } catch {
    return src + (src.includes('?') ? `&width=${width}` : `?width=${width}`);
  }
}

export default function PhotoGallery({ items }: PhotoGalleryProps) {
  const safeItems = Array.isArray(items) ? items.filter((item) => item?.imageUrl) : [];
  const [isOpen, setIsOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // Build 768px thumbnails
  const thumbs = useMemo(
    () => safeItems.map((it) => ({ ...it, thumbUrl: withWidthParam(it.imageUrl, 768) })),
    [safeItems],
  );

  // Determine if lightbox should be enabled (desktop + precise pointer)
  const [canOpen, setCanOpen] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mqDesktop = window.matchMedia('(min-width: 768px)'); // md and up
    const mqFine = window.matchMedia('(pointer: fine)'); // mouse/trackpad

    const update = () => setCanOpen(mqDesktop.matches && mqFine.matches);
    update();

    mqDesktop.addEventListener?.('change', update);
    mqFine.addEventListener?.('change', update);
    return () => {
      mqDesktop.removeEventListener?.('change', update);
      mqFine.removeEventListener?.('change', update);
    };
  }, []);

  // Auto-close if user resizes into mobile/touch
  useEffect(() => {
    if (!canOpen && isOpen) setIsOpen(false);
  }, [canOpen, isOpen]);

  const openAt = useCallback(
    (i: number) => {
      if (!canOpen) return; // no-op on mobile/touch
      setIndex(i);
      setIsOpen(true);
    },
    [canOpen],
  );

  const close = useCallback(() => setIsOpen(false), []);
  const next = useCallback(() => setIndex((i) => (i + 1) % safeItems.length), [safeItems.length]);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + safeItems.length) % safeItems.length),
    [safeItems.length],
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onPop = () => setIsOpen(false);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {thumbs.map((p, i) => (
          <div key={p.imageUrl}>
            <button
              type="button"
              onClick={() => openAt(i)}
              aria-disabled={!canOpen}
              // transparent wrapper, edge-to-edge thumbs
              className={`group block w-full overflow-hidden rounded-xl border-0 bg-transparent p-0 focus:outline-none ${
                canOpen ? 'cursor-zoom-in' : 'cursor-default'
              }`}
            >
              <div className="relative aspect-video w-full">
                <Image
                  src={p.thumbUrl} // 768px-wide thumbnail
                  alt={`Photo: ${p.title}`}
                  fill
                  sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                  className="object-cover"
                />
                {/* subtle hover only matters on desktop */}
                <div className="pointer-events-none absolute inset-0 bg-transparent transition group-hover:bg-black/10" />
              </div>
            </button>
            {p.title ? <h3 className="mt-3 text-center text-xl">{p.title}</h3> : null}
          </div>
        ))}
      </div>

      {isOpen && canOpen && (
        <Lightbox
          items={safeItems} // full-size URLs for the overlay
          index={index}
          onClose={close}
          onNext={next}
          onPrev={prev}
        />
      )}
    </>
  );
}

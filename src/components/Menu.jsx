
import { CaretDownIcon, ListIcon, XIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState } from 'react';

/* ---------------------- Mobile (hamburger) ---------------------- */
function MobileMenu({ items = [], currentPath = '' }) {
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef(null);

  // Flatten top-level + sub-links
  const flatLinks = useMemo(() => {
    const out = [];
    items.forEach((it) => {
      if (it?.url) out.push({ label: it.label, url: it.url });
      if (Array.isArray(it?.links))
        it.links.forEach((s) => out.push({ label: s.label, url: s.url }));
    });
    const seen = new Set();
    return out.filter((l) => (l.url && !seen.has(l.url) ? (seen.add(l.url), true) : false));
  }, [items]);

  // Close on ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Body scroll lock when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Focus first link when opening
  useEffect(() => {
    if (open && firstLinkRef.current) firstLinkRef.current.focus();
  }, [open]);

  const isActive = (href) => currentPath === href || (href && currentPath.startsWith(href + '/'));

  return (
    <>
      {/* Trigger (mobile only) */}
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-sm border-2 border-transparent p-2 text-2xl uppercase md:hidden"
        aria-label="Open menu"
        aria-controls="mobile-menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <ListIcon size={28} weight="bold" aria-hidden />
        <span className="sr-only">Open menu</span>
      </button>

      {/* Overlay + Panel (mobile only) */}
      <div className={`fixed inset-0 z-40 md:hidden ${open ? '' : 'pointer-events-none'}`}>
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
        {/* Slide-in panel */}
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile menu"
          className={`absolute inset-y-0 left-0 w-[min(90vw,26rem)] max-w-full transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} bg-[#0A1E1D] text-[#FBE2B6]`}
        >
          <div className="flex items-center justify-between border-b border-white/10 p-4">
            <span className="tracking-wide uppercase">Menu</span>
            <button
              type="button"
              className="p-2"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <XIcon size={24} weight="bold" aria-hidden />
            </button>
          </div>
          <nav className="px-2 py-2">
            {flatLinks.map((link, i) => (
              <Link
                key={`${link.label}-${link.url}-${i}`}
                to={link.url || '#'}
                ref={i === 0 ? firstLinkRef : null}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-4 py-3 text-xl tracking-wide uppercase ${isActive(link.url) ? 'font-bold' : 'opacity-90 hover:opacity-100'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}

/* ---------------------- Desktop (original) ---------------------- */
function DesktopMenu({ items = [], currentPath = '' }) {
  const [openIndex, setOpenIndex] = useState(-1);
  const navRef = useRef(null);
  const closeTimerRef = useRef(null);

  function open(i) {
    clearTimeout(closeTimerRef.current);
    setOpenIndex(i);
  }
  function closeSoon() {
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setOpenIndex(-1), 120);
  }
  function cancelClose() {
    clearTimeout(closeTimerRef.current);
  }

  // click-away + Escape
  useEffect(() => {
    function onDocDown(e) {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target)) setOpenIndex(-1);
    }
    function onKey(e) {
      if (e.key === 'Escape') setOpenIndex(-1);
    }
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('touchstart', onDocDown, { passive: true });
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('touchstart', onDocDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className="hidden justify-end gap-2 pr-4 text-2xl uppercase md:flex"
      aria-label="Main"
    >
      {items.map((item, i) => {
        const hasSubmenu = Array.isArray(item.links) && item.links.length > 0;
        const isActive =
          !!item.url && (currentPath === item.url || currentPath.startsWith(item.url + '/'));
        const isOpen = openIndex === i;

        return (
          <div
            key={`${item.label}-${i}`}
            className="relative"
            onMouseEnter={() => hasSubmenu && open(i)}
            onMouseLeave={() => hasSubmenu && closeSoon()}
          >
            {hasSubmenu ? (
              <>
                <button
                  type="button"
                  style={{ backgroundColor: 'transparent', color: 'inherit', borderColor: isOpen ? 'currentColor' : 'transparent' }}
                  className={`inline-flex items-center gap-1 rounded-sm border-2 p-2 pb-1 leading-[1] uppercase hover:!bg-transparent`}
                  aria-haspopup="menu"
                  aria-expanded={isOpen}
                  onClick={() => (isOpen ? setOpenIndex(-1) : open(i))}
                >
                  <span>{item.label}</span>
                  <CaretDownIcon
                    aria-hidden
                    size={16}
                    weight="bold"
                    className={`mb-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Always mounted submenu; visibility toggled via classes */}
                <div
                  role="menu"
                  aria-hidden={!isOpen}
                  className={`absolute top-full right-0 z-20 origin-top pt-2 transition duration-150 ${isOpen ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'}`}
                  onMouseEnter={cancelClose}
                  onMouseLeave={closeSoon}
                >
                  <div className="min-w-[220px] overflow-hidden rounded-lg bg-[#FBE2B6] text-[#0A1E1D] shadow-lg">
                    {item.links.map((sub, j) => (
                      <Link
                        key={`${sub.label}-${j}`}
                        to={sub.url}
                        role="menuitem"
                        className="block px-4 py-2 hover:bg-[#F1B136]"
                        onClick={() => setOpenIndex(-1)}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : item.url ? (
              <Link
                to={item.url}
                className={`inline-block rounded-sm border-2 p-2 pb-1 leading-[1] ${
                  isActive ? '' : 'border-transparent'
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <span className="inline-block cursor-default rounded-sm border-2 border-transparent p-2 pb-1 leading-[1] opacity-80 select-none">
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

/* ---------------------- Wrapper (exports both) ---------------------- */
export default function Menu({ items = [], currentPath = '' }) {
  return (
    <div className="flex items-center justify-end">
      <DesktopMenu items={items} currentPath={currentPath} />
      <MobileMenu items={items} currentPath={currentPath} />
    </div>
  );
}

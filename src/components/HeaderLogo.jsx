import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const HOME_LOGO = { src: '/img/logo-tan.png', width: 50, height: 62 };
const LONG_LOGO = { src: '/img/logo-tan-long.png', width: 192, height: 62 };

function preloadLogo(src) {
  const img = new Image();
  img.src = src;
}

export default function HeaderLogo({ isHome }) {
  const [loaded, setLoaded] = useState({});

  useEffect(() => {
    preloadLogo(HOME_LOGO.src);
    preloadLogo(LONG_LOGO.src);
  }, []);

  const markLoaded = (src) => {
    setLoaded((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
  };

  const handleImgRef = (src) => (el) => {
    if (el?.complete) markLoaded(src);
  };

  const active = isHome ? HOME_LOGO : LONG_LOGO;
  const showHome = isHome && loaded[HOME_LOGO.src];
  const showLong = !isHome && loaded[LONG_LOGO.src];

  const imgStyle = (logo, visible) => ({
    width: logo.width,
    height: logo.height,
    opacity: visible ? 1 : 0,
    visibility: visible ? 'visible' : 'hidden',
  });

  return (
    <Link
      to="/"
      className="relative block shrink-0 md:pl-4"
      aria-label="Go to homepage"
      style={{ width: active.width, height: active.height }}
    >
      <img
        src={HOME_LOGO.src}
        alt="Home"
        width={HOME_LOGO.width}
        height={HOME_LOGO.height}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        onLoad={() => markLoaded(HOME_LOGO.src)}
        ref={handleImgRef(HOME_LOGO.src)}
        className="absolute top-0 left-0 max-w-none"
        style={imgStyle(HOME_LOGO, showHome)}
      />
      <img
        src={LONG_LOGO.src}
        alt="Home"
        width={LONG_LOGO.width}
        height={LONG_LOGO.height}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        onLoad={() => markLoaded(LONG_LOGO.src)}
        ref={handleImgRef(LONG_LOGO.src)}
        className="absolute top-0 left-0 max-w-none"
        style={imgStyle(LONG_LOGO, showLong)}
      />
    </Link>
  );
}

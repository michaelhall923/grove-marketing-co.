// components/TrustSection.jsx
import SpriteJellyfishBig from '@/components/SpriteJellyfishBig';
import Image from '@/lib/Image';

// Add/remove brand entries here
const BRANDS = [
  { src: '/img/brands/hilton.png', alt: 'Hilton Logo' },
  { src: '/img/brands/ksc.svg', alt: 'Kennedy Space Center Logo' },
  { src: '/img/brands/ussfhf.webp', alt: 'U.S. Space Force Historical Foundation Logo' },
  { src: '/img/brands/seadek.png', alt: 'SeaDek Logo' },
  { src: '/img/brands/patrick.svg', alt: 'Patrick Industries Logo' },
  { src: '/img/brands/woodbine.webp', alt: 'Woodbine Logo' },
  { src: '/img/brands/digital-brew.svg', alt: 'Digital Brew Logo' },
  { src: '/img/brands/indrio.svg', alt: 'Indrio Logo' },
  { src: '/img/brands/wyldr.svg', alt: 'Wyldr Logo' },
  // { src: "/img/brands/goldtone.svg", alt: "Gold Tone Logo" },
  // { src: "/img/brands/ramirez.png", alt: "Ramirez Guitars Logo" },
  { src: '/img/brands/castaway-sac.png', alt: 'Castaway Customs SAC Logo' },
  { src: '/img/brands/castaway-tx.webp', alt: 'Castaway Texas Logo' },
  { src: '/img/brands/gl-castaway.png', alt: 'Great Lakes Castaway Logo' },
  { src: '/img/brands/marinedex.png', alt: 'MarineDex Logo' },
  { src: '/img/brands/phantom.webp', alt: 'Phantom by Seadek Logo' },
  { src: '/img/brands/footprint.png', alt: 'Footprint by Lalonde Logo' },
];

// Change this as needed, e.g. [3,1], [3,2,1], etc.
const PATTERN = [3, 2];

function chunkByPattern(arr, pattern) {
  const rows = [];
  let i = 0;
  let p = 0;
  while (i < arr.length) {
    const want = pattern[p % pattern.length] || arr.length;
    const take = Math.min(want, arr.length - i);
    rows.push(arr.slice(i, i + take));
    i += take;
    p++;
  }
  return rows;
}

export default function TrustSection() {
  const rows = chunkByPattern(BRANDS, PATTERN);

  return (
    <section
      id="trust"
      className="px-4 pt-40 pb-40 lg:px-32"
      style={{ background: 'linear-gradient(to bottom, rgb(8, 90, 98), rgb(20, 52, 52))' }}
    >
      <h2 className="mb-8 inline-block w-full text-center text-6xl leading-16 uppercase md:text-8xl md:leading-22">
        Anchored In Trust
      </h2>

      <p className="text-md font-copy mx-auto mb-8 max-w-212 text-center md:mb-20 md:text-3xl">
        From wild ideas to razor-sharp execution, we partner with brands who aren&apos;t afraid to
        go deep. Strategy, design, code, launch — whatever it takes to move the needle, we&apos;re
        in. Here are a few of the names we&apos;ve helped make waves.
      </p>

      <div className="mx-auto max-w-196">
        {rows.map((row, rowIndex) => {
          const overlap = rowIndex === 0 ? '' : 'mt-[-20%]';
          const expected = PATTERN[rowIndex % PATTERN.length] || row.length;
          const isLastRow = rowIndex === rows.length - 1;
          const missing = isLastRow ? Math.max(0, expected - row.length) : 0;

          // Determine layout width based on the *expected* count (so placeholders size correctly)
          const displayCount = Math.max(row.length + missing, 1);
          const useFixedQuarter = displayCount <= 4;
          const rowJustify =
            displayCount === 1
              ? '' // centered handled by mx-auto on the tile
              : (rowIndex + 1) % 2 === 1
                ? 'justify-between'
                : 'justify-evenly'; // odd = around, even = between

          // If single expected, render centered
          if (displayCount === 1) {
            const item = row[0] || null;
            return (
              <div key={`row-${rowIndex}`} className={overlap}>
                <div className="relative mx-auto w-1/4">
                  {/* If it’s a placeholder (no item), keep the same height via invisible sprite */}
                  {item ? (
                    <>
                      <SpriteJellyfishBig />
                      <div className="absolute top-5/16 right-5/32 left-5/32">
                        <Image
                          className="-translate-y-1/2"
                          src={item.src}
                          alt={item.alt}
                          width={1527}
                          height={569}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="invisible">
                      <SpriteJellyfishBig />
                    </div>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div key={`row-${rowIndex}`} className={`flex ${rowJustify} ${overlap}`}>
              {/* Real items */}
              {row.map((item, i) => (
                <div
                  key={`${item.src}-${i}`}
                  className={`${useFixedQuarter ? 'w-1/4' : ''} relative`}
                  style={useFixedQuarter ? undefined : { width: `${100 / displayCount}%` }}
                >
                  <SpriteJellyfishBig />
                  <div className="absolute top-5/16 right-5/32 left-5/32">
                    <Image
                      className="-translate-y-1/2"
                      src={item.src}
                      alt={item.alt}
                      width={1527}
                      height={569}
                    />
                  </div>
                </div>
              ))}

              {/* Invisible placeholders to complete the expected pattern on the LAST row */}
              {Array.from({ length: missing }).map((_, i) => (
                <div
                  key={`placeholder-${rowIndex}-${i}`}
                  className={`${useFixedQuarter ? 'w-1/4' : ''} invisible relative`}
                  style={useFixedQuarter ? undefined : { width: `${100 / displayCount}%` }}
                >
                  <SpriteJellyfishBig />
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </section>
  );
}

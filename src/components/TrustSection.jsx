// components/TrustSection.jsx
import SpriteJellyfishBig from '@/components/SpriteJellyfishBig';
import Image from '@/lib/Image';

// Add/remove brand entries here. First half = top row, second half = bottom row.
const BRANDS = [
  { src: '/img/brands/colossal.png', alt: 'Colossal Logo' },
  { src: '/img/brands/arnott.png', alt: 'Arnott Suspension Products Logo' },
  { src: '/img/brands/field-and-stream.png', alt: 'Field & Stream Logo' },
  { src: '/img/brands/hilton.png', alt: 'Hilton Logo' },
  { src: '/img/brands/ksc.svg', alt: 'Kennedy Space Center Logo' },
  { src: '/img/brands/ussfhf.webp', alt: 'U.S. Space Force Historical Foundation Logo' },
  { src: '/img/brands/seadek.png', alt: 'SeaDek Logo' },
  { src: '/img/brands/patrick.svg', alt: 'Patrick Industries Logo' },
  { src: '/img/brands/everglades-ranch.png', alt: 'Everglades Ranch Logo' },
  { src: '/img/brands/bond-group-enterprises.png', alt: 'Bond Group Enterprises Logo' },
  { src: '/img/brands/lanco.png', alt: 'LANCO Logo' },
  { src: '/img/brands/fort-point-capital.png', alt: 'Fort Point Capital Logo' },
  { src: '/img/brands/skaneateles-fields.png', alt: 'Skaneateles Fields Resort & Spa Logo' },
  { src: '/img/brands/woodbine.webp', alt: 'Woodbine Logo' },
  { src: '/img/brands/digital-brew.svg', alt: 'Digital Brew Logo' },
  { src: '/img/brands/indrio.svg', alt: 'Indrio Logo' },
  { src: '/img/brands/wyldr.svg', alt: 'Wyldr Logo' },
  { src: '/img/brands/castaway-sac.png', alt: 'Castaway Customs SAC Logo' },
  { src: '/img/brands/castaway-tx.webp', alt: 'Castaway Texas Logo' },
  { src: '/img/brands/gl-castaway.png', alt: 'Great Lakes Castaway Logo' },
  { src: '/img/brands/marinedex.png', alt: 'MarineDex Logo' },
  { src: '/img/brands/phantom.webp', alt: 'Phantom by Seadek Logo' },
  { src: '/img/brands/footprint.png', alt: 'Footprint by Lalonde Logo' },
  { src: '/img/brands/peaklign-partners.png', alt: 'Peaklign Partners Logo' },
  { src: '/img/brands/mangrove-customs.png', alt: 'Mangrove Customs Logo' },
  { src: '/img/brands/tap-root-fields.png', alt: 'Tap Root Fields Logo' },
];

const ROW_SIZE = BRANDS.length / 2;

const MARQUEE_DURATION_S = 90;
const MIN_ITEMS_PER_SET = 14;
const BOB_DURATION_S = 6.4;
// Half-cycle offset so each jellyfish peaks when its neighbor bottoms out
const BOB_STAGGER_S = BOB_DURATION_S / 2;
const BOB_DRIFT_REM = 1.75;

function repeatBrands(items, minCount) {
  const set = [];
  // Only repeat full cycles so the marquee seam never doubles the first logo
  while (set.length < minCount) {
    for (const item of items) {
      set.push({ ...item, uid: `${item.src}-${set.length}` });
    }
  }
  return set;
}

function JellyfishBrandTile({ item }) {
  return (
    <div className="relative">
      <SpriteJellyfishBig className="w-full" />
      <div className="absolute top-5/16 right-5/32 left-5/32 flex h-[26%] -translate-y-1/2 items-center justify-center">
        <Image
          className="max-h-full max-w-full object-contain"
          src={item.src}
          alt={item.alt}
        />
      </div>
    </div>
  );
}

function JellyfishMarqueeRow({ items, direction, className = '' }) {
  const oneSet = repeatBrands(items, MIN_ITEMS_PER_SET);
  const track = [...oneSet, ...oneSet];
  const marqueeClass = direction === 'ltr' ? 'animate-marquee-right' : 'animate-marquee-left';

  return (
    <div className={`overflow-hidden pt-12 pb-8 ${className}`}>
      <div
        className={`flex w-max will-change-transform ${marqueeClass}`}
        style={{ animationDuration: `${MARQUEE_DURATION_S}s` }}
      >
        {track.map((item, i) => (
          <div key={item.uid} className="w-52 flex-shrink-0 px-4">
            <div
              className="origin-[50%_85%] animate-jellyfish-bob-natural"
              style={{
                animationDelay: `${-(i * BOB_STAGGER_S)}s`,
                '--bob-drift':
                  direction === 'ltr' ? `${BOB_DRIFT_REM}rem` : `-${BOB_DRIFT_REM}rem`,
              }}
            >
              <JellyfishBrandTile item={item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TrustSection() {
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
        go deep. Strategy, design, code, launch – whatever it takes to move the needle,
        we&apos;re in. Here are a few of the names we&apos;ve helped make waves.
      </p>

      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-visible">
        <JellyfishMarqueeRow items={BRANDS.slice(0, ROW_SIZE)} direction="ltr" />
        <JellyfishMarqueeRow items={BRANDS.slice(ROW_SIZE)} direction="rtl" className="-mt-[6%]" />
      </div>
    </section>
  );
}

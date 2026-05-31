// pages/services/content-creation.tsx

import Container from '@/components/Container';
import { SEO } from '@/lib/SEO';
import HeaderFix from '@/components/HeaderFix';
import PhotoGallery from '@/components/PhotoGallery';

const videoItems = [
  // Replace youtubeId with your real IDs (the string after v= in a YouTube URL)
  { title: 'Legacy of Launch – Fundraising Campaign', youtubeId: 'mfXfDpgpaDY' },
  { title: 'Yak Gear – Promo', youtubeId: 'iNR1BKNJVaY' },
  { title: 'SeaDek – Interview', youtubeId: 'rsdT5cIE3as' },
  { title: 'Big Wood Tree Service – Short Form Ad', youtubeId: 'xztnDpAUct8' },
  { title: 'SeaDek – Documentary', youtubeId: '9iou_PyBQgA' },
  { title: 'Wedding Highlight Reel', youtubeId: 'tvMw1x19aRI' },
];

const photoItems = [
  // Swap these with your actual photo URLs (keep titles short + descriptive)
  {
    title: '',
    imageUrl:
      'https://cdn.builder.io/api/v1/image/assets%2F04a66a34a825475f879a3a1be1673b31%2Fe59deec991da4f009d76fb5e72ba7cbd',
  },
  {
    title: '',
    imageUrl:
      'https://cdn.builder.io/api/v1/image/assets%2F04a66a34a825475f879a3a1be1673b31%2Fb3cf80bc778d4d8c8623b1340c9b5d6a',
  },
  {
    title: '',
    imageUrl:
      'https://cdn.builder.io/api/v1/image/assets%2F04a66a34a825475f879a3a1be1673b31%2F0a216323a71c4b269dff3111fe6637f5',
  },
  {
    title: '',
    imageUrl:
      'https://cdn.builder.io/api/v1/image/assets%2F04a66a34a825475f879a3a1be1673b31%2Fa5a7d511e07a4a7dbced9969de7bf797',
  },
  {
    title: '',
    imageUrl:
      'https://cdn.builder.io/api/v1/image/assets%2F04a66a34a825475f879a3a1be1673b31%2Fda68a0ef3391407fa5b14d756f38b8ce',
  },
  {
    title: '',
    imageUrl:
      'https://cdn.builder.io/api/v1/image/assets%2F04a66a34a825475f879a3a1be1673b31%2F0bcc2db2f04f4203939460c4cf2fc5c4',
  },
  {
    title: '',
    imageUrl:
      'https://cdn.builder.io/api/v1/image/assets%2F04a66a34a825475f879a3a1be1673b31%2F92b97fb30fa546f1b9a319b053831418',
  },
  {
    title: '',
    imageUrl:
      'https://cdn.builder.io/api/v1/image/assets%2F04a66a34a825475f879a3a1be1673b31%2F8ccec2263fdc4e6593dea1d275c94a1a',
  },
];

export default function ContentCreation() {
  return (
    <div
      className="min-h-[100vh]"
      style={{ background: `linear-gradient(to bottom, #297073, rgb(20, 52, 52))` }}
    >
      <SEO title="Content Creation | Grove Marketing Co." />

      <HeaderFix />
      <Container>
        {/* Intro */}
        <section aria-labelledby="content-heading">
          <h1 className="text-md font-semibold uppercase">Content Creation</h1>

          <h2 id="content-heading" className="mt-3 text-4xl font-bold sm:text-5xl">
            Show the story. Make it memorable.
          </h2>

          <p className="mt-4 text-lg">
            We concept, shoot, and ship content that actually moves people—video spots, brand films,
            social cuts, and photo sets that feel alive and on-brand. Built for campaign launches,
            landing pages, ads, and the everyday cadence of your channels.
          </p>
          <p className="mt-3">
            From pre-pro to final export, we keep it simple: clear strategy, crisp visuals, fast
            edits, and assets your team can use everywhere.
          </p>
        </section>

        {/* Videography */}
        <section className="mt-16" aria-labelledby="videography-heading">
          <h2 id="videography-heading" className="mt-3 text-4xl font-bold sm:text-5xl">
            Videography
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {videoItems.map((v) => (
              <div key={v.title}>
                {/* 16:9 responsive iframe wrapper without relying on Tailwind aspect plugin */}
                <div
                  className="relative h-0 w-full overflow-hidden rounded-xl"
                  style={{ paddingTop: '56.25%' }}
                >
                  <iframe
                    className="absolute top-0 left-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}`}
                    title={v.title}
                    frameBorder="0"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
                <h3 className="mt-3 text-center text-xl">{v.title}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Photography */}
        <section className="mt-16" aria-labelledby="photography-heading">
          <h2 id="photography-heading" className="mt-3 text-4xl font-bold sm:text-5xl">
            Photography
          </h2>

          <div className="mt-6">
            <PhotoGallery items={photoItems} />
          </div>
        </section>
      </Container>
    </div>
  );
}

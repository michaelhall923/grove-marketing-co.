// pages/services/content-creation.tsx

import { useState } from 'react';
import Container from '@/components/Container';
import { SEO } from '@/lib/SEO';
import HeaderFix from '@/components/HeaderFix';
import PhotoGallery from '@/components/PhotoGallery';

type VideoCategory =
  | 'YouTube & Digital Series'
  | 'Brand Stories'
  | 'Commercials & Campaigns'
  | 'Educational & Instructional';

const CATEGORIES: VideoCategory[] = [
  'YouTube & Digital Series',
  'Brand Stories',
  'Commercials & Campaigns',
  'Educational & Instructional',
];

const videoItems: { title: string; youtubeId: string; category: VideoCategory }[] = [
  // YouTube & Digital Series
  { title: 'Field & Stream - Podcast', youtubeId: 'h6o8u8_3ueU', category: 'YouTube & Digital Series' },
  { title: 'Field & Stream - Fishing Show', youtubeId: 'RIJ5HSehvtM', category: 'YouTube & Digital Series' },
  { title: 'Field & Stream - Fishing Show', youtubeId: 'zQSfofIPOEk', category: 'YouTube & Digital Series' },

  // Brand Stories
  { title: 'SeaDek - Documentary', youtubeId: '9iou_PyBQgA', category: 'Brand Stories' },
  { title: 'SeaDek - Interview', youtubeId: 'rsdT5cIE3as', category: 'Brand Stories' },
  { title: 'Arnott - Testimonial', youtubeId: 'RJYCXZmUtSI', category: 'Brand Stories' },

  // Commercials & Campaigns
  { title: 'Arnott - Commercial', youtubeId: '_UGCFJG3sjM', category: 'Commercials & Campaigns' },
  { title: 'Arnott - Commercial', youtubeId: 'Zla9HJIHEAQ', category: 'Commercials & Campaigns' },
  { title: 'Yak Gear - Promo', youtubeId: 'iNR1BKNJVaY', category: 'Commercials & Campaigns' },
  { title: 'Legacy of Launch - Fundraising Campaign', youtubeId: 'mfXfDpgpaDY', category: 'Commercials & Campaigns' },
  { title: 'Big Wood Tree Service - Short Form Ad', youtubeId: 'xztnDpAUct8', category: 'Commercials & Campaigns' },

  // Educational & Instructional
  { title: 'Arnott - Tutorial', youtubeId: 'RDWl6-OtWu0', category: 'Educational & Instructional' },
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

function VideoCard({ title, youtubeId }: { title: string; youtubeId: string }) {
  return (
    <div>
      {/* 16:9 responsive iframe wrapper without relying on Tailwind aspect plugin */}
      <div
        className="relative h-0 w-full overflow-hidden rounded-xl"
        style={{ paddingTop: '56.25%' }}
      >
        <iframe
          className="absolute top-0 left-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
          title={title}
          frameBorder="0"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <h3 className="mt-3 text-center text-xl">{title}</h3>
    </div>
  );
}

export default function ContentCreation() {
  const [activeCategory, setActiveCategory] = useState<VideoCategory | 'All'>('All');

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

          {/* Category pills */}
          <div className="mt-6 flex flex-wrap gap-3" role="group" aria-label="Filter videos by category">
            {(['All', ...CATEGORIES] as const).map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={isActive}
                  className="rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-wide transition-colors"
                  style={{
                    borderColor: isActive ? 'transparent' : 'currentColor',
                    background: isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                    color: 'currentColor',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Category sections */}
          {CATEGORIES.filter(
            (cat) => activeCategory === 'All' || activeCategory === cat,
          ).map((cat) => (
            <div key={cat} className="mt-10" aria-labelledby={`category-${cat.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`}>
              <h3 id={`category-${cat.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`} className="text-2xl font-bold sm:text-3xl">
                {cat}
              </h3>

              <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {videoItems
                  .filter((v) => v.category === cat)
                  .map((v) => (
                    <VideoCard key={v.youtubeId} title={v.title} youtubeId={v.youtubeId} />
                  ))}
              </div>
            </div>
          ))}
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

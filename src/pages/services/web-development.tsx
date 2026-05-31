import Container from '@/components/Container';
import { SEO } from '@/lib/SEO';
import HeaderFix from '@/components/HeaderFix';
import Image from '@/lib/Image';

const mainPortfolioItems = [
  {
    title: 'Skaneateles Fields Resort & Spa',
    url: 'https://skaneatelesfields.com/',
    imageUrl:
      'https://cdn.builder.io/api/v1/image/assets%2F04a66a34a825475f879a3a1be1673b31%2Fef9828ec1f9f4f69860332e49ee16445',
  },
  {
    title: 'Tap Root Fields',
    url: 'https://taprootfields.com/',
    imageUrl:
      'https://cdn.builder.io/api/v1/image/assets%2F04a66a34a825475f879a3a1be1673b31%2Ff7853fd5449740c3afc185e2bb475f2f',
  },
  {
    title: 'Legacy of Launch',
    url: 'https://legacyoflaunch.org/',
    imageUrl:
      'https://cdn.builder.io/api/v1/image/assets%2F04a66a34a825475f879a3a1be1673b31%2Ff8d2574c7f4f42d08aa02c90c5d58cbd',
  },
  {
    title: 'WYLDR',
    url: 'https://wyldr.com/',
    imageUrl:
      'https://cdn.builder.io/api/v1/image/assets%2F04a66a34a825475f879a3a1be1673b31%2Fc0efd9f6088f4c1c984b6bfce4ffc785',
  },
  {
    title: 'Peaklign Partners',
    url: 'https://peaklignpartners.com/',
    imageUrl:
      'https://cdn.builder.io/api/v1/image/assets%2F04a66a34a825475f879a3a1be1673b31%2Fbb776c6d37c8404faf1c4eb6f3e7f42a',
  },
  {
    title: 'Footprint by Lalonde',
    url: 'https://bookfootprint.com/',
    imageUrl:
      'https://cdn.builder.io/api/v1/image/assets%2F04a66a34a825475f879a3a1be1673b31%2F0df67398e46343a89598e84a4bcacccc',
  },
];
const otherPortfolioItems = [
  {
    title: 'Tap Root Fields Cannabis',
    url: 'https://www.taprootfieldscannabis.com/',
  },
  // {
  //   title: 'Gold Tone Music Group',
  //   url: 'https://goldtonemusicgroup.com/goldtone/',
  // },
  {
    title: 'Everglades Ranch',
    url: 'https://evergladesranch.com/',
  },
  {
    title: 'Allyn Lodge',
    url: 'https://allynlodge.com/',
  },
  {
    title: 'MarineDex',
    url: 'https://mymarinedex.com/',
  },
  {
    title: 'Castaway Customs TX',
    url: 'https://www.castawaycustomstx.com/',
  },
  {
    title: 'Great Lakes Castaway',
    url: 'https://greatlakescastaway.com/',
  },
];

export default function WebDevelopment() {
  return (
    <div
      className="min-h-[100vh]"
      style={{ background: `linear-gradient(to bottom, #297073, rgb(20, 52, 52))` }}
    >
      <SEO title="Web Development | Grove Marketing Co." />
      <HeaderFix />
      <Container>
        <section aria-labelledby="webdev-heading">
          <h1 className="text-md font-semibold uppercase">Web Development</h1>

          <h2 id="webdev-heading" className="mt-3 text-4xl font-bold sm:text-5xl">
            Build once. Ship fast. Grow on.
          </h2>

          <p className="mt-4 text-lg">
            We design and develop websites that feel fast, look alive, and actually convert. Crafted
            in Next.js, Shopify, Webflow, Wordpress, or whichever stack plays best with your
            business.
          </p>
          <p className="mt-3">
            At Grove, we’re creative on the surface, and technical down to the sea floor. We map
            your goals, prototype the flow, and ship a site that’s easy to edit, quick to load, and
            ready to scale. No mystery sauce, just clean builds, smart integrations, and a rhythm of
            continuous improvement.
          </p>

          {/* <div className="mt-10 grid gap-10 lg:grid-cols-2">
                    <div>
                        <h2 className="text-md font-semibold uppercase">
                        What you get
                        </h2>
                        <ul className="mt-4 list-disc pl-6 space-y-3">
                        <li>
                            <strong>Strategy → System:</strong> sitemap, wireframes, and a
                            reusable design system.
                        </li>
                        <li>
                            <strong>Custom build:</strong> Next.js/Tailwind, Shopify
                            themes/sections, or Webflow components.
                        </li>
                        <li>
                            <strong>Speed &amp; SEO:</strong> Core Web Vitals-minded
                            performance and technical SEO baked in.
                        </li>
                        <li>
                            <strong>Content &amp; CMS:</strong> clear messaging, schema, and
                            an editor-friendly CMS.
                        </li>
                        <li>
                            <strong>Integrations:</strong> analytics, automations, email/CRM,
                            payments, and more.
                        </li>
                        <li>
                            <strong>Access &amp; a11y:</strong> keyboard-friendly, WCAG-aware,
                            mobile-first everywhere.
                        </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-md font-semibold uppercase">
                        How we work
                        </h2>
                        <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                        <li className="rounded-xl border p-4">
                            <span className="font-semibold">Discover</span> → align on goals
                            &amp; users
                        </li>
                        <li className="rounded-xl border p-4">
                            <span className="font-semibold">Prototype</span> → map flows
                            &amp; UX
                        </li>
                        <li className="rounded-xl border p-4">
                            <span className="font-semibold">Design</span> → system-first UI
                        </li>
                        <li className="rounded-xl border p-4">
                            <span className="font-semibold">Build</span> → clean, documented
                            code
                        </li>
                        <li className="rounded-xl border p-4">
                            <span className="font-semibold">QA</span> → cross-device testing
                        </li>
                        <li className="rounded-xl border p-4">
                            <span className="font-semibold">Launch</span> → smooth handoff
                        </li>
                        <li className="rounded-xl border p-4">
                            <span className="font-semibold">Iterate</span> → ship
                            improvements
                        </li>
                        </ol>

                        <p className="mt-6">
                        <strong>Anchored in trust.</strong> Transparent timelines, clean
                        handoff docs, and a site your team can actually use. Ready to
                        build?
                        </p>
                    </div>
                </div> */}
        </section>
        <section className="mt-16" aria-labelledby="portfolio-heading">
          <h2 id="portfolio-heading" className="mt-3 text-4xl font-bold sm:text-5xl">
            Our Work
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-8">
            {mainPortfolioItems.map((item) => (
              <a href={item.url} target="_blank" rel="noopener noreferrer" key={item.title}>
                <Image
                  src={item.imageUrl}
                  width={1920}
                  height={1080}
                  alt={`Screenshot of website for ${item.title}`}
                />
                <h3 className="mt-2 text-center text-xl">{item.title}</h3>
              </a>
            ))}
          </div>
          <h3 className="mt-8 text-2xl">More:</h3>
          <ul>
            {otherPortfolioItems.map((item) => (
              <li key={item.title}>
                <a href={item.url} className="font-header underline" target="_blank">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </div>
  );
}

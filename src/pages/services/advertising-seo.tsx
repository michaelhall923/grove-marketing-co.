// pages/services/advertising-seo.tsx

import Container from '@/components/Container';
import { SEO } from '@/lib/SEO';
import HeaderFix from '@/components/HeaderFix';

export default function AdvertisingSEO() {
  return (
    <div
      className="min-h-[100vh]"
      style={{ background: `linear-gradient(to bottom, #297073, rgb(20, 52, 52))` }}
    >
      <SEO
        title="Advertising & SEO | Grove Marketing Co."
        description="PPC-first Advertising & SEO: search, shopping, and social ads with clear tracking and simple, useful reporting."
      />
      <HeaderFix />
      <Container>
        {/* Intro */}
        <section aria-labelledby="ads-heading" className="pt-2">
          <h1 className="text-md font-semibold uppercase">Advertising &amp; SEO</h1>
          <h2 id="ads-heading" className="mt-3 text-4xl font-bold sm:text-5xl">
            Run smart ads. Measure what matters.
          </h2>
          <p className="mt-4 text-lg">
            PPC-first growth: we set up clean tracking, launch focused campaigns, and keep a steady
            cadence of optimizations so your ad dollars pull their weight. Simple plans, clear
            metrics, and creative that matches intent.
          </p>
        </section>

        {/* What we run */}
        <section className="mt-12" aria-labelledby="run-heading">
          <h3 id="run-heading" className="text-2xl font-bold sm:text-3xl">
            What we run
          </h3>
          <ul className="mt-4 grid grid-cols-1 gap-2 text-base sm:grid-cols-2">
            <li>• Google Ads: Search, Shopping, Performance Max</li>
            <li>• YouTube: skippable/non-skippable, remarketing</li>
            <li>• Meta &amp; TikTok: prospecting + retargeting</li>
            <li>• Microsoft (Bing) Search &amp; Shopping</li>
            <li>• Remarketing &amp; branded search defense</li>
            <li>• Lightweight SEO: on-page fixes &amp; basics</li>
          </ul>
        </section>

        {/* What we handle */}
        <section className="mt-12" aria-labelledby="handle-heading">
          <h3 id="handle-heading" className="text-2xl font-bold sm:text-3xl">
            What we handle
          </h3>
          <ul className="mt-4 grid grid-cols-1 gap-2 text-base sm:grid-cols-2">
            <li>• Conversion tagging, pixels, and GA4 events</li>
            <li>• UTM standards and source attribution</li>
            <li>• Product feeds &amp; catalogs (titles, GTINs, images)</li>
            <li>• Keyword strategy, negatives, match types</li>
            <li>• Ad copy &amp; creative iterations</li>
            <li>• Budget pacing and bid strategy tuning</li>
          </ul>
        </section>

        {/* Optimization loop */}
        <section className="mt-12" aria-labelledby="opt-heading">
          <h3 id="opt-heading" className="text-2xl font-bold sm:text-3xl">
            Optimization loop
          </h3>
          <ul className="mt-4 space-y-2 text-base">
            <li>• Weekly search term reviews &amp; negative adds</li>
            <li>• Ongoing ad tests (headlines, hooks, CTAs)</li>
            <li>• Bid &amp; budget adjustments by goal (CPA/ROAS)</li>
            <li>• Audience &amp; placement refinements</li>
            <li>• Landing page alignment &amp; speed checks</li>
          </ul>
        </section>

        {/* Reporting */}
        <section className="mt-12 pb-20" aria-labelledby="report-heading">
          <h3 id="report-heading" className="text-2xl font-bold sm:text-3xl">
            Reporting (kept simple)
          </h3>
          <ul className="mt-4 space-y-2 text-base">
            <li>• Weekly snapshot: spend, clicks, conv., CPA/ROAS</li>
            <li>• Monthly readout: wins, losses, next tests</li>
            <li>• Shared scorecard with definitions (no jargon)</li>
          </ul>
        </section>
      </Container>
    </div>
  );
}

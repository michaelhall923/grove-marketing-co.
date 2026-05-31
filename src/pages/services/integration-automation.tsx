// pages/services/integration-automation.tsx

import Container from '@/components/Container';
import { SEO } from '@/lib/SEO';
import HeaderFix from '@/components/HeaderFix';

export default function IntegrationAutomation() {
  return (
    <div
      className="min-h-[100vh]"
      style={{ background: `linear-gradient(to bottom, #297073, rgb(20, 52, 52))` }}
    >
      <SEO
        title="Integration & Automation | Grove Marketing Co."
        description="Basic overview of Grove Marketing Co.'s integration & automation services—connect your tools and automate routine work."
      />
      <HeaderFix />
      <Container>
        {/* Intro */}
        <section aria-labelledby="ia-heading" className="pt-2">
          <h1 className="text-md font-semibold uppercase">Integration &amp; Automation</h1>
          <h2 id="ia-heading" className="mt-3 text-4xl font-bold sm:text-5xl">
            Connect your tools. Automate the routine.
          </h2>
          <p className="mt-4 text-lg">
            We make your systems talk to each other and take the repetitive work off your plate.
            Clean data in, reliable workflows out—built to be simple, durable, and easy to hand off.
          </p>
        </section>

        {/* What we integrate */}
        <section className="mt-12" aria-labelledby="integrations-heading">
          <h3 id="integrations-heading" className="text-2xl font-bold sm:text-3xl">
            What we integrate
          </h3>
          <ul className="mt-4 grid grid-cols-1 gap-2 text-base sm:grid-cols-2">
            <li>• E-commerce (Shopify, payments, fulfillment)</li>
            <li>• CRMs &amp; forms (lead capture, enrichment, routing)</li>
            <li>• Calendars &amp; bookings (ICS, reminders, confirmations)</li>
            <li>• Docs &amp; data (Sheets, Airtable, Notion syncs)</li>
            <li>• Messaging &amp; alerts (Slack, email digests)</li>
            <li>• Analytics &amp; ads (events, basic reporting pipes)</li>
          </ul>
        </section>

        {/* Common automations */}
        {/* <section className="mt-12" aria-labelledby="automations-heading">
          <h3 id="automations-heading" className="text-2xl font-bold sm:text-3xl">
            Common automations
          </h3>
          <ul className="mt-4 space-y-2 text-base">
            <li>• New order → tag customer → send onboarding email</li>
            <li>• Lead form → enrich → add to CRM with UTM/source</li>
            <li>• Calendar feed → lock unavailable dates on site</li>
            <li>• Low stock → alert team → pause/resume campaigns</li>
            <li>• File upload → optimize → publish to CDN</li>
            <li>• Weekly metrics digest to Slack (revenue, leads, CTR)</li>
          </ul>
        </section> */}

        {/* How we work */}
        <section className="mt-12 pb-20" aria-labelledby="process-heading">
          <h3 id="process-heading" className="text-2xl font-bold sm:text-3xl">
            How we work
          </h3>
          <ol className="mt-4 grid grid-cols-1 gap-4 text-base sm:grid-cols-3">
            <li className="rounded-lg border border-white/10 p-4">
              <div className="text-xl font-bold">1. Map</div>
              <p className="mt-1 opacity-90">Agree on sources, fields, and success criteria.</p>
            </li>
            <li className="rounded-lg border border-white/10 p-4">
              <div className="text-xl font-bold">2. Build</div>
              <p className="mt-1 opacity-90">Configure connectors or light custom functions.</p>
            </li>
            <li className="rounded-lg border border-white/10 p-4">
              <div className="text-xl font-bold">3. Run</div>
              <p className="mt-1 opacity-90">Test, log, and document so it stays reliable.</p>
            </li>
          </ol>
        </section>
      </Container>
    </div>
  );
}

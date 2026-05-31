import Container from '@/components/Container';
import HeaderFix from '@/components/HeaderFix';
import { SEO } from '@/lib/SEO';
import { useEffect } from 'react';

export const mrc2025FooterTitle = 'Want to make a splash?';

export default function MRC2025Page() {
  const title =
    'Photo Gallery - Melbourne Regional Chamber 2025 Community Leadership Retreat | Grove Marketing Co.';
  const description =
    "Photo gallery for the Melbourne Regional Chamber's 2025 Community Leadership Retreat";

  useEffect(() => {
    const existing = document.querySelector('script[data-flickr-embed]');
    if (existing) return;
    const script = document.createElement('script');
    script.src = 'https://embedr.flickr.com/assets/client-code.js';
    script.async = true;
    script.dataset.flickrEmbed = 'true';
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className="min-h-[100vh]"
      style={{ background: `linear-gradient(to bottom, #297073, rgb(20, 52, 52))` }}
    >
      <SEO title={title} description={description} robots="noindex, nofollow" />
      <HeaderFix />
      <Container>
        <div className="flex flex-col items-center gap-8 py-20">
          <h1 className="text-center text-xl font-bold sm:text-2xl">
            Melbourne Regional Chamber 2025 Community Leadership Retreat
          </h1>
          <a
            data-flickr-embed="true"
            data-header="false"
            data-footer="false"
            href="https://www.flickr.com/photos/186130033@N05/albums/72177720329389489/"
            title="Tennesee Cabin - Christmas 2019"
          >
            <img
              src="https://live.staticflickr.com/65535/54823626650_244c667371_h.jpg"
              width={640}
              height={480}
              alt="Tennesee Cabin - Christmas 2019"
            />
          </a>
          <a
            href="https://www.flickr.com/photos/186130033@N05/albums/72177720329389489/"
            target="_blank"
            rel="noopener noreferrer"
            className="button"
          >
            View Full Album
          </a>
        </div>
      </Container>
    </div>
  );
}

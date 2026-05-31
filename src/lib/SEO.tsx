import { useEffect } from 'react';

type SEOProps = {
  title?: string;
  description?: string;
  ogType?: string;
  ogImage?: string;
  robots?: string;
};

const DEFAULT_TITLE = 'Grove Marketing Co. | Digital Marketing, Web Development & SEO';
const DEFAULT_DESCRIPTION =
  'Grove Marketing Co. helps bold brands grow with cutting-edge marketing, custom websites, content creation, and automation. Let’s make waves together.';
const SITE_URL = 'https://www.grovemarketingco.com/';
const DEFAULT_OG_IMAGE = 'https://www.grovemarketingco.com/img/og-image.png';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function useSEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  robots,
}: SEOProps) {
  useEffect(() => {
    document.title = title;
    setMeta('name', 'title', title);
    setMeta('name', 'description', description);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:url', SITE_URL);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', ogImage);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:url', SITE_URL);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', ogImage);

    if (robots) {
      setMeta('name', 'robots', robots);
    }
  }, [title, description, ogType, ogImage, robots]);
}

export function DefaultSEO() {
  useSEO({});
  return null;
}

export function SEO(props: SEOProps) {
  useSEO({
    title: props.title || DEFAULT_TITLE,
    description: props.description || DEFAULT_DESCRIPTION,
    ogType: props.ogType,
    ogImage: props.ogImage || DEFAULT_OG_IMAGE,
    robots: props.robots,
  });
  return null;
}

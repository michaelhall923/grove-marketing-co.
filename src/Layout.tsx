import Footer from '@/components/footer';
import Header from '@/components/header';
import ScrollToTop from '@/components/ScrollToTop';
import { DefaultSEO } from '@/lib/SEO';
import { Outlet, useMatches } from 'react-router-dom';

type RouteHandle = {
  footerTitle?: string;
  bare?: boolean;
};

export default function Layout() {
  const matches = useMatches();
  const handles = matches.map((m) => m.handle as RouteHandle | undefined);
  const bare = handles.some((h) => h?.bare);
  const footerTitle =
    [...handles].reverse().map((h) => h?.footerTitle).find(Boolean) ?? 'Feeling jelly yet?';

  if (bare) {
    return (
      <>
        <ScrollToTop />
        <DefaultSEO />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <ScrollToTop />
      <DefaultSEO />
      <Header />
      <div className="-mt-28 overflow-hidden lg:-mt-32">
        <Outlet />
      </div>
      <Footer title={footerTitle} />
    </>
  );
}

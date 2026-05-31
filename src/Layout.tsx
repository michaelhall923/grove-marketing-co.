import Footer from '@/components/footer';
import Header from '@/components/header';
import ScrollToTop from '@/components/ScrollToTop';
import { DefaultSEO } from '@/lib/SEO';
import { Outlet, useMatches } from 'react-router-dom';

type RouteHandle = {
  footerTitle?: string;
};

export default function Layout() {
  const matches = useMatches();
  const footerTitle =
    [...matches]
      .reverse()
      .map((m) => (m.handle as RouteHandle | undefined)?.footerTitle)
      .find(Boolean) ?? 'Feeling jelly yet?';

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

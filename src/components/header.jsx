
import Image from '@/lib/Image';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Menu from './Menu';

const navigationLinks = [
  { label: 'Home', url: '/' },
  {
    label: 'Services',
    links: [
      { url: '/services/web-development', label: 'Web Development' },
      { url: '/services/integration-automation', label: 'Integration & Automation' },
      { url: '/services/content-creation', label: 'Content Creation' },
      { url: '/services/advertising-seo', label: 'Advertising & SEO' },
    ],
  },
];

export default function Header() {
  const { pathname: pathName } = useLocation();

  const isHome = pathName === '/';
  const logo = isHome
    ? { src: '/img/logo-tan.png', width: 50, height: 62 }
    : { src: '/img/logo-tan-long.png', width: 192, height: 62 }; // 192x62 for non-home pages

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-transparent p-6 px-4 lg:p-8">
      <Link to="/" className="md:pl-4" aria-label="Go to homepage">
        <Image
          src={logo.src}
          alt="Home"
          width={logo.width}
          height={logo.height}
          style={{ width: logo.width, height: logo.height }}
          priority
        />
      </Link>
      <Menu items={navigationLinks} currentPath={pathName} />
    </header>
  );
}

import { useLocation } from 'react-router-dom';
import HeaderLogo from './HeaderLogo';
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

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between bg-transparent p-6 px-4 lg:p-8">
      <HeaderLogo isHome={isHome} />
      <Menu items={navigationLinks} currentPath={pathName} />
    </header>
  );
}

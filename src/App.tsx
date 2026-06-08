import { PreviewErrorFallback } from '@/components/ErrorBoundary';
import Layout from '@/Layout';
import ArticlePage from '@/pages/articles/ArticlePage';
import ArticlesIndex from '@/pages/articles/ArticlesIndex';
import AboutPage from '@/pages/AboutPage';
import MRC2025Page, { mrc2025FooterTitle } from '@/pages/galleries/mrc2025';
import Home from '@/pages/index';
import NotFound from '@/pages/NotFound';
import AdvertisingSeo from '@/pages/services/advertising-seo';
import ContentCreation from '@/pages/services/content-creation';
import IntegrationAutomation from '@/pages/services/integration-automation';
import WebDevelopment from '@/pages/services/web-development';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <PreviewErrorFallback message="A route failed to render." />,
    children: [
      { index: true, element: <Home /> },
      { path: 'services/web-development', element: <WebDevelopment /> },
      { path: 'services/integration-automation', element: <IntegrationAutomation /> },
      { path: 'services/content-creation', element: <ContentCreation /> },
      { path: 'services/advertising-seo', element: <AdvertisingSeo /> },
      {
        path: 'galleries/mrc2025',
        element: <MRC2025Page />,
        handle: { footerTitle: mrc2025FooterTitle },
      },
      { path: 'articles', element: <ArticlesIndex /> },
      { path: 'articles/:slug', element: <ArticlePage /> },
      { path: 'about-us', element: <AboutPage /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}

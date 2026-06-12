import { PreviewErrorFallback } from '@/components/ErrorBoundary';
import RequireAdmin from '@/components/RequireAdmin';
import Layout from '@/Layout';
import { AuthProvider } from '@/lib/auth';
import ArticlePage from '@/pages/articles/ArticlePage';
import ArticlesIndex from '@/pages/articles/ArticlesIndex';
import AboutPage from '@/pages/AboutPage';
import MRC2025Page, { mrc2025FooterTitle } from '@/pages/galleries/mrc2025';
import Home from '@/pages/index';
import LoginPage from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import RaffleAdminPage from '@/pages/raffle/Admin';
import RaffleDrawPage from '@/pages/raffle/Draw';
import RaffleEnterPage from '@/pages/raffle/Enter';
import RaffleIndexPage from '@/pages/raffle/Index';
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
      { path: 'login', element: <LoginPage /> },
      { path: 'raffle', element: <RaffleIndexPage />, handle: { bare: true } },
      { path: 'raffle/enter', element: <RaffleEnterPage />, handle: { bare: true } },
      { path: 'raffle/draw', element: <RaffleDrawPage />, handle: { bare: true } },
      {
        path: 'raffle/admin',
        element: (
          <RequireAdmin>
            <RaffleAdminPage />
          </RequireAdmin>
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ScrollToTop } from '@/components/ScrollToTop';
import { RouteLoadingTracker } from '@/components/RouteLoadingTracker';
import { SmoothScroll } from '@/components/SmoothScroll';
import { HomePage } from '@/pages/HomePage';
import { ProjectPage } from '@/pages/ProjectPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminLeadsPage } from '@/pages/admin/AdminLeadsPage';
import { AdminProjectsPage } from '@/pages/admin/AdminProjectsPage';
import { AdminDevelopersPage } from '@/pages/admin/AdminDevelopersPage';
import { AdminAmenitiesPage } from '@/pages/admin/AdminAmenitiesPage';
import { AdminMediaPage } from '@/pages/admin/AdminMediaPage';
import { getSubdomainSlug } from '@/lib/routing';
import '@/index.css';

const subdomainSlug = getSubdomainSlug(window.location.hostname);

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const content = (
    <Routes>
      <Route
        path='/'
        element={
          subdomainSlug ? <ProjectPage forcedSlug={subdomainSlug} /> : <HomePage />
        }
      />
      <Route path='/:projectSlug' element={<ProjectPage />} />

      <Route path='/admin/login' element={<AdminLoginPage />} />
      <Route path='/admin' element={<ProtectedRoute />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path='leads' element={<AdminLeadsPage />} />
        <Route path='projects' element={<AdminProjectsPage />} />
        <Route path='developers' element={<AdminDevelopersPage />} />
        <Route path='media' element={<AdminMediaPage />} />
        <Route path='amenities' element={<AdminAmenitiesPage />} />
      </Route>

      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );

  if (isAdminRoute) return content;
  return <SmoothScroll>{content}</SmoothScroll>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <BrowserRouter>
      <ScrollToTop />
      <LoadingProvider>
        <RouteLoadingTracker />
        <AuthProvider>
          <AppRoutes />

          <Toaster position='top-right' richColors />
        </AuthProvider>
      </LoadingProvider>
    </BrowserRouter>
  </HelmetProvider>
);

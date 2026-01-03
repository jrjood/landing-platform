import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ScrollToTop } from '@/components/ScrollToTop';
import { RouteLoadingTracker } from '@/components/RouteLoadingTracker';
import { StickyTopBar } from '@/components/StickyTopBar';
import { HomePage } from '@/pages/HomePage';
import { ProjectPage } from '@/pages/ProjectPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminLeadsPage } from '@/pages/admin/AdminLeadsPage';
import { AdminProjectsPage } from '@/pages/admin/AdminProjectsPage';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <HelmetProvider>
    <BrowserRouter>
      <ScrollToTop />
      <LoadingProvider>
        <StickyTopBar />
        <RouteLoadingTracker />
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path='/' element={<HomePage />} />
            <Route path='/:projectSlug' element={<ProjectPage />} />

            {/* Admin Routes */}
            <Route path='/admin/login' element={<AdminLoginPage />} />
            <Route path='/admin' element={<ProtectedRoute />}>
              <Route index element={<Navigate to='/admin/leads' replace />} />
              <Route path='leads' element={<AdminLeadsPage />} />
              <Route path='projects' element={<AdminProjectsPage />} />
            </Route>

            {/* 404 */}
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>

          <Toaster position='top-right' richColors />
        </AuthProvider>
      </LoadingProvider>
    </BrowserRouter>
  </HelmetProvider>
  // </React.StrictMode>
);

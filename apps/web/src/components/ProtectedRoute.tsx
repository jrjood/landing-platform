import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, FolderKanban, Building2, Wrench, Image, LogOut, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/leads', label: 'Leads', icon: Users },
  { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { path: '/admin/media', label: 'Media', icon: Image },
  { path: '/admin/developers', label: 'Developers', icon: Building2 },
  { path: '/admin/amenities', label: 'Amenities', icon: Wrench },
];

export function ProtectedRoute() {
  const { isAuthenticated, isAuthReady } = useAuth();
  if (!isAuthReady) return null;
  if (!isAuthenticated) return <Navigate to='/admin/login' replace />;
  return <AdminLayout />;
}

function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className='flex h-screen bg-muted/30'>
      <aside className={`w-64 border-r bg-card flex-shrink-0 flex flex-col ${mobileOpen ? 'fixed inset-0 z-50' : 'hidden'} lg:block lg:relative`}>
        <div className='flex h-16 items-center justify-between border-b px-5'>
          <div className='flex items-center gap-2.5'>
            <div className='h-7 w-7 rounded-md bg-primary flex items-center justify-center'>
              <span className='text-xs font-bold text-primary-foreground'>WH</span>
            </div>
            <div className='leading-tight'>
              <p className='text-sm font-semibold'>Admin Panel</p>
              <p className='text-[10px] text-muted-foreground uppercase tracking-wider'>Wealth Holding</p>
            </div>
          </div>
          <button className='lg:hidden' onClick={() => setMobileOpen(false)}>
            <X className='w-5 h-5' />
          </button>
        </div>

        <nav className='flex-1 space-y-1 p-3 overflow-auto'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)}>
                <div
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className='h-4 w-4' />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className='border-t p-4'>
          <div className='mb-3 text-sm truncate'>
            <p className='font-medium'>{user?.email}</p>
            <p className='text-xs text-muted-foreground'>Administrator</p>
          </div>
          <Button onClick={logout} variant='outline' size='sm' className='w-full gap-2 text-xs'>
            <LogOut className='h-3.5 w-3.5' />
            Logout
          </Button>
        </div>
      </aside>

      {mobileOpen && <div className='fixed inset-0 bg-black/50 z-40 lg:hidden' onClick={() => setMobileOpen(false)} />}

      <main className='flex-1 overflow-auto'>
        <div className='lg:hidden flex items-center justify-between border-b bg-card px-4 h-14'>
          <button onClick={() => setMobileOpen(true)} className='p-1 hover:text-primary transition-colors'>
            <Menu className='w-5 h-5' />
          </button>
          <div className='flex items-center gap-2'>
            <div className='h-5 w-5 rounded bg-primary flex items-center justify-center'>
              <span className='text-[8px] font-bold text-primary-foreground'>WH</span>
            </div>
            <span className='text-sm font-semibold'>Admin</span>
          </div>
          <div className='w-5' />
        </div>
        <div className='p-6 max-w-7xl mx-auto'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

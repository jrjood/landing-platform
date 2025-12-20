import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Users, FolderKanban, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to='/admin/login' replace />;
  }

  return <AdminLayout />;
}

function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/admin/leads', label: 'Leads', icon: Users },
    { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
  ];

  return (
    <div className='flex h-screen bg-background'>
      {/* Sidebar */}
      <aside className='w-64 border-r bg-card'>
        <div className='flex h-16 items-center justify-center border-b px-6'>
          <h1 className='text-xl font-bold'>Admin Dashboard</h1>
        </div>

        <nav className='space-y-2 p-4'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className='w-full justify-start'
                >
                  <Icon className='mr-2 h-4 w-4' />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className='absolute bottom-0 w-64 border-t p-4'>
          <div className='mb-2 text-sm'>
            <p className='font-medium'>{user?.email}</p>
            <p className='text-muted-foreground'>Administrator</p>
          </div>
          <Button onClick={logout} variant='outline' className='w-full'>
            <LogOut className='mr-2 h-4 w-4' />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className='flex-1 overflow-auto'>
        <Outlet />
      </main>
    </div>
  );
}

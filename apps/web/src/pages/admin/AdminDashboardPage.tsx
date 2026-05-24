import { useEffect, useState } from 'react';
import { Activity, Users, TrendingUp, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getAdminLeads, getAdminProjects, type Lead, type Project, type LeadStats, getLeadStats } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      getLeadStats(token).catch(() => null),
      getAdminProjects(token).catch(() => []),
      getAdminLeads(token, { limit: '5', sortBy: 'leads.created_at', sortOrder: 'DESC' }).catch(() => ({ rows: [], total: 0 })),
    ]).then(([s, p, l]) => {
      setStats(s);
      setProjects(p);
      setRecentLeads(l.rows);
    }).finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;
  }

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500', contacted: 'bg-amber-500', qualified: 'bg-green-500', closed: 'bg-emerald-500', spam: 'bg-red-500',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total ?? 0}</div>
            <p className="text-xs text-muted-foreground">All time inquiries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.today ?? 0}</div>
            <p className="text-xs text-muted-foreground">Leads received today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">Active projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total ? Math.round(((stats.byStatus?.qualified || 0) / stats.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Qualified leads rate</p>
          </CardContent>
        </Card>
      </div>

      {stats?.byStatus && Object.keys(stats.byStatus).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lead Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} className="flex-1">
                  <div className="text-center">
                    <div className="text-lg font-bold">{count as number}</div>
                    <div className="text-xs text-muted-foreground capitalize">{status}</div>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${statusColors[status] || 'bg-gray-400'}`}
                      style={{ width: `${((count as number) / (stats?.total || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {stats && stats.topProjects && stats.topProjects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Top Projects by Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.topProjects.map((p, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span>{p.title}</span>
                    <span className="font-semibold">{p.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {recentLeads.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{lead.name}</span>
                      <span className="text-muted-foreground ml-2">{lead.phone}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                      lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                      lead.status === 'qualified' ? 'bg-green-100 text-green-700' :
                      lead.status === 'spam' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{lead.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

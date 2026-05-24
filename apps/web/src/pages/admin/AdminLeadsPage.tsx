import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getAdminLeads, deleteLead, updateLeadStatus, exportLeadsCsv,
  getAdminProjects,
  updateLead,
  type Lead,
  type Project,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2, Search, Download, Trash2, Phone, Mail, Building2, ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'closed', 'spam'] as const;
const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-800 border-blue-200',
  contacted: 'bg-amber-100 text-amber-800 border-amber-200',
  qualified: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  spam: 'bg-red-100 text-red-800 border-red-200',
};
const PAGE_SIZE = 20;

export function AdminLeadsPage() {
  const { token } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const [campaignFilter, setCampaignFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [notesDraft, setNotesDraft] = useState<Record<number, string>>({});
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const loadLeads = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const params: Record<string, string> = { page: page.toString(), limit: PAGE_SIZE.toString() };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (projectFilter) params.projectId = projectFilter;
      if (campaignFilter) params.campaign = campaignFilter;
      if (dateFrom) params.dateFrom = dateFrom;
      if (dateTo) params.dateTo = dateTo;
      const data = await getAdminLeads(token, params);
      setLeads(data.rows);
      setTotalCount(data.total);
    } catch (error) {
      toast.error('Failed to load leads');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [token, search, statusFilter, projectFilter, campaignFilter, dateFrom, dateTo, page]);

  useEffect(() => { loadLeads(); }, [loadLeads]);
  useEffect(() => {
    if (!token) return;
    getAdminProjects(token).then(setProjects).catch(() => setProjects([]));
  }, [token]);

  useEffect(() => { setPage(1); }, [search, statusFilter, projectFilter, campaignFilter, dateFrom, dateTo]);

  const buildExportParams = () => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    if (projectFilter) params.projectId = projectFilter;
    if (campaignFilter) params.campaign = campaignFilter;
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    return params;
  };

  const handleStatusChange = async (id: number, newStatus: Lead['status']) => {
    try {
      await updateLeadStatus(token!, id, newStatus);
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
      toast.success('Status updated');
    } catch { toast.error('Failed to update status'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this lead?')) return;
    try {
      setDeletingId(id);
      await deleteLead(token!, id);
      setLeads(leads.filter(l => l.id !== id));
      setTotalCount(c => c - 1);
      toast.success('Lead deleted');
    } catch { toast.error('Failed to delete'); }
    finally { setDeletingId(null); }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
    const lead = leads.find((l) => l.id === id);
    if (lead && notesDraft[id] === undefined) {
      setNotesDraft((prev) => ({ ...prev, [id]: lead.notes || '' }));
    }
  };

  const handleSaveNotes = async (id: number) => {
    try {
      await updateLead(token!, id, { notes: notesDraft[id] || '' });
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === id ? { ...lead, notes: notesDraft[id] || '' } : lead
        )
      );
      toast.success('Notes saved');
    } catch {
      toast.error('Failed to save notes');
    }
  };

  if (loading && leads.length === 0) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads ({totalCount})</h1>
          <p className="text-muted-foreground text-sm">Manage customer inquiries</p>
        </div>
        <Button
          onClick={() => exportLeadsCsv(token!, buildExportParams()).catch(() => toast.error('Export failed'))}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">All Status</option>
              {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
            <Input
              value={campaignFilter}
              onChange={(e) => setCampaignFilter(e.target.value)}
              placeholder="Campaign"
              className="w-36"
            />
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-40"
            />
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-40"
            />
            {(search || statusFilter || projectFilter || campaignFilter || dateFrom || dateTo) && (
              <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setStatusFilter(''); setProjectFilter(''); setCampaignFilter(''); setDateFrom(''); setDateTo(''); }}>
                <X className="w-4 h-4 mr-1" /> Clear
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No leads found</div>
          ) : (
            <div className="space-y-2">
              {leads.map((lead) => (
                <div key={lead.id} className="border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => toggleExpand(lead.id)}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{lead.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize border ${STATUS_COLORS[lead.status] || ''}`}>
                          {lead.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>
                        {lead.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</span>}
                        <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{lead.projectTitle || 'General'}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : ''}
                    </div>
                    <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(lead.id); }} disabled={deletingId === lead.id}>
                      {deletingId === lead.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4 text-red-500" />}
                    </Button>
                    {expandedId === lead.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>

                  {expandedId === lead.id && (
                    <div className="px-4 pb-4 border-t pt-3 space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div><span className="text-muted-foreground">Job Title:</span> <span className="font-medium">{lead.job_title || '-'}</span></div>
                        <div><span className="text-muted-foreground">Contact Method:</span> <span className="font-medium capitalize">{lead.preferred_contact_way || '-'}</span></div>
                        <div><span className="text-muted-foreground">Unit Type:</span> <span className="font-medium">{lead.unit_type || '-'}</span></div>
                        <div><span className="text-muted-foreground">Campaign:</span> <span className="font-medium">{lead.campaign || lead.utm_campaign || '-'}</span></div>
                        <div><span className="text-muted-foreground">UTM Source:</span> <span className="font-medium">{lead.utm_source || '-'}</span></div>
                        <div><span className="text-muted-foreground">UTM Medium:</span> <span className="font-medium">{lead.utm_medium || '-'}</span></div>
                        <div><span className="text-muted-foreground">Source URL:</span> <span className="font-medium truncate block max-w-[200px]">{lead.source_url || '-'}</span></div>
                        <div><span className="text-muted-foreground">Landing Host:</span> <span className="font-medium">{lead.landing_host || '-'}</span></div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <span className="text-muted-foreground">Notes</span>
                        <textarea
                          value={notesDraft[lead.id] ?? lead.notes ?? ''}
                          onChange={(e) =>
                            setNotesDraft((prev) => ({
                              ...prev,
                              [lead.id]: e.target.value,
                            }))
                          }
                          rows={3}
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          placeholder="Add sales notes, follow-up details, or qualification context"
                        />
                        <Button size="sm" variant="outline" onClick={() => handleSaveNotes(lead.id)}>
                          Save Notes
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Status:</span>
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'])}
                          className={`text-xs font-medium px-2 py-1 rounded border cursor-pointer ${STATUS_COLORS[lead.status] || ''}`}
                        >
                          {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t mt-4">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages} ({totalCount} total)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline" size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum: number;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (page <= 4) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = page - 3 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'default' : 'outline'}
                      size="sm"
                      className="w-8 h-8 p-0"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline" size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

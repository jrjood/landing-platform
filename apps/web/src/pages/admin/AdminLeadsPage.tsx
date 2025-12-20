import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  Mail,
  Phone,
  Trash2,
  Building2,
  Download,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getAdminLeads,
  deleteLead,
  updateLeadStatus,
  type Lead,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';

export function AdminLeadsPage() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }

    loadLeads();
  }, [token, navigate]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await getAdminLeads(token!);
      setLeads(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load leads');
      console.error(error);
      setLeads([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    try {
      setDeletingId(id);
      await deleteLead(token!, id);
      setLeads(leads.filter((lead) => lead.id !== id));
      toast.success('Lead deleted successfully');
    } catch (error) {
      toast.error('Failed to delete lead');
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (
    id: number,
    newStatus: 'new' | 'qualified' | 'spam'
  ) => {
    try {
      await updateLeadStatus(token!, id, newStatus);
      setLeads(
        leads.map((lead) =>
          lead.id === id ? { ...lead, status: newStatus } : lead
        )
      );
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'qualified':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'spam':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleExportCSV = () => {
    // Format date for CSV (YYYY-MM-DD format to avoid comma issues)
    const formatDateForCSV = (dateString: string | Date) => {
      if (!dateString) return 'N/A';
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toISOString().split('T')[0]; // YYYY-MM-DD format
      } catch (error) {
        return 'Invalid Date';
      }
    };

    // Create CSV content with proper escaping
    const headers = [
      'Name',
      'Phone',
      'Email',
      'Job Title',
      'Contact Method',
      'Project',
      'Unit Type',
      'Date',
      'Status',
    ];
    const csvRows = [
      headers.join(','),
      ...leads.map((lead) =>
        [
          `"${lead.name}"`,
          `"${lead.phone}"`,
          `"${lead.email || ''}"`,
          `"${lead.job_title || ''}"`,
          `"${lead.preferred_contact_way || ''}"`,
          `"${lead.projectTitle || 'General'}"`,
          `"${lead.unit_type || ''}"`,
          `="${formatDateForCSV(
            (lead.created_at || lead.createdAt) as string
          )}"`,
          `"${lead.status}"`,
        ].join(',')
      ),
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `leads_${new Date().toISOString().split('T')[0]}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('CSV file downloaded successfully');
  };

  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <Loader2 className='w-8 h-8 animate-spin text-burgundy' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white border-b'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <h1 className='text-2xl font-bold text-gray-900'>Admin Dashboard</h1>
          <div className='flex items-center gap-4'>
            <Button
              variant='outline'
              onClick={() => navigate('/admin/projects')}
            >
              Projects
            </Button>
            <Button variant='outline' onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='container mx-auto px-4 py-8'>
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <div>
                <CardTitle>Leads</CardTitle>
                <CardDescription>
                  Manage customer inquiries and leads from your projects
                </CardDescription>
              </div>
              <Button
                onClick={handleExportCSV}
                variant='outline'
                className='gap-2'
                disabled={leads.length === 0}
              >
                <Download className='w-4 h-4' />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {leads.length === 0 ? (
              <div className='text-center py-12 text-gray-500'>
                No leads yet
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Contact Method</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Unit Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className='text-right'>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className='font-medium whitespace-nowrap'>
                          {lead.name}
                        </TableCell>
                        <TableCell className='whitespace-nowrap'>
                          <div className='flex items-center gap-2 text-sm'>
                            <Phone className='w-3 h-3 text-gray-400' />
                            {lead.phone}
                          </div>
                        </TableCell>
                        <TableCell className='whitespace-nowrap text-sm'>
                          {lead.email ? (
                            <div className='flex items-center gap-2'>
                              <Mail className='w-3 h-3 text-gray-400' />
                              {lead.email}
                            </div>
                          ) : (
                            <span className='text-gray-400'>-</span>
                          )}
                        </TableCell>
                        <TableCell className='whitespace-nowrap text-sm'>
                          {lead.job_title || (
                            <span className='text-gray-400'>-</span>
                          )}
                        </TableCell>
                        <TableCell className='whitespace-nowrap text-sm capitalize'>
                          {lead.preferred_contact_way || (
                            <span className='text-gray-400'>-</span>
                          )}
                        </TableCell>
                        <TableCell className='whitespace-nowrap'>
                          {lead.projectTitle ? (
                            <div className='flex items-center gap-2'>
                              <Building2 className='w-3 h-3 text-gray-400' />
                              <span className='text-sm'>
                                {lead.projectTitle}
                              </span>
                            </div>
                          ) : (
                            <span className='text-gray-400 text-sm'>
                              General
                            </span>
                          )}
                        </TableCell>
                        <TableCell className='whitespace-nowrap text-sm'>
                          {lead.unit_type || (
                            <span className='text-gray-400'>-</span>
                          )}
                        </TableCell>
                        <TableCell className='whitespace-nowrap text-sm text-gray-600'>
                          {formatDate(
                            (lead.created_at || lead.createdAt) as string
                          )}
                        </TableCell>
                        <TableCell className='whitespace-nowrap'>
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              handleStatusChange(
                                lead.id,
                                e.target.value as 'new' | 'qualified' | 'spam'
                              )
                            }
                            className={`text-xs font-medium px-2 py-1 rounded border cursor-pointer ${getStatusBadgeColor(
                              lead.status
                            )}`}
                          >
                            <option value='new'>New</option>
                            <option value='qualified'>Qualified</option>
                            <option value='spam'>Spam</option>
                          </select>
                        </TableCell>
                        <TableCell className='text-right whitespace-nowrap'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => handleDelete(lead.id)}
                            disabled={deletingId === lead.id}
                          >
                            {deletingId === lead.id ? (
                              <Loader2 className='w-4 h-4 animate-spin' />
                            ) : (
                              <Trash2 className='w-4 h-4 text-red-500' />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

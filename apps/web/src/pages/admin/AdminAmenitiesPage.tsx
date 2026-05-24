import { useEffect, useMemo, useState } from 'react';
import { Edit, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  createAmenity,
  deleteAmenity,
  getAdminAmenities,
  getAmenityCategories,
  updateAmenity,
  type Amenity,
} from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  AMENITY_ICON_OPTIONS,
  getAmenityIcon,
  getAmenityIconLabel,
} from '@/lib/amenityIcons';

type AmenityForm = {
  name: string;
  icon: string;
  category: string;
  description: string;
  isActive: boolean;
};

const emptyForm: AmenityForm = {
  name: '',
  icon: 'check',
  category: 'Lifestyle',
  description: '',
  isActive: true,
};

function normalizeActive(value: Amenity['isActive'] | number) {
  return value !== false && value !== 0;
}

export function AdminAmenitiesPage() {
  const { token } = useAuth();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Amenity | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [form, setForm] = useState<AmenityForm>(emptyForm);

  const loadAmenities = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const [amenitiesData, categoriesData] = await Promise.all([
        getAdminAmenities(token),
        getAmenityCategories(token),
      ]);
      setAmenities(amenitiesData);
      setCategories(categoriesData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load amenities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAmenities();
  }, [token]);

  const visibleAmenities = useMemo(() => {
    return amenities.filter((amenity) => !categoryFilter || amenity.category === categoryFilter);
  }, [amenities, categoryFilter]);

  const groupedAmenities = useMemo(() => {
    return visibleAmenities.reduce<Record<string, Amenity[]>>((groups, amenity) => {
      const category = amenity.category || 'Uncategorized';
      groups[category] = [...(groups[category] || []), amenity];
      return groups;
    }, {});
  }, [visibleAmenities]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (amenity: Amenity) => {
    setEditing(amenity);
    setForm({
      name: amenity.name || '',
      icon: amenity.icon || 'check',
      category: amenity.category || 'Lifestyle',
      description: amenity.description || '',
      isActive: normalizeActive(amenity.isActive),
    });
    setDialogOpen(true);
  };

  const saveAmenity = async () => {
    if (!token) return;
    if (!form.name.trim()) {
      toast.error('Amenity name is required');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...form,
        name: form.name.trim(),
        category: form.category.trim() || 'Uncategorized',
        description: form.description.trim(),
      };

      if (editing?.id) {
        await updateAmenity(token, editing.id, payload);
        toast.success('Amenity updated');
      } else {
        await createAmenity(token, payload);
        toast.success('Amenity created');
      }

      setDialogOpen(false);
      await loadAmenities();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save amenity');
    } finally {
      setSaving(false);
    }
  };

  const removeAmenity = async (amenity: Amenity) => {
    if (!token) return;
    if (!amenity.id) return;
    if (!window.confirm(`Delete ${amenity.name}?`)) return;

    try {
      await deleteAmenity(token, amenity.id);
      toast.success('Amenity deleted');
      await loadAmenities();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete amenity');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Amenities Library</h1>
          <p className="text-muted-foreground">
            Manage reusable amenity records and icons for project landing pages.
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Amenity
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <span className="text-sm text-muted-foreground">
            {visibleAmenities.length} amenities shown
          </span>
        </CardContent>
      </Card>

      {visibleAmenities.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            No amenities found for this filter.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedAmenities).map(([category, items]) => (
            <section key={category} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{category}</h2>
                <span className="text-sm text-muted-foreground">{items.length} items</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((amenity) => (
                  <Card key={amenity.id}>
                    <CardContent className="space-y-4 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">{amenity.name}</h3>
                            {!normalizeActive(amenity.isActive) && (
                              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                Inactive
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {amenity.description || 'No description'}
                          </p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs text-muted-foreground">
                          {(() => {
                            const Icon = getAmenityIcon(amenity.icon);
                            return <Icon className="h-3.5 w-3.5" />;
                          })()}
                          {getAmenityIconLabel(amenity.icon)}
                        </span>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEdit(amenity)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => removeAmenity(amenity)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Amenity' : 'Create Amenity'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="space-y-2 text-sm font-medium">
              <span>Name</span>
              <Input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="Swimming Pool"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 text-sm font-medium sm:col-span-2">
                <span>Icon</span>
                <div className="grid max-h-56 gap-2 overflow-y-auto rounded-lg border p-2 sm:grid-cols-3">
                  {AMENITY_ICON_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const active = form.icon === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setForm({ ...form, icon: option.value })}
                        className={`flex items-center gap-2 rounded-md border px-3 py-2 text-left text-xs transition ${
                          active
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:bg-muted/70'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>
                          <span className="block font-semibold">{option.label}</span>
                          <span className="block text-[10px] text-muted-foreground">{option.value}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="space-y-2 text-sm font-medium">
                <span>Category</span>
                <Input
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                  placeholder="Wellness"
                  list="amenity-categories"
                />
                <datalist id="amenity-categories">
                  {categories.map((category) => (
                    <option key={category} value={category} />
                  ))}
                </datalist>
              </label>
            </div>

            <label className="space-y-2 text-sm font-medium">
              <span>Description</span>
              <Input
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Optional short description"
              />
            </label>

            <label className="flex items-center gap-3 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) => setForm({ ...form, isActive: event.target.checked })}
                className="h-4 w-4 rounded border-input"
              />
              Active on project pages
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveAmenity} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Amenity
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

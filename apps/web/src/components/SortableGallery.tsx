import { useCallback } from 'react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, GripVertical } from 'lucide-react';

interface GalleryItem {
  url: string;
  alt: string;
}

interface SortableGalleryProps {
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
  onItemChange: (idx: number, field: string, value: string) => void;
  onRemove: (idx: number) => void;
  onUpload: (idx: number, file: File) => void;
  onAddFromUpload: (file: File) => void;
  onAddUrl: () => void;
}

function SortableImage({ item, idx, onItemChange, onRemove, onUpload }: {
  item: GalleryItem; idx: number;
  onItemChange: (idx: number, field: string, value: string) => void;
  onRemove: (idx: number) => void;
  onUpload: (idx: number, file: File) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: `gallery-${idx}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="border rounded-lg p-3 space-y-2 relative group bg-card">
      <div className="flex items-center gap-2 mb-1">
        <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded" title="Drag to reorder">
          <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <span className="text-xs text-muted-foreground">#{idx + 1}</span>
      </div>
      {item.url ? (
        <div className="relative h-28 rounded-md overflow-hidden bg-muted">
          <img src={item.url} alt={item.alt || ''} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        </div>
      ) : (
        <div className="h-28 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">No image</div>
      )}
      <div className="flex gap-2">
        <Input value={item.url} onChange={(e) => onItemChange(idx, 'url', e.target.value)} placeholder="Image URL" className="text-xs h-8" />
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0" onClick={() => {
          const input = document.createElement('input');
          input.type = 'file'; input.accept = 'image/*';
          input.onchange = (e: any) => onUpload(idx, e.target.files[0]);
          input.click();
        }} title="Upload"><Upload className="w-3.5 h-3.5" /></Button>
      </div>
      <Input value={item.alt} onChange={(e) => onItemChange(idx, 'alt', e.target.value)} placeholder="Alt text (SEO)" className="text-xs h-8" />
      <Button variant="ghost" size="sm" className="absolute top-1 right-1 h-6 w-6 p-0 bg-background/80 backdrop-blur opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => onRemove(idx)}><X className="w-3 h-3" /></Button>
    </div>
  );
}

export function SortableGallery({ items, onChange, onItemChange, onRemove, onUpload, onAddFromUpload, onAddUrl }: SortableGalleryProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = parseInt(String(active.id).replace('gallery-', ''));
    const newIdx = parseInt(String(over.id).replace('gallery-', ''));
    onChange(arrayMove(items, oldIdx, newIdx));
  }, [items, onChange]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Gallery ({items.length} images)</label>
        <div className="flex gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => {
            const input = document.createElement('input');
            input.type = 'file'; input.accept = 'image/*';
            input.onchange = (e: any) => onAddFromUpload(e.target.files[0]);
            input.click();
          }}><Upload className="w-3.5 h-3.5 mr-1" />Upload</Button>
          <Button type="button" size="sm" variant="outline" onClick={onAddUrl}>Add URL</Button>
        </div>
      </div>
      {items.length === 0 && <p className="text-xs text-muted-foreground">No images added</p>}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((_, i) => `gallery-${i}`)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((item, idx) => (
              <SortableImage key={`gallery-${idx}`} item={item} idx={idx} onItemChange={onItemChange} onRemove={onRemove} onUpload={onUpload} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

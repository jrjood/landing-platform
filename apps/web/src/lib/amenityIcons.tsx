import type { LucideIcon } from 'lucide-react';
import {
  Baby,
  Bike,
  Building2,
  Car,
  Check,
  Coffee,
  Dumbbell,
  Flower2,
  Home,
  Leaf,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trees,
  Utensils,
  Waves,
  Wifi,
} from 'lucide-react';

export type AmenityIconOption = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export const AMENITY_ICON_OPTIONS: AmenityIconOption[] = [
  { value: 'check', label: 'General', icon: Check },
  { value: 'building', label: 'Buildings', icon: Building2 },
  { value: 'home', label: 'Homes', icon: Home },
  { value: 'car', label: 'Parking', icon: Car },
  { value: 'leaf', label: 'Greenery', icon: Leaf },
  { value: 'trees', label: 'Landscape', icon: Trees },
  { value: 'waves', label: 'Water', icon: Waves },
  { value: 'shield', label: 'Security', icon: ShieldCheck },
  { value: 'sparkles', label: 'Premium', icon: Sparkles },
  { value: 'wifi', label: 'Connectivity', icon: Wifi },
  { value: 'dumbbell', label: 'Fitness', icon: Dumbbell },
  { value: 'map-pin', label: 'Location', icon: MapPin },
  { value: 'coffee', label: 'Cafe', icon: Coffee },
  { value: 'utensils', label: 'Dining', icon: Utensils },
  { value: 'shopping', label: 'Retail', icon: ShoppingBag },
  { value: 'bike', label: 'Cycling', icon: Bike },
  { value: 'family', label: 'Family', icon: Baby },
  { value: 'flower', label: 'Gardens', icon: Flower2 },
];

export function getAmenityIcon(icon?: string | null): LucideIcon {
  return AMENITY_ICON_OPTIONS.find((option) => option.value === icon)?.icon || Check;
}

export function getAmenityIconLabel(icon?: string | null): string {
  return AMENITY_ICON_OPTIONS.find((option) => option.value === icon)?.label || 'General';
}

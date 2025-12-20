import * as React from 'react';
import { cn } from '@/lib/utils';

interface ToggleGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const ToggleGroup: React.FC<ToggleGroupProps> = ({
  value,
  onValueChange,
  children,
  className,
}) => {
  return (
    <div className={cn('flex gap-2', className)} role='group'>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isActive: child.props.value === value,
            onClick: () => onValueChange(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
};

interface ToggleGroupItemProps {
  value: string;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const ToggleGroupItem: React.FC<ToggleGroupItemProps> = ({
  children,
  isActive,
  onClick,
  className,
}) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors',
        'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        isActive && 'bg-primary !text-white hover:bg-primary/90',
        className
      )}
    >
      {children}
    </button>
  );
};

export { ToggleGroup, ToggleGroupItem };

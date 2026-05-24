import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Loader2 } from 'lucide-react';

type LoadingContextValue = {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};

const LoadingContext = createContext<LoadingContextValue | undefined>(
  undefined
);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [activeCount, setActiveCount] = useState(0);
  const countRef = useRef(activeCount);
  countRef.current = activeCount;

  const isLoading = activeCount > 0;

  const startLoading = useCallback(() => {
    setActiveCount((count) => count + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setActiveCount((count) => (count > 0 ? count - 1 : 0));
  }, []);

  // Safety: auto-reset after 8s to prevent stuck overlay
  useEffect(() => {
    if (!isLoading) return;
    const timer = setTimeout(() => {
      if (countRef.current > 0) {
        setActiveCount(0);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  const value = useMemo(
    () => ({
      isLoading,
      startLoading,
      stopLoading,
    }),
    [isLoading, startLoading, stopLoading]
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {isLoading && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur'>
          <Loader2 className='h-10 w-10 animate-spin text-burgundy' />
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useGlobalLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useGlobalLoading must be used within LoadingProvider');
  }
  return context;
}

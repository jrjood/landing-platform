import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { createLead } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneCall, X, Loader2 } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone required'),
});

interface StickyLeadBarProps {
  projectSlug: string;
  projectTitle: string;
}

export function StickyLeadBar({ projectSlug, projectTitle }: StickyLeadBarProps) {
  const [visible, setVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await createLead({
        name: data.name,
        phone: data.phone,
        projectSlug,
        sourceUrl: window.location.href,
        landingHost: window.location.hostname,
        preferredContactWay: 'whatsapp',
      });
      toast.success("Inquiry submitted! We'll call you shortly.");
      reset();
    } catch {
      toast.error('Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className='fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden'
        >
          <div className='container mx-auto px-4 py-3'>
            <div className='flex items-center gap-3'>
              <div className='flex-1 min-w-0'>
                <p className='text-xs font-semibold text-foreground truncate'>{projectTitle}</p>
                <p className='text-[10px] text-muted-foreground'>Request a call back</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className='flex items-center gap-2 flex-1'>
                <div className='relative flex-1'>
                  <Input
                    {...register('name')}
                    placeholder='Name *'
                    className={`h-9 text-xs ${errors.name ? 'border-destructive' : ''}`}
                  />
                </div>
                <div className='relative flex-1'>
                  <Input
                    {...register('phone')}
                    placeholder='Phone *'
                    className={`h-9 text-xs ${errors.phone ? 'border-destructive' : ''}`}
                    type='tel'
                  />
                </div>
                <Button type='submit' size='sm' className='h-9 whitespace-nowrap gap-1' disabled={isSubmitting}>
                  {isSubmitting
                    ? <Loader2 className='w-3 h-3 animate-spin' />
                    : <PhoneCall className='w-3 h-3' />
                  }
                  <span className='text-xs'>Call Me</span>
                </Button>
              </form>
              <button onClick={() => setVisible(false)} className='flex-shrink-0 p-1' aria-label='Close'>
                <X className='w-4 h-4 text-muted-foreground hover:text-foreground transition-colors' />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

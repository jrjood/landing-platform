import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { createLead } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, PhoneCall } from 'lucide-react';
import { ShineButton } from './lightswind/shine-button';

const leadFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(50),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  honeypot: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  projectSlug: string;
}

const shakeVariants = {
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.4 },
  },
};

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          className='absolute -top-2 right-2 -translate-y-full rounded-md bg-destructive/95 px-2 py-1 text-[11px] text-white shadow-md whitespace-nowrap'
        >
          {message}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export function LeadForm({ projectSlug }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    if (data.honeypot) {
      toast.error('Invalid submission');
      return;
    }

    setIsSubmitting(true);

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const leadData: any = {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        preferredContactWay: 'whatsapp',
        projectSlug,
        sourceUrl: window.location.href,
        landingHost: window.location.hostname,
        campaign: searchParams.get('campaign') || undefined,
        utm: {
          source: searchParams.get('utm_source') || '',
          medium: searchParams.get('utm_medium') || '',
          campaign: searchParams.get('utm_campaign') || '',
          content: searchParams.get('utm_content') || '',
          term: searchParams.get('utm_term') || '',
        },
      };

      await createLead(leadData);
      toast.success('Thank you! Your inquiry has been submitted successfully.');
      reset();
    } catch (error: any) {
      console.error('Lead submission error:', error);
      toast.error(
        error.response?.data?.error || 'Failed to submit. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className='lead-form space-y-3'>
      <input
        type='text'
        {...register('honeypot')}
        style={{ position: 'absolute', left: '-9999px' }}
        tabIndex={-1}
        autoComplete='off'
      />

      <motion.div
        variants={isShaking ? shakeVariants : undefined}
        animate={isShaking ? 'shake' : undefined}
        className='grid gap-2 md:grid-cols-1'
      >
        <div className='space-y-1 relative'>
          <Label htmlFor='name' className='sr-only'>
            Full Name
          </Label>
          <Input
            id='name'
            placeholder='Full Name *'
            {...register('name')}
            className={`lead-form__input h-11 text-sm focus-visible:ring-0 ${
              errors.name
                ? 'border-destructive ring-1 ring-destructive/30'
                : 'border-white/50'
            }`}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div className='space-y-1 relative'>
          <Label htmlFor='phone' className='sr-only'>
            Phone Number
          </Label>
          <Input
            id='phone'
            type='tel'
            placeholder='Phone Number *'
            {...register('phone')}
            className={`lead-form__input h-11 text-sm focus-visible:ring-0 ${
              errors.phone
                ? 'border-destructive ring-1 ring-destructive/30'
                : 'border-white/50'
            }`}
          />
          <FieldError message={errors.phone?.message} />
        </div>

        <div className='space-y-1 relative'>
          <Label htmlFor='email' className='sr-only'>
            Email
          </Label>
          <Input
            id='email'
            type='email'
            placeholder='Email'
            {...register('email')}
            className={`lead-form__input h-11 text-sm focus-visible:ring-0 ${
              errors.email
                ? 'border-destructive ring-1 ring-destructive/30'
                : 'border-white/50'
            }`}
          />
          <FieldError message={errors.email?.message} />
        </div>
      </motion.div>

      {isSubmitting ? (
        <Button type='submit' size='lg' className='h-11 w-full px-0' disabled>
          <span className='flex items-center justify-center gap-2 w-full'>
            <Loader2 className='h-4 w-4 animate-spin' />
            Submitting...
          </span>
        </Button>
      ) : (
        <ShineButton
          type='submit'
          label={
            <>
              <PhoneCall className='ml-1.5 h-4 w-4' /> Request a Call
            </>
          }
          size='lg'
          bgColor='linear-gradient(325deg, #c69a5c 0%, #f3d8a0 55%, #c69a5c 90%)'
          className='lead-form__submit h-12 w-full text-sm'
        />
      )}
    </form>
  );
}

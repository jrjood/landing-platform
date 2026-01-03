import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { toast } from 'sonner';
import { createLead } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { MessageCircle, Phone, Loader2 } from 'lucide-react';

const UNIT_TYPES = ['Standalone Villa', 'Twin Villa'];

const leadFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(50),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
  jobTitle: z.string().max(255).optional().or(z.literal('')),
  preferredContactWay: z.enum(['whatsapp', 'call'], {
    required_error: 'Please select your preferred contact method',
  }),
  unitType: z.string().min(1, 'Please select a unit type'),
  honeypot: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  projectSlug: string;
}

export function LeadForm({ projectSlug }: LeadFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  const preferredContactWay = watch('preferredContactWay');

  const onSubmit = async (data: LeadFormData) => {
    // Honeypot check
    if (data.honeypot) {
      toast.error('Invalid submission');
      return;
    }

    setIsSubmitting(true);

    try {
      const leadData: any = {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        job_title: data.jobTitle || undefined,
        preferred_contact_way: data.preferredContactWay,
        unit_type: data.unitType,
        projectSlug: projectSlug, // Send slug instead of ID
      };

      await createLead(leadData);

      toast.success('Thank you! Your inquiry has been submitted successfully.');
      reset();
    } catch (error: any) {
      console.error('Lead submission error:', error);
      toast.error(
        error.response?.data?.error || 'Failed to submit. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Honeypot field - hidden from users */}
      <input
        type='text'
        {...register('honeypot')}
        style={{ position: 'absolute', left: '-9999px' }}
        tabIndex={-1}
        autoComplete='off'
      />

      <div className='grid gap-6 md:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='name'>
            Full Name <span className='text-destructive'>*</span>
          </Label>
          <Input
            id='name'
            placeholder='Enter your full name'
            {...register('name')}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className='text-sm text-destructive'>{errors.name.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='phone'>
            Phone Number <span className='text-destructive'>*</span>
          </Label>
          <Input
            id='phone'
            type='tel'
            placeholder='+20 123 456 7890'
            {...register('phone')}
            className={errors.phone ? 'border-destructive' : ''}
          />
          {errors.phone && (
            <p className='text-sm text-destructive'>{errors.phone.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='email'>Email (Optional)</Label>
          <Input
            id='email'
            type='email'
            placeholder='your.email@example.com'
            {...register('email')}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className='text-sm text-destructive'>{errors.email.message}</p>
          )}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='jobTitle'>Job Title (Optional)</Label>
          <Input
            id='jobTitle'
            placeholder='e.g., Engineer, Doctor'
            {...register('jobTitle')}
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label>
          Preferred Contact Method <span className='text-destructive'>*</span>
        </Label>
        <ToggleGroup
          value={preferredContactWay}
          onValueChange={(value) =>
            setValue('preferredContactWay', value as 'whatsapp' | 'call')
          }
          className='justify-start'
        >
          <ToggleGroupItem value='whatsapp'>
            <MessageCircle className='mr-2 h-4 w-4' />
            WhatsApp
          </ToggleGroupItem>
          <ToggleGroupItem value='call'>
            <Phone className='mr-2 h-4 w-4' />
            Call
          </ToggleGroupItem>
        </ToggleGroup>
        {errors.preferredContactWay && (
          <p className='text-sm text-destructive'>
            {errors.preferredContactWay.message}
          </p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='unitType'>
          Unit Type <span className='text-destructive'>*</span>
        </Label>
        <Select
          id='unitType'
          {...register('unitType')}
          className={errors.unitType ? 'border-destructive' : ''}
        >
          <option value=''>Select unit type</option>
          {UNIT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
        {errors.unitType && (
          <p className='text-sm text-destructive'>{errors.unitType.message}</p>
        )}
      </div>

      <Button
        type='submit'
        size='lg'
        className='w-full'
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            Submitting...
          </>
        ) : (
          'Request Now'
        )}
      </Button>

      <p className='text-center text-xs text-muted-foreground'>
        By submitting this form, you agree to be contacted by our team regarding
        your inquiry.
      </p>
    </form>
  );
}

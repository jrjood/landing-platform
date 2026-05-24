import { Project } from '@/lib/api';
import { LeadForm } from '@/components/LeadForm';
import { Mail, MessageCircle, Phone } from 'lucide-react';

interface ContactSectionProps {
  project: Project;
}

export function ContactSection({ project }: ContactSectionProps) {
  return (
    <section id='contact-form' className='project-contact'>
      <div className='container mx-auto px-4'>
        <div className='project-contact__grid'>
          <div>
            <p className='brand-eyebrow'>Ready to elevate your lifestyle?</p>
            <h2>Book your dream home today.</h2>
            <p>{project.subtitle}</p>
            <div className='mt-6 grid gap-4'>
                <a
                  href='tel:+201121898883'
                  className='flex items-center gap-3 text-white/90 hover:text-white transition-colors'
                >
                  <div className='rounded-lg bg-white/20 p-2'>
                    <MessageCircle className='h-4 w-4' />
                  </div>
                  <span className='text-sm'>+20 112 189 8883</span>
                </a>

                <a
                  href='tel:+201100082530'
                  className='flex items-center gap-3 text-white/90 hover:text-white transition-colors'
                >
                  <div className='rounded-lg bg-white/20 p-2'>
                    <MessageCircle className='h-4 w-4' />
                  </div>
                  <span className='text-sm'>+20 110 008 2530</span>
                </a>
                <a
                  href='tel:19640'
                  className='flex items-center gap-3 text-white/90 hover:text-white transition-colors'
                >
                  <div className='rounded-lg bg-white/20 p-2'>
                    <Phone className='h-4 w-4' />
                  </div>
                  <span className='text-sm'>Hotline: 19640</span>
                </a>
                <a
                  href='mailto:info@wealthholding-eg.com'
                  className='flex items-center gap-3 text-white/90 hover:text-white transition-colors'
                >
                  <div className='rounded-lg bg-white/20 p-2'>
                    <Mail className='h-4 w-4' />
                  </div>
                  <span className='text-sm'>info@wealthholding-eg.com</span>
                </a>
            </div>
          </div>
          <div className='project-contact__form'>
            <LeadForm projectSlug={project.slug} />
          </div>
        </div>
      </div>
    </section>
  );
}

import { Project } from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { LeadForm } from '@/components/LeadForm';
import { Phone, Mail, MessageCircle } from 'lucide-react';

interface ContactSectionProps {
  project: Project;
}

export function ContactSection({ project }: ContactSectionProps) {
  return (
    <section id='contact-form' className='bg-muted py-14'>
      <div className='container mx-auto px-4'>
        <h2 className='mb-12 text-center text-4xl font-bold'>Get in Touch</h2>

        <div className='grid gap-0 lg:grid-cols-5 lg:items-stretch'>
          {/* Right Side - Contact Form */}
          <div className='lg:col-span-3 flex flex-col'>
            <Card className='shadow-xl flex-1 flex flex-col rounded-none rounded-l-2xl max-lg:rounded-t-2xl max-lg:rounded-b-none'>
              <CardContent className='p-8 flex-1 flex flex-col'>
                <div className='mb-6'>
                  <h3 className='text-2xl font-bold mb-2'>
                    Request Information
                  </h3>
                  <p className='text-muted-foreground'>
                    Fill out the form below and our team will contact you
                    shortly.
                  </p>
                </div>
                <LeadForm projectSlug={project.slug} />
              </CardContent>
            </Card>
          </div>
          {/* Left Side - Project Info with Background */}
          <div
            className='lg:col-span-2 space-y-8 rounded-r-2xl p-8 relative overflow-hidden flex flex-col max-lg:rounded-b-2xl max-lg:rounded-t-none '
            style={{
              backgroundImage: `linear-gradient(rgba(111, 19, 34, 0.85), rgba(111, 19, 34, 0.9)), url(${
                project.gallery[1]?.url ||
                project.gallery[0]?.url ||
                project.heroImage
              })`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Project Logo/Name */}
            <div className='text-center lg:text-left relative z-10 flex gap-4 items-center'>
              <div>
                <h3 className='text-3xl font-bold mb-2 text-white drop-shadow-lg'>
                  {project.title}
                </h3>
                <p className='text-lg text-white/90 drop-shadow'>
                  {project.subtitle}
                </p>
              </div>
            </div>

            {/* Contact Info */}

            {/* Social Media */}
            <div className='relative z-10'>
              <h4 className='mb-4 text-lg font-semibold text-white drop-shadow'>
                Find Us
              </h4>
              <div className='flex gap-3'>
                <a
                  href='https://www.facebook.com/WealthHolding/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition-all hover:bg-white hover:text-primary hover:scale-110 hover:shadow-xl'
                  aria-label='Facebook'
                >
                  <svg
                    className='h-5 w-5'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                  </svg>
                </a>
                <a
                  href='https://www.instagram.com/wealthholding/'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition-all hover:bg-white hover:text-primary hover:scale-110 hover:shadow-xl'
                  aria-label='Instagram'
                >
                  <svg
                    className='h-5 w-5'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' />
                  </svg>
                </a>
                <a
                  href='https://www.youtube.com/@wealthholding'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition-all hover:bg-white hover:text-primary hover:scale-110 hover:shadow-xl'
                  aria-label='YouTube'
                >
                  <svg
                    className='h-5 w-5'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' />
                  </svg>
                </a>
                <a
                  href='https://www.linkedin.com/company/wealth-holding-developments/posts/?feedView=all'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white transition-all hover:bg-white hover:text-primary hover:scale-110 hover:shadow-xl'
                  aria-label='LinkedIn'
                >
                  <svg
                    className='h-5 w-5'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                  </svg>
                </a>
              </div>

              {/* Contact Information */}
              <div className='mt-6  grid grid-cols-1 max-sm:grid-cols-2 gap-4'>
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
          </div>
        </div>
      </div>
    </section>
  );
}

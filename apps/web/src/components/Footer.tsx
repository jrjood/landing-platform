import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle newsletter subscription
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    console.log('Newsletter subscription:', email);
    // TODO: Implement newsletter subscription logic
  };

  return (
    <footer className='border-t bg-gradient-to-b from-muted/30 to-muted/50'>
      <div className='container mx-auto px-4'>
        {/* Main Footer Content */}
        <div className='py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
          {/* Company Info */}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-12 w-12 items-center justify-center '>
                <img
                  src='/icon_Wealth.png'
                  alt='Wealth Holding Developments'
                  className='h-full w-full object-contain'
                />
              </div>
              <div>
                <h3 className='text-lg font-bold'>Wealth Holding</h3>
                <p className='text-xs text-muted-foreground'>Developments</p>
              </div>
            </div>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              Discover your dream property with our exclusive collection of
              premium real estate developments.
            </p>

            {/* Social Icons */}
            <div className='flex gap-3 pt-2'>
              <a
                href='https://www.facebook.com/WealthHolding/'
                target='_blank'
                rel='noopener noreferrer'
                className='flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white transition-all hover:scale-110'
                aria-label='Facebook'
              >
                <svg
                  className='h-4 w-4'
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
                className='flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white transition-all hover:scale-110'
                aria-label='Instagram'
              >
                <svg
                  className='h-4 w-4'
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
                className='flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white transition-all hover:scale-110'
                aria-label='YouTube'
              >
                <svg
                  className='h-4 w-4'
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
                className='flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-primary hover:text-white transition-all hover:scale-110'
                aria-label='LinkedIn'
              >
                <svg
                  className='h-4 w-4'
                  fill='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h4 className='text-sm font-semibold uppercase tracking-wider'>
              Quick Links
            </h4>
            <ul className='space-y-3'>
              <li>
                <a
                  href='https://wealthholding-eg.com/'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href='https://wealthholding-eg.com/projects/'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href='https://wealthholding-eg.com/about/'
                  className='text-sm text-muted-foreground hover:text-primary transition-colors'
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className='space-y-4'>
            <h4 className='text-sm font-semibold uppercase tracking-wider'>
              Contact Us
            </h4>
            <ul className='space-y-3'>
              <li className='flex items-start gap-3 text-sm   group'>
                <MapPin className='h-5 w-5 flex-shrink-0 mt-0.5 group-hover:text-primary transition-colors' />
                <a
                  href='#'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Ground Floor, 235 Office Building - Section 2, N Teseen, New
                  Cairo 1, Cairo, Egypt
                </a>
              </li>

              <li className='flex items-center gap-3 text-sm group'>
                <Phone className='h-5 w-5 flex-shrink-0 group-hover:text-primary transition-colors' />
                <a
                  href='tel:19640'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  Hotline: 19640
                </a>
              </li>
              <li className='flex items-center gap-3 text-sm group'>
                <Mail className='h-5 w-5 flex-shrink-0 group-hover:text-primary transition-colors' />
                <a
                  href='mailto:info@wealthholding-eg.com'
                  className='text-muted-foreground hover:text-primary transition-colors'
                >
                  info@wealthholding-eg.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className='space-y-4'>
            <h4 className='text-sm font-semibold uppercase tracking-wider'>
              Newsletter
            </h4>
            <p className='text-sm text-muted-foreground'>
              Subscribe to get updates on new properties and exclusive offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className='space-y-3'>
              <div className='flex flex-row   gap-2'>
                <Input
                  type='email'
                  name='email'
                  placeholder='Enter your email'
                  required
                  className='flex-1'
                />
                <Button
                  type='submit'
                  size='icon'
                  className='!text-white uppercase'
                >
                  <Send className='h-4 w-4' />
                  <span className='sr-only'>Subscribe</span>
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t py-6'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            <p className='text-sm text-muted-foreground text-center sm:text-left'>
              &copy; 2026 Wealth Holding Developments. All rights reserved.
            </p>
            <div className='flex gap-6'>
              <a
                href='/terms'
                className='text-sm text-muted-foreground hover:text-primary transition-colors'
              >
                Terms of Service
              </a>
              <a
                href='https://wealthholding-eg.com/privacy-policy/'
                className='text-sm text-muted-foreground hover:text-primary transition-colors'
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

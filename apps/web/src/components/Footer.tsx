import { Building, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

const socials = [
  {
    href: 'https://www.facebook.com/WealthHolding/',
    label: 'Facebook',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    href: 'https://www.instagram.com/wealthholding/',
    label: 'Instagram',
    path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  {
    href: 'https://wa.me/201121898883',
    label: 'WhatsApp',
    path: 'M20.52 3.48A11.86 11.86 0 0 0 12 0C5.39 0 0 5.39 0 12c0 2.11.55 4.17 1.6 5.99L0 24l6.16-1.61A11.97 11.97 0 0 0 12 24c6.61 0 12-5.39 12-12a11.86 11.86 0 0 0-3.48-8.52ZM12 21.82a9.77 9.77 0 0 1-4.98-1.36l-.36-.22-3.65.95.98-3.56-.23-.37A9.8 9.8 0 0 1 2.18 12C2.18 6.58 6.58 2.18 12 2.18c2.61 0 5.06 1.02 6.9 2.86A9.73 9.73 0 0 1 21.82 12c0 5.42-4.4 9.82-9.82 9.82Zm5.39-7.35c-.29-.14-1.71-.84-1.98-.94-.27-.1-.46-.14-.65.14-.19.29-.75.94-.92 1.13-.17.19-.34.21-.63.07-.29-.14-1.23-.45-2.35-1.44-.87-.77-1.46-1.72-1.63-2-.17-.29-.02-.45.13-.59.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.1-.19.05-.36-.02-.5-.07-.14-.65-1.56-.9-2.14-.24-.58-.48-.5-.65-.51h-.56c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36 0 1.39 1.02 2.74 1.16 2.93.14.19 2 3.05 4.84 4.28.68.29 1.21.46 1.63.59.68.22 1.3.19 1.79.12.55-.08 1.71-.7 1.95-1.38.24-.68.24-1.26.17-1.38-.07-.12-.26-.19-.55-.33Z',
  },
  {
    href: 'https://www.linkedin.com/company/wealth-holding-developments/posts/?feedView=all',
    label: 'LinkedIn',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
];

export function Footer() {
  return (
    <footer className='border-t bg-gradient-to-b from-background to-muted/40'>
      <div className='container mx-auto px-4'>
        <div className='grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4'>
          {/* Brand */}
          <div className='space-y-4'>
            <a
              href='https://wealthholding-eg.com'
              aria-label='Wealth Holding'
              className='inline-flex w-32 items-center'
            >
                <img
                  src='/logo1-black.png'
                  alt='Wealth Holding Developments'
                  className='h-full w-full object-contain'
                />
            </a>
            <p className='text-xs leading-relaxed text-muted-foreground'>
              Premium real estate developments redefining luxury living in Egypt's
              most prestigious locations with world-class design and exceptional
              investment opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div className='space-y-4'>
            <h4 className='text-xs font-semibold uppercase tracking-[0.2em] text-foreground'>
              Quick Links
            </h4>
            <ul className='space-y-2.5'>
              {['Home', 'Projects', 'About Us', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`}
                    className='group inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground'
                  >
                    <ArrowUpRight className='h-2.5 w-2.5 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all' />
                    <span>{link}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className='space-y-4'>
            <h4 className='text-xs font-semibold uppercase tracking-[0.2em] text-foreground'>
              Contact
            </h4>
            <ul className='space-y-3'>
              <li>
                <a
                  href='tel:19640'
                  className='group inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground'
                >
                  <Phone className='h-3.5 w-3.5 text-primary' />
                  <span>19640</span>
                </a>
              </li>
              <li>
                <a
                  href='mailto:info@wealthholding-eg.com'
                  className='group inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground'
                >
                  <Mail className='h-3.5 w-3.5 text-primary' />
                  <span>info@wealthholding-eg.com</span>
                </a>
              </li>
              <li className='inline-flex items-start gap-2 text-xs text-muted-foreground'>
                <MapPin className='h-3.5 w-3.5 mt-0.5 shrink-0 text-primary' />
                <span>New Cairo, Egypt</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className='space-y-4'>
            <h4 className='text-xs font-semibold uppercase tracking-[0.2em] text-foreground'>
              Follow Us
            </h4>
            <div className='flex flex-wrap gap-2'>
              {socials.map(({ href, label, path }) => (
                <a
                  key={label}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={label}
                  className='flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/70 text-muted-foreground transition-all hover:border-primary/40 hover:text-primary hover:bg-primary/5'
                >
                  <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 24 24'>
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
            <p className='text-[10px] leading-relaxed text-muted-foreground'>
              Follow us on social media for the latest projects, offers, and
              community updates.
            </p>
          </div>
        </div>

        <div className='border-t py-4'>
          <div className='flex flex-col gap-2 text-center text-[11px] text-muted-foreground md:flex-row md:items-center md:justify-between md:text-left'>
            <p>&copy; {new Date().getFullYear()} Wealth Holding Developments. All rights reserved.</p>
            <div className='flex items-center justify-center gap-3'>
              <span>Built with</span>
              <Building className='h-3 w-3 text-primary' />
              <span>by</span>
              <a
                href='https://portfolio-webpage-jrd.vercel.app/'
                target='_blank'
                rel='noopener noreferrer'
                className='font-semibold text-primary transition-colors hover:text-primary/80'
              >
                JoDev
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { useEffect, useState } from 'react';
import { PhoneCall } from 'lucide-react';
import { ShineButton } from '@/components/lightswind/shine-button';

const navItems = [
  { href: '#projects-details', label: 'About' },
  { href: '#location', label: 'Location' },
  { href: '#master-plan', label: 'Master Plan' },
  { href: '#amenities', label: 'Amenities' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#payment-plan', label: 'Payment Plan' },
  { href: '#developer', label: 'Developer' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToLeadForm = () => {
    const target = document.getElementById('contact-form');
    if (!target) return;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
  };

  return (
    <header
      className={`project-nav fixed left-0 top-0 z-50 w-full border-b transition-all duration-500 ease-out ${
        isScrolled
          ? 'border-border bg-background/85 shadow-sm backdrop-blur-lg'
          : 'border-transparent bg-transparent'
      }`}
    >
      <div
        className={`container mx-auto px-4 transition-all duration-500 ease-out ${
          isScrolled ? 'py-3' : 'py-5'
        }`}
      >
        <div className='flex items-center justify-between gap-4'>
          <a
            href='https://wealthholding-eg.com'
            className='flex items-center gap-3 group'
            aria-label='Wealth Holding'
          >
            <div className='relative h-10 md:h-12 w-32 md:w-40'>
              <img
                src='/logo1-white.png'
                alt='Wealth Holding'
                className='absolute inset-0 h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]'
              />
            </div>
          </a>

          <nav className='hidden items-center justify-center gap-5 xl:flex'>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-[11px] font-bold uppercase tracking-[0.12em] transition-colors duration-300 ${
                  isScrolled
                    ? 'text-foreground/70 hover:text-foreground'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className='flex items-center gap-2 sm:gap-3'>
            <ShineButton
              type='button'
              onClick={scrollToLeadForm}
              label={
                <>
                  <PhoneCall className='ml-1.5 h-4 w-4' /> Enquire Now
                </>
              }
              size='sm'
              bgColor='linear-gradient(325deg, #c69a5c 0%, #f3d8a0 55%, #c69a5c 90%)'
              className='project-nav__cta'
            />
          </div>
        </div>
      </div>
    </header>
  );
}

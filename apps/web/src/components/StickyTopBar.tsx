import { useEffect, useState } from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

export function StickyTopBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const atTop = currentY <= 2;
      const scrollingDown = currentY > lastY + 6;
      const scrollingUp = currentY < lastY - 6;

      if (atTop || scrollingDown) {
        setVisible(false);
      } else if (scrollingUp) {
        setVisible(true);
      }

      lastY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed left-0 right-0 top-0 z-40 transform transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className='mx-auto flex max-w-5xl items-center justify-between gap-2 rounded-b-lg border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-white shadow-lg backdrop-blur-sm'>
        <div className='flex items-center gap-2'>
          <a
            href='https://www.facebook.com/WealthHolding/'
            target='_blank'
            rel='noreferrer'
            aria-label='Facebook'
            className='flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 transition hover:bg-white/20'
          >
            <Facebook className='h-4 w-4' />
            <span className='hidden sm:inline'>Facebook</span>
          </a>
          <a
            href='https://www.instagram.com/wealthholding/'
            target='_blank'
            rel='noreferrer'
            aria-label='Instagram'
            className='flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 transition hover:bg-white/20'
          >
            <Instagram className='h-4 w-4' />
            <span className='hidden sm:inline'>Instagram</span>
          </a>
          <a
            href='https://www.linkedin.com/company/wealth-holding-developments/posts/?feedView=all'
            target='_blank'
            rel='noreferrer'
            aria-label='LinkedIn'
            className='flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 transition hover:bg-white/20'
          >
            <Linkedin className='h-4 w-4' />
            <span className='hidden sm:inline'>LinkedIn</span>
          </a>
        </div>

        <a
          href='https://wa.me/201121898883'
          target='_blank'
          rel='noreferrer'
          className='flex items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1 text-white transition hover:brightness-110'
        >
          <svg
            aria-hidden='true'
            focusable='false'
            viewBox='0 0 32 32'
            className='h-4 w-4'
            fill='currentColor'
          >
            <path d='M16 .533C7.64.533.8 7.21.8 15.376c0 2.63.72 5.188 2.08 7.443L.533 30.8l8.147-2.31c2.152 1.18 4.572 1.8 7.06 1.8 8.36 0 15.2-6.676 15.2-14.933C30.94 7.21 24.2.533 15.84.533h.16zm7.613 21.16c-.32.9-1.88 1.747-2.633 1.86-.707.107-1.612.153-2.6-.16-.6-.193-1.363-.44-2.353-.86-4.14-1.787-6.833-5.947-7.04-6.227-.206-.28-1.68-2.233-1.68-4.267 0-2.033 1.053-3.04 1.427-3.453.374-.413.82-.52 1.093-.52.273 0 .546.007.787.014.26.007.6-.1.94.713.34.814 1.16 2.813 1.26 3.013.1.2.166.447.033.727-.133.28-.2.447-.394.687-.2.24-.413.54-.587.727-.2.2-.407.42-.173.833.233.413 1.027 1.7 2.207 2.753 1.52 1.353 2.8 1.774 3.193 1.967.394.193.626.16.86-.08.233-.24.993-1.153 1.26-1.547.267-.393.527-.327.887-.193.36.133 2.28 1.073 2.673 1.273.393.2.653.3.753.466.1.167.1.967-.22 1.867z' />
          </svg>
          <span className='font-semibold'>WhatsApp</span>
        </a>
      </div>
    </div>
  );
}

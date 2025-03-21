'use client';

import { Button } from '../../components/ui/button';
import type { AnimatedProps } from '../../types/motion';
import { motion } from 'framer-motion';

import Link from 'next/link';

export function Hero({ id }: AnimatedProps) {
  return (
    <section
      id={id}
      className='relative min-h-screen flex items-center justify-center px-4 overflow-hidden'>
      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute -top-1/4 -left-1/4 w-[1000px] h-[1000px] bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-emerald-500/30 dark:from-blue-500/20 dark:via-cyan-500/20 dark:to-emerald-500/20 rounded-full blur-3xl animate-slow-spin'></div>
        <div className='absolute -bottom-1/4 -right-1/4 w-[1000px] h-[1000px] bg-gradient-to-l from-emerald-500/30 via-blue-500/30 to-cyan-500/30 dark:from-emerald-500/20 dark:via-blue-500/20 dark:to-cyan-500/20 rounded-full blur-3xl animate-slow-spin-reverse'></div>
        <div className='absolute top-1/4 right-1/4 w-[800px] h-[800px] bg-gradient-to-tr from-blue-500/20 via-cyan-500/20 to-transparent dark:from-blue-500/10 dark:via-cyan-500/10 rounded-full blur-3xl animate-slow-spin-reverse delay-75'></div>
        <div className='absolute bottom-1/4 left-1/4 w-[800px] h-[800px] bg-gradient-to-bl from-emerald-500/20 via-cyan-500/20 to-transparent dark:from-emerald-500/10 dark:via-cyan-500/10 rounded-full blur-3xl animate-slow-spin delay-75'></div>
        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background'></div>
        <div className='absolute inset-0 opacity-30 mix-blend-overlay'></div>
      </div>
      <div className='relative max-w-4xl mx-auto text-center'>
        <div className='relative'>
          <motion.h1
            className='text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 pb-2'
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}>
            E-Invite
            {/* <br />
            dolor sit amet */}
          </motion.h1>
          <motion.div
            className='absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-transparent via-foreground/30 to-transparent rounded-full'
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}></motion.div>
        </div>
        <motion.p
          className='text-lg md:text-xl text-foreground/70 mb-8 max-w-2xl mx-auto mt-12'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
          asperiores fuga ut quidem rerum fugit optio illum dicta esse veritatis
          vel inventore officia, assumenda nostrum nisi voluptatem, laudantium
          tenetur est!
        </motion.p>

        <div className='flex items-center justify-center gap-4 relative'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            <Button className='bg-gradient-to-r from-foreground via-foreground to-foreground/90 text-background hover:opacity-90 px-8 py-6 text-lg rounded-full transition-all duration-300'>
              <Link href='/new'>Get started</Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
            <Button
              variant='outline'
              className='border-foreground/20 text-foreground hover:bg-foreground/10 px-8 py-6 text-lg rounded-full transition-all duration-300'>
              <Link href='/auth/login'>Login</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

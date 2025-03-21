import type { TestimonialProps } from '../../../types';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import Image from 'next/image';

export function TestimonialCard({
  content,
  author,
  role,
  company,
  image,
}: TestimonialProps) {
  return (
    <motion.div
      className='group relative'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      whileHover={{ scale: 1.02 }}>
      <div className='absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-xl bg-gradient-to-r from-cyan-500/20 via-slate-500/20 to-cyan-500/20 opacity-50 blur-xl transition-all duration-500 group-hover:opacity-100 dark:from-cyan-200/20 dark:via-slate-200/20 dark:to-cyan-200/20 sm:block'></div>
      <div className='relative z-10 flex flex-col h-full p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-700 hover:scale-[1.02]'>
        <div className='flex items-center gap-4 mb-6'>
          <div className='relative w-16 h-16 overflow-hidden rounded-full ring-2 ring-slate-100 dark:ring-slate-700'>
            <Image
              src={image}
              alt={author}
              className='object-cover'
              width={64}
              height={64}
            />
          </div>
          <div>
            <p className='font-semibold text-slate-900 dark:text-slate-100'>
              {author}
            </p>
            <p className='text-sm text-slate-600 dark:text-slate-400'>
              {role} at {company}
            </p>
          </div>
        </div>
        <Quote className='w-8 h-8 mb-4 text-slate-400 dark:text-slate-500' />
        <p className='text-lg text-slate-700 dark:text-slate-300 leading-relaxed flex-grow'>
          {content}
        </p>
      </div>
    </motion.div>
  );
}

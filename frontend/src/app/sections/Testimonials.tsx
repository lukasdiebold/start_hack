'use client';

import { TestimonialCard } from '../../components/sections/testimonials/TestimonialCard';
import type { TestimonialProps } from '../../types';
import type { AnimatedProps } from '../../types/motion';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials: TestimonialProps[] = [
  {
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.',
    author: 'Sarah Chen',
    role: 'CEO',
    company: 'TechVision Inc',
    image: 'https://avatars.githubusercontent.com/u/124599?v=4',
  },
  {
    content:
      'Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.',
    author: 'Michael Rodriguez',
    role: 'Founder',
    company: 'InnovateLab',
    image: 'https://avatars.githubusercontent.com/u/124599?v=4',
  },
  {
    content:
      'Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
    author: 'Emily Davis',
    role: 'CTO',
    company: 'CodeCrafters',
    image: 'https://avatars.githubusercontent.com/u/124599?v=4',
  },
];

export function Testimonials({ id }: AnimatedProps) {
  return (
    <motion.section
      className='py-20'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}>
      <div id={id} className='container mx-auto px-4'>
        <div className='max-w-3xl mx-auto text-center mb-16'>
          <div className='flex items-center justify-center w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-800/30 mx-auto mb-4'>
            <Star className='w-6 h-6 text-cyan-600 dark:text-cyan-400' />
          </div>
          <h2 className='text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4'>
            Success{' '}
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-pink-600 dark:from-cyan-600 dark:to-cyan-700'>
              Stories
            </span>
          </h2>
          <p className='text-xl text-slate-600 dark:text-slate-400'>
            Don&apos;t just take my word for it - hear from the clients
          </p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto'>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

'use client';

import { FAQItem } from '../../components/sections/faq/FaqItem';
import type { FAQItemProps } from '../../types';
import type { AnimatedProps } from '../../types/motion';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';

const faqs: FAQItemProps[] = [
  {
    category: 'General',
    question: 'What services do you provide?',
    answer:
      'I specialize in full-stack development, creating responsive web applications, mobile apps, and providing technical consulting. Each solution is tailored to meet your specific needs and business goals.',
  },
  {
    category: 'Process',
    question: 'How do you handle project management?',
    answer:
      'I follow an agile methodology with regular check-ins and updates. This ensures transparent communication, quick iterations, and the flexibility to adapt to changing requirements throughout the development process.',
  },
  {
    category: 'Technical',
    question: 'What technologies do you work with?',
    answer:
      'I work with modern tech stacks including React, Next.js, Node.js, and TypeScript. I stay updated with the latest trends while ensuring reliable, scalable, and maintainable solutions.',
  },
  {
    category: 'Collaboration',
    question: 'How can we start working together?',
    answer:
      "Let's begin with a consultation to discuss your project needs. We'll outline objectives, timeline, and deliverables to create a tailored plan that aligns with your vision and goals.",
  },
  {
    category: 'Support',
    question: 'Do you provide post-launch support?',
    answer:
      'Yes, I offer comprehensive post-launch support and maintenance services to ensure your application runs smoothly. This includes bug fixes, updates, and performance optimizations.',
  },
];

const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

export function FAQ({ id }: AnimatedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFaqs =
    selectedCategory === 'all'
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory);

  return (
    <section id={id} className='relative py-20 overflow-hidden'>
      <div className='absolute inset-0 '>
        <div className='absolute inset-0 opacity-10 dark:opacity-20' />
      </div>
      <div className='container relative z-10 mx-auto px-4'>
        <div className='max-w-3xl mx-auto text-center mb-16'>
          <motion.div
            className='inline-block mb-4'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}>
            <motion.div
              className='flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-cyan-800/30 mx-auto mb-4'
              initial={{ rotate: -15 }}
              animate={{ rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}>
              <Sparkles className='w-6 h-6 text-cyan-600 dark:text-cyan-400' />
            </motion.div>
          </motion.div>

          <motion.h2
            className='text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            Frequently Asked{' '}
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-pink-600 dark:from-cyan-600 dark:to-cyan-700'>
              Questions
            </span>
          </motion.h2>

          <motion.p
            className='text-xl text-slate-600 dark:text-slate-400'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            Everything you need to know about the services I provide
          </motion.p>
        </div>

        <motion.div
          className='flex flex-wrap justify-center gap-2 mb-12'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delayChildren: 0.2 }}>
          <motion.button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}>
            All
          </motion.button>
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}>
              {category}
            </motion.button>
          ))}
        </motion.div>

        <motion.div layout className='max-w-3xl mx-auto space-y-4'>
          <AnimatePresence mode='popLayout'>
            {filteredFaqs.map((faq, index) => (
              <FAQItem key={index} {...faq} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

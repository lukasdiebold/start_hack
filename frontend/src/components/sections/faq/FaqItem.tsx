import { Badge } from '../../ui/badge';
import type { FAQItemProps } from '../../../types';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export function FAQItem({ question, answer, category }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <motion.div
      layout
      className='relative'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}>
      <motion.div
        layout
        className='relative overflow-hidden rounded-xl border p-6 transition-all duration-300
          dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-700/50'>
        <Badge
          variant='secondary'
          className='absolute top-2 right-2 text-xs font-medium bg-cyan-700 text-slate-300'>
          {category}
        </Badge>
        <button
          onClick={toggleOpen}
          className='flex items-center w-full text-left'
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${question
            .replace(/\s+/g, '-')
            .toLowerCase()}`}>
          <div className='flex items-center justify-center w-8 h-8 mr-4'>
            {isOpen ? (
              <ChevronUp className='w-5 h-5' />
            ) : (
              <ChevronDown className='w-5 h-5' />
            )}
          </div>
          <h3 className='text-xl font-semibold flex-1'>{question}</h3>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={`faq-answer-${question.replace(/\s+/g, '-').toLowerCase()}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}>
              <p className='mt-4 ml-12 leading-relaxed dark:text-slate-300'>
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

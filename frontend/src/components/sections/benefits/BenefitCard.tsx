import type { BenefitProps } from '../../../types';
import { motion } from 'framer-motion';

export function BenefitCard({
  icon,
  title,
  description,
  className,
}: BenefitProps) {
  return (
    <motion.div
      className={`relative group ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}>
      <div className='absolute inset-0 z-0 hidden rounded-lg bg-gradient-to-r from-cyan-500/20 via-slate-500/20 to-cyan-500/20 opacity-50 blur-xl transition-all duration-500 group-hover:opacity-100 dark:from-cyan-200/20 dark:via-slate-200/20 dark:to-cyan-200/20 sm:block'></div>
      <div className='relative p-6 rounded-lg bg-slate-50 dark:bg-slate-800 shadow-md hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 h-full flex flex-col justify-between'>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className='w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4'>
          {icon}
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2'>
          {title}
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-slate-600 dark:text-slate-400 flex-grow'>
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
}

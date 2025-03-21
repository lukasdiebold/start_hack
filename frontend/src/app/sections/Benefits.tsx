'use client';

import { BenefitCard } from '../../components/sections/benefits/BenefitCard';
import type { BenefitProps } from '../../types';
import type { AnimatedProps } from '../../types/motion';
import { motion } from 'framer-motion';
import { Code, Globe, Palette, Smartphone, Zap } from 'lucide-react';

const benefits: BenefitProps[] = [
  {
    icon: <Code className='w-6 h-6 text-slate-900 dark:text-white' />,
    title: 'Lorem, ipsum.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste perferendis reprehenderit laudantium asperiores obcaecati recusandae mollitia eius tenetur. Iusto, excepturi maiores! Iusto cumque aliquam nemo porro, illum quis praesentium esse ratione, laudantium, distinctio ipsam reiciendis blanditiis sunt omnis voluptates autem necessitatibus non doloribus nesciunt. Suscipit?',
    className: 'md:col-span-2 md:row-span-2',
  },
  {
    icon: <Palette className='w-6 h-6 text-slate-900 dark:text-white' />,
    title: 'Lorem, ipsum dolor.',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto cupiditate odio magni accusantium sed expedita',
    className: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: <Smartphone className='w-6 h-6 text-slate-900 dark:text-white' />,
    title: 'Lorem ipsum',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, quaerat.',
    className: 'md:col-span-1 md:row-span-1',
  },
  {
    icon: <Globe className='w-6 h-6 text-slate-900 dark:text-white' />,
    title: 'Lorem ipsum dolor sit amet.',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit, quaerat.',
    className: 'md:col-span-2 md:row-span-1',
  },
];

export function Benefits({ id }: AnimatedProps) {
  return (
    <section id={id} className='py-20'>
      <div className='container mx-auto px-4'>
        <motion.div
          className='flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-cyan-800/30 mx-auto mb-4'
          initial={{ rotate: -15, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, duration: 0.5 }}>
          <Zap className='w-6 h-6 text-cyan-600 dark:text-cyan-400' />
        </motion.div>
        <div className='max-w-3xl mx-auto text-center mb-12'>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4'>
            Benefits
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-pink-600 dark:from-cyan-600 dark:to-cyan-700'>
              {' '}
              for you
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-xl text-slate-600 dark:text-slate-400'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            quod, voluptate, quibusdam, aperiam dolorum
          </motion.p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto'>
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
      </div>
    </section>
  );
}

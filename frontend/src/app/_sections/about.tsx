'use client';

import type { SocialLinkProps } from '../../types';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Linkedin, Mail } from 'lucide-react';

const socialLinks: SocialLinkProps[] = [
  {
    name: 'Email',
    href: 'kirill.heitzler@gmail.com',
    icon: Mail,
    lightColor: 'hover:text-red-600',
    darkColor: 'dark:hover:text-red-400',
  },
  {
    name: 'LinkedIn',
    href: 'https://de.linkedin.com/in/kirill-heitzler-75556b285',
    icon: Linkedin,
    lightColor: 'hover:text-blue-600',
    darkColor: 'dark:hover:text-blue-400',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/heitzlki',
    icon: Github,
    lightColor: 'hover:text-gray-800',
    darkColor: 'dark:hover:text-gray-200',
  },
];

const footerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export function Footer() {
  return (
    <footer className='relative overflow-hidden'>
      <div className='absolute inset-0'>
        <div className='absolute inset-0 opacity-20' />
      </div>
      <motion.div
        className='container relative z-10 mx-auto px-4 py-20'
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
        variants={footerVariants}>
        <div className='max-w-4xl mx-auto'>
          <motion.div className='text-center mb-12' variants={itemVariants}>
            <div className='inline-block mb-6'></div>
            <h2 className='text-4xl font-bold mb-4 dark:text-white text-gray-900'>
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-pink-600 dark:from-cyan-600 dark:to-cyan-700'>
                Get in touch
              </span>
            </h2>
            <p className='text-gray-600 dark:text-gray-400 text-lg'>
              Feel free to reach out if you have any questions or inquiries.
            </p>
          </motion.div>

          <motion.div
            className='flex flex-wrap justify-center gap-8 mb-12'
            variants={itemVariants}>
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.href}
                target='_blank'
                rel='noopener noreferrer'
                className={`group flex items-center justify-center text-center gap-2 p-3 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 ${link.lightColor} ${link.darkColor}`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}>
                <link.icon className='w-5 h-5' />
                <span className='font-medium text-gray-800 text-center dark:text-gray-200'>
                  {link.name}
                </span>
                <ExternalLink className='w-4 h-4 opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300' />
              </motion.a>
            ))}
          </motion.div>

          <motion.div className='text-center' variants={itemVariants}>
            <div className='relative h-px mb-8'>
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent' />
              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-600 to-transparent animate-pulse' />
            </div>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>
              &copy; {new Date().getFullYear()}{' '}
              <span className='font-medium text-gray-800 dark:text-gray-200'>
                Veit und Kirill
              </span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
}

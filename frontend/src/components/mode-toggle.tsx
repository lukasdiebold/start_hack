'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    <Button
      variant='ghost'
      size='icon'
      onClick={() => (theme == 'light' ? setTheme('dark') : setTheme('light'))}>
      {theme === 'light' ? (
        <Sun className='h-[1.2rem] w-[1.2rem] ' />
      ) : (
        <Moon className='h-[1.2rem] w-[1.2rem] ' />
      )}
      <span className='sr-only'>Toggle theme</span>
    </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align='end'>
    //     <DropdownMenuItem onClick={() => setTheme('light')}>
    //       Light
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme('dark')}>
    //       Dark
    //     </DropdownMenuItem>
    //     <DropdownMenuItem onClick={() => setTheme('system')}>
    //       System
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
}

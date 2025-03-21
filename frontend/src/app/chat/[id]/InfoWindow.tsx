'use client';

import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BorderBeam } from '@/components/magicui/border-beam';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export type IconProps = React.HTMLAttributes<SVGElement>;

import { 
  ArrowUpRight, 
  Building, 
  Info, 
  Mail, 
  Phone, 
  Plus, 
  Star, 
  User, 
  X 
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { useStore } from '@/lib/store';

export default function InfoWindow() {
  const { selectedNode, setSelectedNode } = useStore();

  // Close the info window
  const handleClose = () => {
    setSelectedNode(null);
  };

  // If no node is selected, show a placeholder
  if (!selectedNode) {
    // hide the info window
    return null;
  }

  // Extract details from the selected node
  const { title, color, type, details } = selectedNode;
  const nodeColor = color || 'hsl(186,100%,50%)';

  console.log(details?.description);

  return (
    <div className='fixed top-1/2 left-0 transform -translate-y-1/2 z-50 px-4 py-14'>
      <Card className='relative w-[350px] overflow-hidden'>
        <CardHeader className=''>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <div 
                className='w-4 h-4 rounded-full' 
                style={{ backgroundColor: nodeColor }}
              />
              <h3 className='text-lg font-medium'>{title}</h3>
            </div>
            <Button
              size='icon'
              variant='ghost'
              className='rounded-full h-8 w-8'
              onClick={handleClose}
            >
              <X className='h-4 w-4' />
              <span className='sr-only'>Close</span>
            </Button>
          </div>
          {/* <Badge variant='outline' className='w-fit mt-2'>
            {type === 'center' ? 'Main Problem' : 
             (parseInt(selectedNode.id) < 3 ? 'Area' : 'Contact')}
          </Badge> */}
        </CardHeader>
        
        <Separator />
        
        <CardContent className='pt-2'>
          {details?.description && (
            <div className='mb-4'>
              <p className='text-sm text-muted-foreground mb-1'>Description</p>
              <p>{details.description}</p>
            </div>
          )}

          {/* {details?.rating !== undefined && (
            <div className='mb-4'>
              <p className='text-sm text-muted-foreground mb-1'>Innovation Potential</p>
              <div className='flex items-center'>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(details.rating / 2)
                        ? 'text-yellow-500 fill-yellow-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
                <span className='ml-2 text-sm'>{details.rating}/10</span>
              </div>
            </div>
          )} */}

          {details?.institution && (
            <div className='flex items-start gap-2 mb-2'>
              <Building className='w-4 h-4 mt-0.5 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Institution</p>
                <p>{details.institution}</p>
              </div>
            </div>
          )}

          {details?.email && (
            <div className='flex items-start gap-2 mb-2'>
              <Mail className='w-4 h-4 mt-0.5 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Email</p>
                <a href={`mailto:${details.email}`} className='text-blue-500 hover:underline'>
                  {details.email}
                </a>
              </div>
            </div>
          )}

          {details?.website && (
            <div className='flex items-start gap-2 mb-2'>
              <ArrowUpRight className='w-4 h-4 mt-0.5 text-muted-foreground' />
              <div>
                <p className='text-sm text-muted-foreground'>Website</p>
                <a 
                  href={details.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className='text-blue-500 hover:underline'
                >
                  {details.website}
                </a>
              </div>
            </div>
          )}

          {details?.contacts && details.contacts.length > 0 && (
            <div className=''>
              <p className='text-sm text-muted-foreground mb-2'>Contacts</p>
              <div className='space-y-3'>
                {details.contacts.map((contact, idx) => (
                  <div key={idx} className='bg-muted/50 p-3 rounded-lg'>
                    <div className='flex items-center gap-2 mb-1'>
                      <User className='w-4 h-4 text-muted-foreground' />
                      <p className='font-medium'>{contact.name}</p>
                    </div>
                    {contact.institution && (
                      <p className='text-sm text-muted-foreground mb-1'>
                        {contact.institution}
                      </p>
                    )}
                    {contact.email && (
                      <a 
                        href={`mailto:${contact.email}`}
                        className='text-sm text-blue-500 hover:underline flex items-center gap-1'
                      >
                        <Mail className='w-3 h-3' />
                        {contact.email}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        
        <BorderBeam 
          duration={6} 
          size={200} 
          colorFrom={nodeColor} 
          colorTo="transparent" 
        />
      </Card>
    </div>
  );
}

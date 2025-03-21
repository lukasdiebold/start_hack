'use client';

import { useState, useEffect } from 'react';
import DockBar from './DockBar';
import ChatWindow from './ChatWindow';
import Graph from './Graph';
import Roadmap from './Roadmap';
import InfoWindow from './InfoWindow';

import { useStore } from '@/lib/store';

export default function Chat() {
  const [isLoading, setIsLoading] = useState(true);
  const { setGraphData } = useStore();

  useEffect(() => {
    // Retrieve data from localStorage
    const storedData = localStorage.getItem('startData');

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setGraphData(parsedData);
      } catch (error) {
        console.error('Error parsing stored data:', error);
      }
    }

    setIsLoading(false);
  }, []);

  // Get the graphData from the store to pass to Graph and ChatWindow
  const { graphData } = useStore();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-lg font-medium'>Loading...</div>
      </div>
    );
  }



  return (
    <div suppressHydrationWarning>
      <DockBar />
      <ChatWindow />
      <Graph />
      <Roadmap />
      <InfoWindow />
    </div>
  );
}

export const runtime = 'edge';

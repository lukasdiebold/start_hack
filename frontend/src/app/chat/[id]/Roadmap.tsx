'use client';
import { X } from 'lucide-react';
import { useStore } from '@/lib/store';
import * as React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer } from 'recharts';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
} from '@xyflow/react';

import AnnotationNode from './_nodes/AnnotationNode';
import InfoNode from './_nodes/InfoNode';

import FloatingEdge from './_edges/FloatingEdge';
import CenterNode from './_nodes/CenterNode';

const nodeTypes = {
  annotation: AnnotationNode,
  custom: InfoNode,
  center: CenterNode,
  roadmap: RoadmapNode,
};

const edgeTypes = {
  floating: FloatingEdge,
  // button: ButtonEdge,
};

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import RoadmapNode from './_nodes/RoadmapNode';
import { info } from 'console';
const nodes = [
  {
    id: '1',
    type: 'roadmap',
    data: {
      color: '#8BFFAC',
      title: 'Idea Generation',
      info: 'Brainstorm and validate business ideas.',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: '2',
    type: 'roadmap',
    data: {
      color: '#FFD700',
      title: 'Market Research',
      info: 'Analyze the target audience and competitors.',
    },
    position: { x: 400, y: -100 },
  },
  {
    id: '3',
    type: 'roadmap',
    data: {
      color: '#FFD700',
      title: 'Customer Interviews',
      info: 'Conduct interviews to understand customer needs.',
    },
    position: { x: 400, y: 100 },
  },
  {
    id: '4',
    type: 'roadmap',
    data: {
      color: '#FF6347',
      title: 'Business Plan',
      info: 'Create a detailed business plan and strategy.',
    },
    position: { x: 800, y: 0 },
  },
  {
    id: '5',
    type: 'roadmap',
    data: {
      color: '#87CEEB',
      title: 'Product Development',
      info: 'Develop the product or service prototype.',
    },
    position: { x: 1200, y: 0 },
  },
  {
    id: '8',
    type: 'roadmap',
    data: {
      color: '#87CEEB',
      title: 'Product Development',
      info: 'Develop the product or service prototype.',
    },
    position: { x: 1200, y: 200 },
  },
  {
    id: '6',
    type: 'roadmap',
    data: {
      color: '#32CD32',
      title: 'Marketing Strategy',
      info: 'Plan and execute marketing campaigns.',
    },
    position: { x: 1600, y: 0 },
  },
  {
    id: '7',
    type: 'roadmap',
    data: {
      color: '#FF69B4',
      title: 'Launch',
      info: 'Officially launch the product or service.',
    },
    position: { x: 2000, y: 0 },
  },
];

const edges = [
  { id: '1-2', source: '1', target: '2', animated: true },
  { id: '1-3', source: '1', target: '3', animated: true },
  { id: '2-4', source: '2', target: '4', animated: true },
  { id: '3-4', source: '3', target: '4', animated: true },
  { id: '4-5', source: '4', target: '5', animated: true },
  { id: '4-8', source: '4', target: '8', animated: true },
  { id: '5-6', source: '5', target: '6', animated: true },
  { id: '6-7', source: '6', target: '7', animated: true },
];

export default function Roadmap() {
  const { roadmap, setRoadmap } = useStore();

  return (
    <Drawer open={roadmap} onOpenChange={setRoadmap}>
      <DrawerContent data-vaul-no-drag>
        <div>
          <DrawerHeader>
            <DrawerTitle className='text-center w-full text-2xl'>
              Innovation Roadmap
            </DrawerTitle>
            <DrawerDescription className='text-center w-full'>
              Next proposed steps
            </DrawerDescription>
            <DrawerClose asChild>
              <button className='absolute top-4 right-4 rounded-full p-2 hover:bg-gray-200 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400'>
                <X className='h-5 w-5' />
              </button>
            </DrawerClose>
          </DrawerHeader>
          <div style={{ width: '100vw', height: '60vh' }} className='bottom-0'>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              proOptions={{ hideAttribution: true }}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView>
              {/* <Controls showInteractive={false} /> */}
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

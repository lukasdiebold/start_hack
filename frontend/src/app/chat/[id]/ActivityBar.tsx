"use client"
import { X } from "lucide-react"
import { useStore } from '@/lib/store';
import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer } from "recharts"
import { ReactFlow, Controls, Background } from '@xyflow/react';

import AnnotationNode from './_nodes/AnnotationNode';
import InfoNode from './_nodes/InfoNode';

import FloatingEdge from './_edges/FloatingEdge';
import CenterNode from './_nodes/CenterNode';

const nodeTypes = {
  annotation: AnnotationNode,
  custom: InfoNode,
  center: CenterNode,
};

const edgeTypes = {
  floating: FloatingEdge,
  // button: ButtonEdge,
};

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

const edges = [{ id: '1-2', source: '1', target: '2' }];

const nodes = [
    {
      id: '1',
      type: 'custom',
      data: { color: '#8BFFAC', title: 'Contact Joachim Schneider from OST about machine servicing optimisation' },
      position: { x: 50, y: 100 }
    },
    {
      id: '2',
      data: { color: '#FD84FF', title: 'Your Problem' },
      position: { x: 100, y: 200 },
    },
    {
        id: `${3}`,
        type: 'custom',
        draggable: true,
        selectable: false,
        data: { color: '#FD84FF', title: 'Marketing' },
        position: { x:100, y:200 },
    },
  ];




export function DrawerDemo() {
    const { roadmap, setRoadmap } = useStore();
    const [goal, setGoal] = React.useState(350)

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
  }

  return (
    <Drawer open={roadmap} onOpenChange={setRoadmap} >
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div style={{ pointerEvents: 'none' }}>
          <DrawerHeader>
            <DrawerTitle className="text-center w-full text-2xl">Innovation Roadmap</DrawerTitle>
            <DrawerDescription className="text-center w-full">Next proposed steps</DrawerDescription>
            <DrawerClose asChild>
              <button className="absolute top-4 right-4 rounded-full p-2 hover:bg-gray-200 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400">
                <X className="h-5 w-5" />
              </button>
            </DrawerClose>
          </DrawerHeader>
          <div
            style={{ width: '100vw', height: '80vh' }}>
            <ReactFlow nodes={nodes} edges={edges}>
              <Controls showInteractive={false} />
            </ReactFlow>
          </div>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
            </div>
            <div className="mt-3 h-[120px]">
            </div>
          </div>
          <DrawerFooter>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

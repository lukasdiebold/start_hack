import React, { memo, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { useStore } from '@/lib/store';

function InfoNode({ data, id }: { data: { color: string; title: string }, id: string }) {
  const { selectedNode } = useStore();
  const isSelected = selectedNode?.id === id;
  
  // Add hover state for better UX
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      className={`px-4 py-2 bg-card text-card-foreground flex flex-col gap-6 rounded-xl shadow-sm max-w-[280px] w-max border border-gray-800 border-opacity-10 transition-all duration-200 ${
        isSelected ? 'ring-2 ring-offset-2 ring-offset-background' : ''
      } ${isHovered ? 'scale-105' : ''}`}
      style={{ 
        borderColor: data.color,
        boxShadow: isSelected ? `0 0 8px ${data.color}` : '',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='flex'>
        <div 
          className="w-3 h-3 rounded-full mr-2 mt-1.5" 
          style={{ backgroundColor: data.color }}
        />
        <div className='break-all'>
          <div className='text-lg font-bold break-words'>{data.title}</div>
        </div>
      </div>

      <Handle
        type='target'
        position={Position.Top}
        className='opacity-0
  height-0
  width-0
  top-auto
  bottom-auto'
      />
      <Handle
        type='source'
        position={Position.Bottom}
        className='opacity-0
  height-0
  width-0
  top-auto
  bottom-auto'
      />
      {/* <BorderBeam duration={4} size={20} colorFrom=''/> */}
    </div>
  );
}

export default memo(InfoNode);

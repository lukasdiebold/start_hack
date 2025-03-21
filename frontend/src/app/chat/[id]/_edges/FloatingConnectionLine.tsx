import React from 'react';
import { getBezierPath, Position } from '@xyflow/react';
// import { getEdgeParams } from './initialElements';
import { NodeWithMeasured, useEdgeParams } from '@/hooks/use-elements';

interface FloatingConnectionLineProps {
  toX: number;
  toY: number;
  fromPosition: Position;
  toPosition: Position;
  fromNode: NodeWithMeasured;
}

function FloatingConnectionLine({
  toX,
  toY,
  fromPosition,
  toPosition,
  fromNode,
}: FloatingConnectionLineProps) {
  const { getEdgeParams } = useEdgeParams();
  if (!fromNode) {
    return null;
  }

  // Create a mock target node at the cursor position
  const targetNode: NodeWithMeasured = {
    id: 'connection-target',
    measured: {
      width: 1,
      height: 1,
    },
    internals: {
      positionAbsolute: {
        x: toX,
        y: toY,
      },
      z: 0,
      userNode: {
        id: 'connection-target',
        type: 'custom',
        position: {
          x: toX,
          y: toY,
        },
        data: {},
      },
    },
    position: {
      x: 0,
      y: 0,
    },
    data: {},
  };

  const { sx, sy, tx, ty, sourcePos, targetPos } =
    getEdgeParams(fromNode, targetNode);

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos || fromPosition,
    targetPosition: targetPos || toPosition,
    targetX: tx || toX,
    targetY: ty || toY,
  });

  return (
    <g>
      <path
        fill='none'
        stroke='#222'
        strokeWidth={1.5}
        className='animated'
        d={edgePath}
      />
      <circle
        cx={tx || toX}
        cy={ty || toY}
        fill='#fff'
        r={3}
        stroke='#222'
        strokeWidth={1.5}
      />
    </g>
  );
}

export default FloatingConnectionLine;

import React from 'react';
import {
  getBezierPath,
  useInternalNode,
} from '@xyflow/react';
import { NodeWithMeasured, useEdgeParams } from '@/hooks/use-elements';

interface FloatingEdgeProps {
  id: string;
  source: string;
  target: string;
  markerEnd?: string;
  style?: React.CSSProperties;
}

function FloatingEdge({
  id,
  source,
  target,
  style,
}: FloatingEdgeProps) {
  const sourceNode = useInternalNode(source) as NodeWithMeasured;
  const targetNode = useInternalNode(target) as NodeWithMeasured;

  const { sx, sy, tx, ty, sourcePos, targetPos } =
    useEdgeParams().getEdgeParams(sourceNode, targetNode);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetPosition: targetPos,
    targetX: tx,
    targetY: ty,
  });

  return (
    <path
      id={id}
      className='react-flow__edge-path'
      d={edgePath}
      // markerEnd={markerEnd}
      style={style}
    />
  );
}

export default FloatingEdge;

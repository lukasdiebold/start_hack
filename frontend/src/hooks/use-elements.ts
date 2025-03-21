import { useCallback } from 'react';
import { Position, MarkerType, Node, Edge, InternalNode } from '@xyflow/react';

export interface NodeWithMeasured extends InternalNode<Node> {
  id: string;
  measured: {
    width: number;
    height: number;
  };
  internals: {
    positionAbsolute: {
      x: number;
      y: number;
    };
    z: number;
    userNode: Node;
  };
}

interface IntersectionPoint {
  x: number;
  y: number;
}

interface EdgeParams {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  sourcePos: Position;
  targetPos: Position;
}

interface InitialElements {
  nodes: Node[];
  edges: Edge[];
}

import { Area } from '@/types';

const colors = [
  'hsla(299,100%,76%,0.4)',
  'hsla(137,100%,77%,0.4)',
  'hsla(194,100%,50%,0.4)',
];

/**
 * Returns the intersection point between the center of the intersection node and the target node
 */
const getNodeIntersection = (
  intersectionNode: NodeWithMeasured,
  targetNode: NodeWithMeasured
): IntersectionPoint => {
  // https://math.stackexchange.com/questions/1724792/an-algorithm-for-finding-the-intersection-point-between-a-center-of-vision-and-a
  const { width: intersectionNodeWidth, height: intersectionNodeHeight } =
    intersectionNode.measured;
  const intersectionNodePosition = intersectionNode.internals.positionAbsolute;
  const targetPosition = targetNode.internals.positionAbsolute;

  const w = intersectionNodeWidth / 2;
  const h = intersectionNodeHeight / 2;
  const x2 = intersectionNodePosition.x + w;
  const y2 = intersectionNodePosition.y + h;
  const x1 = targetPosition.x + targetNode.measured.width / 2;
  const y1 = targetPosition.y + targetNode.measured.height / 2;

  const xx1 = (x1 - x2) / (2 * w) - (y1 - y2) / (2 * h);
  const yy1 = (x1 - x2) / (2 * w) + (y1 - y2) / (2 * h);
  const a = 1 / (Math.abs(xx1) + Math.abs(yy1));
  const xx3 = a * xx1;
  const yy3 = a * yy1;
  const x = w * (xx3 + yy3) + x2;
  const y = h * (-xx3 + yy3) + y2;

  return { x, y };
};

/**
 * Returns the position (top, right, bottom, or left) of the passed node compared to the intersection point
 */
const getEdgePosition = (
  node: NodeWithMeasured,
  intersectionPoint: IntersectionPoint
): Position => {
  const n = { ...node.internals.positionAbsolute, ...node };
  const nx = Math.round(n.x);
  const ny = Math.round(n.y);
  const px = Math.round(intersectionPoint.x);
  const py = Math.round(intersectionPoint.y);

  if (px <= nx + 1) {
    return Position.Left;
  }
  if (px >= nx + n.measured.width - 1) {
    return Position.Right;
  }
  if (py <= ny + 1) {
    return Position.Top;
  }
  if (py >= n.y + n.measured.height - 1) {
    return Position.Bottom;
  }

  return Position.Top;
};

/**
 * Custom hook that provides functions for edge parameter calculation and initial elements
 */
export const useEdgeParams = () => {
  /**
   * Returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) needed to create an edge
   */
  const getEdgeParams = useCallback(
    (source: NodeWithMeasured, target: NodeWithMeasured): EdgeParams => {
      const sourceIntersectionPoint = getNodeIntersection(source, target);
      const targetIntersectionPoint = getNodeIntersection(target, source);
      const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
      const targetPos = getEdgePosition(target, targetIntersectionPoint);

      return {
        sx: sourceIntersectionPoint.x,
        sy: sourceIntersectionPoint.y,
        tx: targetIntersectionPoint.x,
        ty: targetIntersectionPoint.y,
        sourcePos,
        targetPos,
      };
    },
    []
  );

  /**
   * Generates initial nodes and edges in a circular layout
   */
  const initialElements = useCallback(
    (numNodes: number, size: number, startData: Area[]): InitialElements => {
      const nodes: Node[] = [];
      const edges: Edge[] = [];
      const center = { x: 0, y: 0 };

      nodes.push({
        id: 'target',
        type: 'center',
        data: { color: '#000', title: 'Innovation Potential' },
        position: center,
      });
      // first layer
      for (let i = 0; i < numNodes; i++) {
        const degrees = i * (360 / numNodes);
        const radians = degrees * (Math.PI / 180);
        const x = Math.round(size * Math.cos(radians) + center.x);
        const y = Math.round(size * Math.sin(radians) + center.y);

        nodes.push({
          id: `${i}`,
          type: 'custom',
          // draggable: false,
          // selectable: false,
          data: { color: colors[i], title: startData[i].area.name },
          position: { x, y },
        });

        edges.push({
          id: `edge-${i}`,
          target: 'target',
          source: `${i}`,
          type: 'floating',
          markerEnd: {
            type: MarkerType.Arrow,
          },
        });
      }
      //second layer
      for (let i = 1; i <= numNodes; i++) {
        for (let j = 0; j < numNodes; j++) {
          const degrees = -60 + (j * 120) / (numNodes - 1) + (i - 1) * 120;
          const radians = degrees * (Math.PI / 180);
          // The position of the grandchild node is the position of the child node plus the added distance between child and grandchild (plus the size of the child node)
          const x =
            nodes[i].position.x + size * 1.1 * Math.cos(radians) + center.x;
          const y =
            nodes[i].position.y + size * 0.5 * Math.sin(radians) + center.y;

          nodes.push({
            //if child node has id i, then grandchild nodes will have id's from j+1 to j+numNodes
            id: `${i * 3 + j}`,
            type: 'custom',
            // draggable: true,
            // selectable: false,
            data: {
              color: colors[i - 1],
              title: startData[i - 1].area.contacts[j].name,
            },
            position: { x, y },
          });

          edges.push({
            id: `edge-${i * 3 + j}`,
            target: `${i - 1}`,
            source: `${i * 3 + j}`,
            type: 'floating',
            markerEnd: {
              type: MarkerType.Arrow,
            },
          });
        }
      }
      // for (let i = 0; i < numNodes * 3; i++) {
      //   const degrees = i * (360 / (numNodes * 3));
      //   const radians = degrees * (Math.PI / 180);
      //   const x = size * 2 * Math.cos(radians) + center.x;
      //   const y = size * 2 * Math.sin(radians) + center.y;

      //   nodes.push({
      //     id: `${i + numNodes}`,
      //     type: 'custom',
      //     draggable: false,
      //     selectable: false,
      //     data: { color: colors[i % 3], title: 'Sub Node' },
      //     position: { x, y },
      //   });

      //   edges.push({
      //     id: `edge-${i + numNodes}`,
      //     target: `${i + numNodes}`,
      //     source: `${i % numNodes}`,
      //     type: 'floating',
      //     markerEnd: {
      //       type: MarkerType.Arrow,
      //     },
      //   });
      // }

      return { nodes, edges };
    },
    []
  );

  return {
    getEdgeParams,
    initialElements,
  };
};

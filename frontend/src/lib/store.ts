import { Area, Contact } from '@/types';
import { create } from 'zustand';

interface NodeInfo {
  id: string;
  title: string;
  color: string;
  type: string;
  details?: {
    description?: string;
    contacts?: Contact[];
    institution?: string;
    email?: string;
    website?: string;
    rating?: number;
  } | null;
}

interface ClientState {
  roadmap: boolean;
  color1: string;
  color2: string;
  graphData: Area[];
  selectedNode: NodeInfo | null;
  setRoadmap: () => void;
  setGraphData: (graphData: Area[]) => void;
  setColor1: (color: string) => void;
  setColor2: (color: string) => void;
  setSelectedNode: (node: NodeInfo | null) => void;
}

export const useStore = create<ClientState>((set) => ({
  roadmap: false,
  color1: 'hsl(186,100%,50%)',
  color2: 'hsl(156,100%,50%)',
  graphData: [],
  selectedNode: null,
  setColor1: (color: string) => set({ color1: color }),
  setColor2: (color: string) => set({ color2: color }),
  setGraphData: (graphData: Area[]) => set({ graphData }),
  setSelectedNode: (node: NodeInfo | null) => set({ selectedNode: node }),
  setRoadmap: () =>
    set((state: { roadmap: boolean }) => ({ roadmap: !state.roadmap })),
}));

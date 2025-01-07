import { create } from 'zustand';
import { Edge, Node, addEdge, Connection } from 'reactflow';
import { produce } from 'immer';

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  highlightedNode: string | null;
  history: HistoryState[];
  currentHistoryIndex: number;
  isSimulating: boolean;
  currentSimulationNode: string | null;
  
  // Core actions
  addNode: (type: string, position: { x: number; y: number }) => void;
  updateNode: (id: string, data: any) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  loadWorkflow: (workflow: { nodes: Node[]; edges: Edge[] }) => void;
  setSelectedNode: (node: Node | null) => void;
  setHighlightedNode: (nodeId: string | null) => void;
  
  // Export/Import
  exportWorkflow: () => string;
  importWorkflow: (jsonString: string) => void;
  
  // Undo/Redo
  undo: () => void;
  redo: () => void;
  
  // Simulation
  startSimulation: () => void;
  stopSimulation: () => void;
}

const addToHistory = (state: WorkflowState) => {
  const newHistory = state.history.slice(0, state.currentHistoryIndex + 1);
  newHistory.push({ nodes: state.nodes, edges: state.edges });
  return {
    history: newHistory,
    currentHistoryIndex: newHistory.length - 1,
  };
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNode: null,
  highlightedNode: null,
  history: [{ nodes: [], edges: [] }],
  currentHistoryIndex: 0,
  isSimulating: false,
  currentSimulationNode: null,

  addNode: (type, position) => {
    set(
      produce((state: WorkflowState) => {
        const newNode = {
          id: `${type}-${Date.now()}`,
          type,
          position,
          data: { label: `New ${type}`, executionTime: 0 },
        };
        state.nodes.push(newNode);
        const historyUpdate = addToHistory(state);
        state.history = historyUpdate.history;
        state.currentHistoryIndex = historyUpdate.currentHistoryIndex;
      })
    );
  },

  updateNode: (id, data) => {
    set(
      produce((state: WorkflowState) => {
        const node = state.nodes.find((n) => n.id === id);
        if (node) {
          node.data = { ...node.data, ...data };
        }
        if (state.selectedNode?.id === id) {
          state.selectedNode.data = { ...state.selectedNode.data, ...data };
        }
        const historyUpdate = addToHistory(state);
        state.history = historyUpdate.history;
        state.currentHistoryIndex = historyUpdate.currentHistoryIndex;
      })
    );
  },

  onNodesChange: (changes) => {
    set(
      produce((state: WorkflowState) => {
        state.nodes = changes.reduce((acc, change) => {
          if (change.type === 'position' && change.dragging) {
            return acc.map((node) =>
              node.id === change.id
                ? { ...node, position: change.position }
                : node
            );
          }
          return acc;
        }, state.nodes);
        const historyUpdate = addToHistory(state);
        state.history = historyUpdate.history;
        state.currentHistoryIndex = historyUpdate.currentHistoryIndex;
      })
    );
  },

  onEdgesChange: (changes) => {
    set(
      produce((state: WorkflowState) => {
        state.edges = changes.reduce((acc, change) => {
          if (change.type === 'remove') {
            return acc.filter((edge) => edge.id !== change.id);
          }
          return acc;
        }, state.edges);
        const historyUpdate = addToHistory(state);
        state.history = historyUpdate.history;
        state.currentHistoryIndex = historyUpdate.currentHistoryIndex;
      })
    );
  },

  onConnect: (connection) => {
    set(
      produce((state: WorkflowState) => {
        state.edges = addEdge(connection, state.edges);
        const historyUpdate = addToHistory(state);
        state.history = historyUpdate.history;
        state.currentHistoryIndex = historyUpdate.currentHistoryIndex;
      })
    );
  },

  loadWorkflow: (workflow) => {
    set(
      produce((state: WorkflowState) => {
        state.nodes = workflow.nodes;
        state.edges = workflow.edges;
        const historyUpdate = addToHistory(state);
        state.history = historyUpdate.history;
        state.currentHistoryIndex = historyUpdate.currentHistoryIndex;
      })
    );
  },

  setSelectedNode: (node) => set({ selectedNode: node }),
  setHighlightedNode: (nodeId) => set({ highlightedNode: nodeId }),

  exportWorkflow: () => {
    const { nodes, edges } = get();
    return JSON.stringify({ nodes, edges }, null, 2);
  },

  importWorkflow: (jsonString) => {
    try {
      const workflow = JSON.parse(jsonString);
      if (workflow.nodes && workflow.edges) {
        set(
          produce((state: WorkflowState) => {
            state.nodes = workflow.nodes;
            state.edges = workflow.edges;
            const historyUpdate = addToHistory(state);
            state.history = historyUpdate.history;
            state.currentHistoryIndex = historyUpdate.currentHistoryIndex;
          })
        );
      }
    } catch (error) {
      console.error('Failed to import workflow:', error);
    }
  },

  undo: () => {
    set(
      produce((state: WorkflowState) => {
        if (state.currentHistoryIndex > 0) {
          state.currentHistoryIndex--;
          const historicState = state.history[state.currentHistoryIndex];
          state.nodes = historicState.nodes;
          state.edges = historicState.edges;
        }
      })
    );
  },

  redo: () => {
    set(
      produce((state: WorkflowState) => {
        if (state.currentHistoryIndex < state.history.length - 1) {
          state.currentHistoryIndex++;
          const historicState = state.history[state.currentHistoryIndex];
          state.nodes = historicState.nodes;
          state.edges = historicState.edges;
        }
      })
    );
  },

  startSimulation: () => {
    const state = get();
    const startNode = state.nodes.find((node) => node.type === 'start');
    if (!startNode) return;

    set({ isSimulating: true, currentSimulationNode: startNode.id });

    const simulateNext = (currentNodeId: string) => {
      const outgoingEdges = state.edges.filter((edge) => edge.source === currentNodeId);
      if (outgoingEdges.length === 0) {
        set({ isSimulating: false, currentSimulationNode: null });
        return;
      }

      const nextNodeId = outgoingEdges[0].target;
      const currentNode = state.nodes.find((node) => node.id === currentNodeId);
      const delay = (currentNode?.data.executionTime || 1) * 1000;

      setTimeout(() => {
        set({ currentSimulationNode: nextNodeId });
        simulateNext(nextNodeId);
      }, delay);
    };

    simulateNext(startNode.id);
  },

  stopSimulation: () => {
    set({ isSimulating: false, currentSimulationNode: null });
  },
}));
import { create } from 'zustand';
import { Edge, Node, addEdge, Connection } from 'reactflow';
import { produce } from 'immer';

/**
 * Represents the historical state of the workflow (nodes and edges).
 */
interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

/**
 * Represents the  states of the workflow, including nodes, edges, and simulation, highlight, select state.
 */
interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
  highlightedNode: string | null;
  history: HistoryState[];// History for undo/redo
  currentHistoryIndex: number;// Current index for undo/redo
  isSimulating: boolean;// Flag to check if simulation is running
  currentSimulationNode: string | null;// ID of the current node in simulation
  
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

/**
 * Adds the current state (nodes and edges) to history for undo/redo.
 * @param {WorkflowState} state - The current workflow state.
 * @returns {object} The updated history and current history index.
 */
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

   /**
   * Adds a new node of the specified type and position to the workflow.
   * @param {string} type - The type of the node to add.
   * @param {object} position - The position of the new node.
   */
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

    /**
   * Updates the data of a specific node by its ID.
   * @param {string} id - The ID of the node to update.
   * @param {object} data - The data to update the node with.
   */
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

   /**
   * Handles changes in nodes (e.g., dragging a node).
   * @param {Array} changes - An array of changes to apply to the nodes.
   */
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

  /**
   * Handles changes in edges (e.g., removing an edge).
   * @param {Array} changes - An array of changes to apply to the edges.
   */
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

   /**
   * Handles a new connection (edge) between two nodes.
   * @param {Connection} connection - The connection to add.
   */
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

   /**
   * Loads a workflow (nodes and edges) from a given object.
   * @param {object} workflow - An object containing the nodes and edges to load.
   */
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

    /**
   * Sets the selected node.
   * @param {Node | null} node - The node to select.
   */
  setSelectedNode: (node) => set({ selectedNode: node }),
   /**
   * Sets the highlighted node by its ID.
   * @param {string | null} nodeId - The ID of the node to highlight.
   */
  setHighlightedNode: (nodeId) => set({ highlightedNode: nodeId }),

   /**
   * Exports the current workflow (nodes and edges) as a JSON string.
   * @returns {string} - The workflow serialized as a JSON string.
   */
  exportWorkflow: () => {
    const { nodes, edges } = get();
    return JSON.stringify({ nodes, edges }, null, 2);
  },

    /**
   * Imports a workflow from a JSON string.
   * @param {string} jsonString - The JSON string representing the workflow.
   */
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

    /**
   * Undo the last change by reverting to a previous state in the history.
   */
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

  /**
   * Redo the last undone change by reverting to the next state in the history.
   */
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

    /**
   * Starts the simulation of the workflow, beginning from the "start" node.
   */
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
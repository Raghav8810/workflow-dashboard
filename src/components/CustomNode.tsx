import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Circle, Square, Diamond, Play } from 'lucide-react';
import { useWorkflowStore } from '../store/DashboardStore';

/**
 * Icons corresponding to different node types in the workflow.
 * @enum {React.Component} Icons for different node types in canvas.
 */
const icons = {
  start: Play,
  task: Square,
  decision: Diamond,
  end: Circle,
};

/**
 * CustomNode is a React component that represents a custom node in a canvas Flow diagram.
 * It is styled based on its type, highlight status, and simulation status.
 * 
 * @param {NodeProps} props - The properties passed to the node component.
 * @param {string} props.id - The unique identifier of the node.
 * @param {string} props.type - The type of the node (start, task, decision, or end).
 * @param {Object} props.data - The data associated with the node.
 * @param {string} props.data.label - The label to be displayed on the node.
 * @param {number} props.data.executionTime - The time associated with the node's execution in seconds.
 * 
 * @returns {JSX.Element} The rendered custom node element.
 */
export const CustomNode = memo(({ data, type, id }: NodeProps) => {
   // Get the corresponding icon based on the node type.
  const Icon = icons[type as keyof typeof icons];
    // Access the highlighted and current simulation node from the global store.
  const highlightedNode = useWorkflowStore((state) => state.highlightedNode);
  const currentSimulationNode = useWorkflowStore((state) => state.currentSimulationNode);
  // Determine if this node is highlighted or being simulated.
  const isHighlighted = highlightedNode === id;
  const isSimulating = currentSimulationNode === id;

  return (
    <div 
      className={`px-4 py-2 shadow-md rounded-md bg-white border-2 transition-all duration-200 ${
        isHighlighted ? 'border-blue-500 shadow-lg scale-105' : 
        isSimulating ? 'border-green-500 shadow-lg scale-105' :
        'border-gray-200'
      }`}
    >
         {/* The top handle for connecting the node to others */}
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="flex items-center">
        <Icon className={`mr-2 ${isSimulating ? 'text-green-500' : ''}`} />
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs text-gray-500">Time: {data.executionTime}s</div>
        </div>
      </div>
        {/* The bottom handle for connecting the node to others */}
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
});
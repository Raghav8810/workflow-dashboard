import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Circle, Square, Diamond, Play } from 'lucide-react';
import { useWorkflowStore } from '../store/workflowStore';

const icons = {
  start: Play,
  task: Square,
  decision: Diamond,
  end: Circle,
};

export const CustomNode = memo(({ data, type, id }: NodeProps) => {
  const Icon = icons[type as keyof typeof icons];
  const highlightedNode = useWorkflowStore((state) => state.highlightedNode);
  const currentSimulationNode = useWorkflowStore((state) => state.currentSimulationNode);
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
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="flex items-center">
        <Icon className={`mr-2 ${isSimulating ? 'text-green-500' : ''}`} />
        <div className="ml-2">
          <div className="text-sm font-bold">{data.label}</div>
          <div className="text-xs text-gray-500">Time: {data.executionTime}s</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
});
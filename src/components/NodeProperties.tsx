import React from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { Input } from './ui/input';
import { Label } from './ui/label';

export const NodeProperties: React.FC = () => {
  const { selectedNode, updateNode } = useWorkflowStore();

  if (!selectedNode) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Select a node to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Node Properties</h3>
      <div className="space-y-2">
        <Label htmlFor="text">Node name</Label>
        <Input type="text" placeholder="Edit name of node"
         value={selectedNode.data.label}
         onChange={(e) => updateNode(selectedNode.id, { label: e.target.value })}
        />
        <Label htmlFor="number">Execution Time (seconds)</Label>
        <Input type="number" placeholder="Edit name of node"
        min="0"
        value={selectedNode.data.executionTime}
        onChange={(e) => updateNode(selectedNode.id, { executionTime: Number(e.target.value) })}
        />
      
      </div>
    </div>
  );
};
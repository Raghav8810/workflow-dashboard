import React from 'react';
import { useWorkflowStore } from '../store/DashboardStore';
import { Input } from './ui/input';
import { Label } from './ui/label';

/**
 * NodeProperties is a functional component that displays and allows the editing of properties of nodes
 * for a selected node in the workflow. It provides fields to edit the node's label and execution time.
 * 
 * If no node is selected, it prompts the user to select one.
 * 
 * @returns {JSX.Element} The rendered component containing the node properties editor or a message
 * indicating that no node is selected.
 */
export const NodeProperties: React.FC = () => {
  // Get the selected node and the function to update the node from the workflow store
  const { selectedNode, updateNode } = useWorkflowStore();

   // If no node is selected, display a message to inform the user
  if (!selectedNode) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Select a node to edit its properties</p>
      </div>
    );
  }

  return (
    <div className="p-2 space-y-2">
      <h3 className="text-lg font-semibold">Properties</h3>
      <div className="space-y-2">
        <Label htmlFor="text">Name</Label>
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
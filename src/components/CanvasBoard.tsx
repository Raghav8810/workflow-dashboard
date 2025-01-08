import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  // EdgeTypes,
  NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../store/DashboardStore';
import { CustomNode } from './CustomNode';
import { useWorkflowValidation } from '../hooks/useWorkflowValidation';

const nodeTypes: NodeTypes = {
  start: CustomNode,
  task: CustomNode,
  decision: CustomNode,
  end: CustomNode,
};

export const CanvasBoard: React.FC = () => {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    addNode,
    setSelectedNode 
  } = useWorkflowStore();

  const validateWorkflow = useWorkflowValidation(nodes, edges);
  const { isValid, errors } = validateWorkflow();

  const onNodeClick: NodeMouseHandler = (_, node) => {
    setSelectedNode(node);
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = {
        x: event.clientX - 100,
        y: event.clientY - 40,
      };

      addNode(type, position);
    },
    [addNode]
  );
  

  return (
    <div className="flex-1 h-full">
      {!isValid && (
        <div className={`absolute top-4 right-4 z-10 ${errors.disconnectedNodes.length > 0 || errors.multipleStartNodes? "bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded" : ""} `}>
          {errors.multipleStartNodes && (
            <p>Error: Multiple start nodes detected</p>
          )}
          {errors.disconnectedNodes.length > 0 && (
            <p>Warning: Disconnected nodes detected</p>
          )}
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[15, 15]}
        
      >
        <Background color="#444" gap={15}  />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
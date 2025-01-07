import { useCallback } from 'react';
import { Node, Edge } from 'reactflow';

export const useWorkflowValidation = (nodes: Node[], edges: Edge[]) => {
  const validateWorkflow = useCallback(() => {
    const startNodes = nodes.filter((node) => node.type === 'start');
    const disconnectedNodes = nodes.filter((node) => {
      const hasIncoming = edges.some((edge) => edge.target === node.id);
      const hasOutgoing = edges.some((edge) => edge.source === node.id);
      return node.type !== 'start' && !hasIncoming && !hasOutgoing;
    });

    return {
      isValid: startNodes.length === 1 && disconnectedNodes.length === 0,
      errors: {
        multipleStartNodes: startNodes.length > 1,
        disconnectedNodes: disconnectedNodes.map((node) => node.id),
      },
    };
  }, [nodes, edges]);

  return validateWorkflow;
};
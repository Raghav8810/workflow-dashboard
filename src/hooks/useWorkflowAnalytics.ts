import { useMemo } from 'react';
import { Node, Edge } from 'reactflow';

export const useWorkflowAnalytics = (nodes: Node[], edges: Edge[]) => {
  return useMemo(() => {
    // Bar chart data - execution time per node
    const executionTimeData = nodes.map(node => ({
      id: node.id,
      name: node.data.label,
      executionTime: node.data.executionTime,
      type: node.type,
    }));

    // Pie chart data - execution time by node type
    const executionTimeByType = nodes.reduce((acc, node) => {
      const type = node.type || 'unknown';
      acc[type] = (acc[type] || 0) + (node.data.executionTime || 0);
      return acc;
    }, {} as Record<string, number>);

    const pieChartData = Object.entries(executionTimeByType).map(([type, value]) => ({
      type,
      value,
    }));

    // Line chart data - cumulative execution time
    const cumulativeData = edges.reduce((paths: any[], edge) => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      if (sourceNode && targetNode) {
        paths.push({
          from: sourceNode.data.label,
          to: targetNode.data.label,
          time: sourceNode.data.executionTime + targetNode.data.executionTime,
        });
      }
      
      return paths;
    }, []);

    return {
      executionTimeData,
      pieChartData,
      cumulativeData,
    };
  }, [nodes, edges]);
};
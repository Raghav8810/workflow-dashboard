import React, { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { useWorkflowAnalytics } from '../../hooks/useWorkflowAnalytics';
import { BarChart } from './BarChart';
import { PieChart } from './PieChart';
import { LineChart } from './LineChart';
import { ArrowDownFromLine, ArrowUpFromLine } from 'lucide-react';

export const AnalyticsPanel: React.FC = () => {
  const { nodes, edges, setHighlightedNode } = useWorkflowStore();
  const { executionTimeData, pieChartData, cumulativeData } = useWorkflowAnalytics(nodes, edges);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleBarHover = (nodeId: string | null) => {
    setHighlightedNode(nodeId);
  };

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-[#F5ECD5] border-t border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'h-12' : 'h-[40vh] md:h-80'
    }`}>
      <div
        className="flex items-center justify-between px-4 py-2 bg-[#578E7E] cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h3 className="font-bold">Analytics Panel</h3>
        <button className="text-[#f3e4bd] hover:text-[#c6bea9] p-2">
            <div>
              {isCollapsed ? <ArrowUpFromLine size={24} /> : <ArrowDownFromLine size={24} />}
       </div>
         </button>

      </div>
      
      {!isCollapsed && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-[calc(40vh-3rem)] md:h-64 overflow-auto">
          <div className="bg-[#FFFAEC] p-4 rounded">
            <h4 className="font-medium mb-2">Execution Time</h4>
            <BarChart data={executionTimeData} onBarHover={handleBarHover} />
          </div>
          <div className="bg-[#FFFAEC] p-4 rounded">
            <h4 className="font-medium mb-2">Time Distribution</h4>
            <PieChart data={pieChartData} />
          </div>
          <div className="bg-[#FFFAEC] p-4 rounded">
            <h4 className="font-medium mb-2">Cumulative Execution Time</h4>
            <LineChart data={cumulativeData} />
          </div>
        </div>
      )}
    </div>
  );
};
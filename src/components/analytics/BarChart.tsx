import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useWorkflowStore } from '../../store/DashboardStore';


/**
 * Props for the BarChart component.
 * 
 * @typedef {Object} Props
 * @property {Array<{id: string, name: string, executionTime: number}>} data - The data to be displayed in the bar chart.
 * @property {(nodeId: string | null) => void} [onBarHover] - Optional callback function to handle hovering over bars. 
 */
interface Props {
  data: Array<{
    id: string;
    name: string;
    executionTime: number;
  }>;
  onBarHover?: (nodeId: string | null) => void;
}

/**
 * BarChart component displays a bar chart visualizing the execution time of nodes in the workflow.
 * The chart shows the execution time for each node and provides a hover effect to highlight the node.
 * 
 * @param {Props} props - The props for the BarChart component.
 * @param {Array<{id: string, name: string, executionTime: number}>} props.data - The chart data with node IDs, names, and execution times.
 * @param {(nodeId: string | null) => void} [props.onBarHover] - Optional callback function invoked when a bar is hovered.
 * 
 * @returns {JSX.Element} The rendered BarChart component.
 */
export const BarChart: React.FC<Props> = ({ data, onBarHover }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: 'Execution Time (s)', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
          content={({ payload, label }) => {
            if (!payload?.length) return null;
            return (
              <div className="bg-white p-2 border rounded shadow-lg">
                <p className="font-semibold">{label}</p>
                <p>Execution Time: {payload[0].value}s</p>
              </div>
            );
          }}
        />
        <Bar
          dataKey="executionTime"
          fill="#8884d8"
          onMouseEnter={(data) => onBarHover?.(data.id)}
          onMouseLeave={() => onBarHover?.(null)}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};
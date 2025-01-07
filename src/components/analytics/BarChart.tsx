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
import { useWorkflowStore } from '../../store/workflowStore';

interface Props {
  data: Array<{
    id: string;
    name: string;
    executionTime: number;
  }>;
  onBarHover?: (nodeId: string | null) => void;
}

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
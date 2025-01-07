import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface Props {
  data: Array<{
    type: string;
    value: number;
  }>;
}

export const PieChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RechartsPieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="type"
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          content={({ payload }) => {
            if (!payload?.length) return null;
            const { type, value } = payload[0].payload;
            return (
              <div className="bg-white p-2 border rounded shadow-lg">
                <p className="font-semibold">{type}</p>
                <p>Total Time: {value}s</p>
              </div>
            );
          }}
        />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};
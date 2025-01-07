import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface Props {
  data: Array<{
    from: string;
    to: string;
    time: number;
  }>;
}

export const LineChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="from" />
        <YAxis label={{ value: 'Cumulative Time (s)', angle: -90, position: 'insideLeft' }} />
        <Tooltip
          content={({ payload, label }) => {
            if (!payload?.length) return null;
            return (
              <div className="bg-white p-2 border rounded shadow-lg">
                <p className="font-semibold">{label} → {payload[0].payload.to}</p>
                <p>Cumulative Time: {payload[0].value}s</p>
              </div>
            );
          }}
        />
        <Line type="monotone" dataKey="time" stroke="#8884d8" />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
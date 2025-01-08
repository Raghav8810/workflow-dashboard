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

/**
 * Props for the LineChart component.
 * 
 * @typedef {Object} Props
 * @property {Array<{from: string, to: string, time: number}>} data - The data to be displayed in the line chart. Each data point contains:
 *   - `from`: The starting node or time point.
 *   - `to`: The ending node or time point.
 *   - `time`: The cumulative execution time between the `from` and `to`.
 */
interface Props {
  data: Array<{
    from: string;
    to: string;
    time: number;
  }>;
}

/**
 * LineChart component displays a line chart visualizing the cumulative execution time over time or workflow steps.
 * The chart shows a cumulative timeline from one node to the next, with the cumulative time at each step.
 * 
 * @param {Props} props - The props for the LineChart component.
 * @param {Array<{from: string, to: string, time: number}>} props.data - The chart data with time points, their starting and ending labels, and cumulative times.
 * 
 * @returns {JSX.Element} The rendered LineChart component.
 */
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
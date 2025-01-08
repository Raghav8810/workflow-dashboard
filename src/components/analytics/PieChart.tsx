import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Define a set of colors for pie chart segments
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

/**
 * Props for the PieChart component.
 * 
 * @typedef {Object} Props
 * @property {Array<{type: string, value: number}>} data - The data to be displayed in the pie chart. Each data point contains:
 *   - `type`: The type or category of the data (e.g., task type or decision type).
 *   - `value`: The numerical value associated with the type (e.g., execution time).
 */
interface Props {
  data: Array<{
    type: string;
    value: number;
  }>;
}

/**
 * PieChart component displays a pie chart visualizing the distribution of values across different types.
 * The chart segments represent different categories, with the size of each segment based on the associated value.
 * 
 * @param {Props} props - The props for the PieChart component.
 * @param {Array<{type: string, value: number}>} props.data - The chart data, where each entry represents a type and its corresponding value.
 * 
 * @returns {JSX.Element} The rendered PieChart component.
 */
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
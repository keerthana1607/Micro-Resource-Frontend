

// TaskComparisonChart.js
// TaskComparisonChart.js
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const TaskComparisonChart = ({ calculateEstimatedHours, totalHours }) => {
  // Example data
  const data = [
    { name: 'Estimated Hours', value: calculateEstimatedHours },
    { name: 'Total Hours', value: totalHours }
  ];

  // Conditional styling based on hours comparison
  const isWorkBalanced = totalHours < calculateEstimatedHours;

  // Debugging data
  console.log('Chart Data:', data);

  return (
    <div style={{ height: '400px', width: '100%', position: 'relative' }}>
      <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill={isWorkBalanced ? '#82ca9d' : '#ff6347'} />
      </BarChart>

      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: isWorkBalanced ? '#82ca9d' : '#ff6347',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '20px',
        fontWeight: 'bold'
      }}>
        {isWorkBalanced ? 'Work Balanced' : 'Work Overload'}
      </div>
    </div>
  );
};

export default TaskComparisonChart;

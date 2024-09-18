import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const PieChart = ({ width = 500, height = 500 }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects
        const projectsResponse = await fetch('http://localhost:7777/project/getAll');
        const projects = await projectsResponse.json();
        const projectCount = projects.length;

        // Fetch users
        const usersResponse = await fetch('http://localhost:7777/user/getAllUserList');
        const users = await usersResponse.json();

        // Count users by role
        const employeesCount = users.filter(user => user.role === 'employee').length;
        const projectManagersCount = users.filter(user => user.role === 'project manager').length;

        // Update chart data
        setChartData({
          labels: ['Projects', 'Employees', 'Project Managers'],
          datasets: [
            {
              data: [projectCount, employeesCount, projectManagersCount],
              backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
              borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        setError('Error fetching data');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          }
        }
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ width: width, height: height, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;

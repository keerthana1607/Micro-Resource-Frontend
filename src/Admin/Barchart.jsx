import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Barchart = ({ width = 500, height = 500 }) => {
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
        if (!projectsResponse.ok) {
          throw new Error(`Projects fetch failed: ${projectsResponse.statusText}`);
        }
        const projects = await projectsResponse.json();
        const projectCount = projects.length;

        // Fetch users
        const usersResponse = await fetch('http://localhost:7777/user/getAllUserList');
        if (!usersResponse.ok) {
          throw new Error(`Users fetch failed: ${usersResponse.statusText}`);
        }
        const users = await usersResponse.json();

        // Count users by role
        const employeesCount = users.filter(user => user.role === 'employee').length;
        const projectManagersCount = users.filter(user => user.role === 'project manager').length;

        // Create chart data
        setChartData({
          labels: ['Projects', 'Employees', 'Project Managers'],
          datasets: [
            {
              label: 'Count',
              data: [projectCount, employeesCount, projectManagersCount],
              backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
              borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Error fetching data: ${error.message}`);
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
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default Barchart;

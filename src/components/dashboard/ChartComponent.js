import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

const ChartComponent = ({ tableData }) => {
  useEffect(() => {
    if (tableData.length > 0) {
      const ctx = document.getElementById('myChart').getContext('2d');
      const myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: tableData.map(item => item.name),
          datasets: [{
            label: 'Total Time',
            data: tableData.map(item => (item.totalElapsedTime.hours * 3600) + (item.totalElapsedTime.minutes * 60) + item.totalElapsedTime.seconds),
            backgroundColor: 'rgba(534, 12, 12s35, 0.5)',
            borderColor: 'rgba(774, 192, 19, 1)',
            borderWidth: 3
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Total Time (seconds)'
              }
            }
          }
        }
      });

      return () => myChart.destroy();
    }
  }, [tableData]);

  return (
    <div style={{ overflowX: "inherit" }}>
      <canvas id="myChart" width="500" height="400"></canvas>
    </div>
  );
};

export default ChartComponent;

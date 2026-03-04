// Chart.js implementation for OpenRA player activity chart (games page)
// Shows last 2 weeks of player activity

const rrdFile = 'https://activity.openra.net/db/openra-players.rrd';

// Chart.js default configuration
Chart.defaults.color = 'rgba(255, 255, 255, 0.8)';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';
Chart.defaults.font.family = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// Helper function to create chart configuration
function createChartConfig(datasets) {
  return {
    type: 'line',
    data: {
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          titleColor: '#000',
          bodyColor: '#000',
          borderColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
          padding: 10,
          displayColors: true,
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + context.parsed.y;
            }
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            displayFormats: {
              hour: 'MMM d, HH:mm',
              day: 'MMM d'
            }
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.8)',
            maxRotation: 0,
            autoSkipPadding: 20
          }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.05)'
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.8)'
          }
        }
      }
    }
  };
}

// Helper function to convert RRD data to Chart.js format
function rrdDataToChartJS(rrd_file, rra_idx) {
  const flotObj = rrdRRAStackFlotObj(
    rrd_file,
    rra_idx,
    ['playing'],
    [],
    ['waiting'],
    0,
    true,
    true,
    false
  );

  const datasets = [];
  
  for (let i = 0; i < flotObj.data.length; i++) {
    const series = flotObj.data[i];
    const chartData = series.data.map(point => ({
      x: point[0],
      y: point[1]
    }));

    let backgroundColor, borderColor;
    if (series.label.toLowerCase() === 'playing') {
      backgroundColor = 'rgba(0, 128, 0, 0.5)';
      borderColor = 'rgba(0, 128, 0, 1)';
    } else if (series.label.toLowerCase() === 'waiting') {
      backgroundColor = 'rgba(255, 165, 0, 0.5)';
      borderColor = 'rgba(255, 165, 0, 1)';
    } else {
      backgroundColor = 'rgba(100, 100, 100, 0.5)';
      borderColor = 'rgba(100, 100, 100, 1)';
    }

    datasets.push({
      label: series.label.charAt(0).toUpperCase() + series.label.slice(1),
      data: chartData,
      backgroundColor: backgroundColor,
      borderColor: borderColor,
      borderWidth: 1,
      fill: true,
      tension: 0,
      pointRadius: 0,
      pointHoverRadius: 3
    });
  }

  return datasets;
}

// Function to create the player activity chart
function createPlayerChart(containerId, rrd_file, rra_idx) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container not found:', containerId);
    return;
  }

  container.innerHTML = '<canvas></canvas>';
  const canvas = container.querySelector('canvas');
  
  try {
    const datasets = rrdDataToChartJS(rrd_file, rra_idx);
    const config = createChartConfig(datasets);
    new Chart(canvas, config);
  } catch (error) {
    console.error('Error creating chart:', error);
    container.innerHTML = '<p style="color: rgba(255,255,255,0.8); padding: 1rem;">Error loading chart data.</p>';
  }
}

// Load RRD file and create chart
function loadChartCallback() {
  if (this.readyState == 4) {
    try {
      const bf = new BinaryFile(this.responseText);
      const rrd_file = new RRDFile(bf);
      
      // Create chart with RRA index 2 (30 minute average, last 2 weeks)
      createPlayerChart('players', rrd_file, 2);
    } catch (error) {
      console.error('Error parsing RRD file:', error);
      const container = document.getElementById('players');
      if (container) {
        container.innerHTML = '<p style="color: rgba(255,255,255,0.8); padding: 1rem;">Error loading chart data.</p>';
      }
    }
  }
}

FetchBinaryURLAsync(rrdFile, loadChartCallback);
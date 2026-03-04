// Chart.js implementation for OpenRA player statistics
// Replaces the old Flot-based implementation

const rrdFile = "https://activity.openra.net/db/openra-players.rrd";

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
              day: 'MMM d',
              week: 'MMM d',
              month: 'MMM yyyy'
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
  // Use the existing RRD library to get flot-formatted data
  const flotObj = rrdRRAStackFlotObj(
    rrd_file,
    rra_idx,
    ['playing'],    // positive stack
    [],             // negative stack  
    ['waiting'],    // single series
    0,              // timestamp shift
    true,           // want_ds_labels
    true,           // want_rounding
    false           // one_undefined_enough
  );

  const datasets = [];
  
  // Convert each series from Flot format to Chart.js format
  for (let i = 0; i < flotObj.data.length; i++) {
    const series = flotObj.data[i];
    const chartData = series.data.map(point => ({
      x: point[0], // timestamp in milliseconds
      y: point[1]  // value
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

// Function to create a chart in a container
function createPlayerChart(containerId, rrd_file, rra_idx) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container not found:', containerId);
    return;
  }

  // Clear loading message and create canvas
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

// Load and parse RRD file, then create all charts
function loadChartsCallback() {
  if (this.readyState == 4) {
    try {
      const bf = new BinaryFile(this.responseText);
      const rrd_file = new RRDFile(bf);
      
      // Create charts with different RRA indices for different time ranges
      createPlayerChart('thirtyseconds', rrd_file, 0);  // 30 second average, last 5 hours
      createPlayerChart('fiveminutes', rrd_file, 1);     // 5 minute average, last 2 days
      createPlayerChart('halfanhour', rrd_file, 2);      // 30 minute average, last 2 weeks
      createPlayerChart('daily', rrd_file, 4);           // 1 day average, last 2 years
    } catch (error) {
      console.error('Error parsing RRD file:', error);
      ['thirtyseconds', 'fiveminutes', 'halfanhour', 'daily'].forEach(id => {
        const container = document.getElementById(id);
        if (container) {
          container.innerHTML = '<p style="color: rgba(255,255,255,0.8); padding: 1rem;">Error loading chart data.</p>';
        }
      });
    }
  }
}

FetchBinaryURLAsync(rrdFile, loadChartsCallback);
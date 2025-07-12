async function fetchEggData() {
  const response = await fetch('/api/stats/eggs');
  const data = await response.json();

  const labels = Object.keys(data);
  const values = Object.values(data);

  const ctx = document.getElementById('eggsChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Œufs disponibles (non utilisés)',
        data: values,
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Ponte quotidienne des œufs",
          font: { size: 18 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Nombre d’œufs' }
        },
        x: {
          title: { display: true, text: 'Date' }
        }
      }
    }
  });
}

fetchEggData();

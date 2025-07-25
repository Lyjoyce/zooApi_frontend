const ctx = document.getElementById('eggsChart').getContext('2d');

const eggsChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
    datasets: [{
      label: 'Œufs pondus',
      data: [2, 1, 4, 0, 3], // À remplacer dynamiquement si besoin
      backgroundColor: '#F4D35E', // Jaune savane
      borderColor: '#F4D35E',
      borderWidth: 1
    }]
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: "Nombre d'œufs pondus par jour",
        font: {
          size: 20
        },
        color: '#138D75' // Vert canard
      },
      legend: {
        labels: {
          color: '#000000' // Noir
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Nombre d'œufs",
          color: '#000000'
        },
        ticks: {
          color: '#000000'
        }
      },
      x: {
        title: {
          display: true,
          text: "Jour de la semaine",
          color: '#000000'
        },
        ticks: {
          color: '#000000'
        }
      }
    }
  }
});

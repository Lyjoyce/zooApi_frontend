// Centralisation du token (récupéré une seule fois)
const jwtToken = sessionStorage.getItem("jwt");

if (!jwtToken) {
  console.warn("⚠️ Aucun token JWT trouvé. Certaines requêtes protégées échoueront.");
}

// Création d'un compte employé
document.getElementById("employee-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const firstName = document.getElementById("empFirstName").value;
  const lastName = document.getElementById("empLastName").value;
  const email = document.getElementById("empEmail").value;
  const password = document.getElementById("empPassword").value;

  try {
    const response = await fetch("http://localhost:8081/api/v1/admin/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + jwtToken
      },
      body: JSON.stringify({ firstName, lastName, email, password })
    });

    if (response.ok) {
      alert("✅ Employé créé avec succès !");
      document.getElementById("employee-form").reset();
    } else {
      const error = await response.text();
      alert("❌ Erreur : " + error);
    }
  } catch (err) {
    console.error("Erreur lors de la requête :", err);
    alert("❌ Une erreur est survenue.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const eggTableBody = document.getElementById("egg-table-body");
  const listeInscriptions = document.getElementById("liste-inscriptions");

  // Graphique : Œufs pondus
  new Chart(document.getElementById("eggsChart"), {
    type: 'bar',
    data: {
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      datasets: [{
        label: 'Œufs pondus',
        data: [3, 4, 2, 5, 6, 1, 0],
        backgroundColor: '#F88379'
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  // Graphique : Ateliers Omelette
  new Chart(document.getElementById("workshopsChart"), {
    type: 'line',
    data: {
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      datasets: [{
        label: 'Ateliers Omelette',
        data: [1, 2, 1, 3, 2, 1, 0],
        borderColor: '#138D75',
        backgroundColor: '#138D75',
        fill: false,
        tension: 0.3
      }]
    },
    options: { responsive: true, plugins: { legend: { display: true } } }
  });

  // Chargement des tickets d'inscription
  async function fetchTickets() {
    try {
      const response = await fetch("http://localhost:8081/api/v1/reservationTicket/all", {
        headers: { "Authorization": "Bearer " + jwtToken }
      });

      if (!response.ok) throw new Error("Erreur lors de la récupération des tickets");

      const tickets = await response.json();
      listeInscriptions.innerHTML = "";

      tickets.forEach(t => {
        const li = document.createElement("li");
        li.textContent = `${t.firstName} ${t.lastName} (${t.email}) - ${t.visitDate} - Confirmé: ${t.confirmed ? "✅" : "❌"}`;
        listeInscriptions.appendChild(li);
      });

    } catch (err) {
      console.error("Erreur tickets:", err);
      listeInscriptions.innerHTML = "<li>Impossible de charger les inscriptions.</li>";
    }
  }

  // Chargement des œufs à valider
  async function fetchEggs() {
    try {
      const response = await fetch("http://localhost:8081/api/eggs/to-validate");
      const eggs = await response.json();
      eggTableBody.innerHTML = "";

      eggs.forEach(egg => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${egg.id}</td>
          <td>${egg.dateLaid}</td>
          <td>${egg.female?.name || 'Inconnue'}</td>
          <td><button class="validate-btn" data-id="${egg.id}">Valider</button></td>
        `;
        eggTableBody.appendChild(row);
      });

      // Ajout des listeners aux boutons après génération
      document.querySelectorAll(".validate-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          await fetch(`http://localhost:8081/api/eggs/validate/${id}`, {
            method: 'PUT'
          });
          alert("✅ Œuf validé !");
          fetchEggs();
        });
      });

    } catch (err) {
      console.error("Erreur lors de la récupération des œufs :", err);
      eggTableBody.innerHTML = "<tr><td colspan='4'>Impossible de charger les œufs à valider.</td></tr>";
    }
  }

  // Initialisation
  fetchTickets();
  fetchEggs();
});

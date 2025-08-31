// Centralisation du JWT

const jwtToken = sessionStorage.getItem("jwt");
if (!jwtToken) {
  console.warn("⚠️ Aucun token JWT trouvé. Certaines requêtes protégées échoueront.");
}

// Employés
// API : création d'un employé
async function createEmployee(firstName, lastName, email, password) {
  const response = await fetch("http://localhost:8080/api/v1/employees", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + jwtToken
    },
    body: JSON.stringify({ firstName, lastName, email, password })
  });
  return response;
}

// Affichage résultat création employé
async function afficherCreationEmploye(response) {
  if (response.ok) {
    alert("✅ Employé créé avec succès !");
    document.getElementById("employee-form").reset();
  } else {
    const error = await response.text();
    alert("❌ Erreur : " + error);
  }
}

// Orchestration : soumission formulaire
function initFormEmploye() {
  document.getElementById("employee-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const firstName = document.getElementById("empFirstName").value;
    const lastName = document.getElementById("empLastName").value;
    const email = document.getElementById("empEmail").value;
    const password = document.getElementById("empPassword").value;

    try {
      const response = await createEmployee(firstName, lastName, email, password);
      await afficherCreationEmploye(response);
    } catch (err) {
      console.error("Erreur lors de la requête :", err);
      alert("❌ Une erreur est survenue.");
    }
  });
}

// Tickets
async function getTickets() {
  const response = await fetch("http://localhost:8080/api/v1/reservationTicket/all", {
    headers: { "Authorization": "Bearer " + jwtToken }
  });
  if (!response.ok) throw new Error("Erreur lors de la récupération des tickets");
  return await response.json();
}

function afficherTickets(tickets, listeInscriptions) {
  listeInscriptions.innerHTML = "";
  tickets.forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t.firstName} ${t.lastName} (${t.email}) - ${t.visitDate} - Confirmé: ${t.confirmed ? "✅" : "❌"}`;
    listeInscriptions.appendChild(li);
  });
}

async function chargerTickets(listeInscriptions) {
  try {
    const tickets = await getTickets();
    afficherTickets(tickets, listeInscriptions);
  } catch (err) {
    console.error("Erreur tickets:", err);
    listeInscriptions.innerHTML = "<li>Impossible de charger les inscriptions.</li>";
  }
}

// Œufs
async function getEggs() {
  const response = await fetch("http://localhost:8080/api/eggs/to-validate");
  if (!response.ok) throw new Error("Erreur lors de la récupération des œufs");
  return await response.json();
}

function afficherEggs(eggs, eggTableBody) {
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
}

async function validerEgg(id) {
  await fetch(`http://localhost:8080/api/eggs/validate/${id}`, { method: "PUT" });
}

function initValidationEggs(eggTableBody) {
  document.querySelectorAll(".validate-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await validerEgg(id);
      alert("✅ Œuf validé !");
      await chargerEggs(eggTableBody); // recharger la liste après validation
    });
  });
}

async function chargerEggs(eggTableBody) {
  try {
    const eggs = await getEggs();
    afficherEggs(eggs, eggTableBody);
    initValidationEggs(eggTableBody);
  } catch (err) {
    console.error("Erreur lors de la récupération des œufs :", err);
    eggTableBody.innerHTML = "<tr><td colspan='4'>Impossible de charger les œufs à valider.</td></tr>";
  }
}

// =========================
// Graphiques
// =========================
function initCharts() {
  new Chart(document.getElementById("eggsChart"), {
    type: 'bar',
    data: {
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      datasets: [{
        label: 'Œufs pondus',
        data: [3, 4, 2, 5, 6, 1, 0],
        backgroundColor: '#000',
        color: '#000'
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });

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
    options: {
      responsive: true,
      plugins: { legend: { display: true } }
    }
  });
}

// =========================
// Initialisation globale
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const eggTableBody = document.getElementById("egg-table-body");
  const listeInscriptions = document.getElementById("liste-inscriptions");

  initFormEmploye();
  initCharts();
  chargerTickets(listeInscriptions);
  chargerEggs(eggTableBody);
});

/*
// Récupère les tickets depuis l'API
async function getTickets() {
  const response = await fetch("http://localhost:8080/api/v1/reservationTicket/all", {
    headers: { "Authorization": "Bearer " + jwtToken }
  });

  if (!response.ok) throw new Error("Erreur lors de la récupération des tickets");
  return await response.json();
}

// Affiche les tickets dans la liste
function afficherTickets(tickets) {
  listeInscriptions.innerHTML = "";
  tickets.forEach(t => {
    const li = document.createElement("li");
    li.textContent = `${t.firstName} ${t.lastName} (${t.email}) - ${t.visitDate} - Confirmé: ${t.confirmed ? "✅" : "❌"}`;
    listeInscriptions.appendChild(li);
  });
}

// Charge et affiche les tickets
async function chargerTickets() {
  try {
    const tickets = await getTickets();
    afficherTickets(tickets);
  } catch (err) {
    console.error("Erreur tickets:", err);
    listeInscriptions.innerHTML = "<li>Impossible de charger les inscriptions.</li>";
  }
}
*/

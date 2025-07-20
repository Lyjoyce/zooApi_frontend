// Attache un écouteur à la soumission du formulaire
document.getElementById("employee-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const firstName = document.getElementById("empFirstName").value;
  const lastName = document.getElementById("empLastName").value;
  const email = document.getElementById("empEmail").value;
  const password = document.getElementById("empPassword").value;

  const token = sessionStorage.getItem("jwt"); // 🔐 le token JWT de l’admin connecté

  try {
    const response = await fetch("/api/v1/admin/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ firstName, lastName, email, password })
    });

    if (response.ok) {
      alert("✅ Employé créé avec succès !");
      // Réinitialise le formulaire
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
  const omeletteList = document.getElementById("liste-omelette");
  const nourrirList = document.getElementById("liste-nourrir");
  const eggTableBody = document.getElementById("egg-table-body");

  // Liste d’attente depuis localStorage
  const attente = JSON.parse(localStorage.getItem("listeAttente")) || [];

  attente.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.prenom} ${item.nom} - ${item.email} (${item.type})`;

    if (item.ateliers.includes("omelette")) {
      omeletteList.appendChild(li.cloneNode(true));
    }
    if (item.ateliers.includes("nourrir")) {
      nourrirList.appendChild(li.cloneNode(true));
    }
  });

  // Création employé (simulation)
  document.getElementById("employee-form").addEventListener("submit", e => {
    e.preventDefault();
    const firstName = document.getElementById("empFirstName").value;
    const lastName = document.getElementById("empLastName").value;
    const email = document.getElementById("empEmail").value;
    const password = document.getElementById("empPassword").value;

    console.log("Création employé :", { firstName, lastName, email, password });
    alert("Employé créé (simulation)");
    e.target.reset();
  });

  // Graphique œufs pondus
  const ctxEggs = document.getElementById("eggsChart").getContext("2d");
  new Chart(ctxEggs, {
    type: 'bar',
    data: {
      labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
      datasets: [{
        label: 'Œufs pondus',
        data: [3, 4, 2, 5, 6, 1, 0],
        backgroundColor: '#F88379'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });

  // Graphique ateliers omelette
  const ctxWorkshops = document.getElementById("workshopsChart").getContext("2d");
  new Chart(ctxWorkshops, {
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
      plugins: {
        legend: { display: true }
      }
    }
  });

  // Œufs à valider
  async function fetchEggs() {
    const response = await fetch("http://localhost:8080/api/eggs/to-validate");
    const eggs = await response.json();
    eggTableBody.innerHTML = "";

    eggs.forEach(egg => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${egg.id}</td>
        <td>${egg.dateLaid}</td>
        <td>${egg.female ? egg.female.name || 'N/A' : 'Inconnue'}</td>
        <td><button onclick="validateEgg(${egg.id})">Valider</button></td>
      `;
      eggTableBody.appendChild(row);
    });
  }

  window.validateEgg = async function(id) {
    await fetch(`http://localhost:8080/api/eggs/validate/${id}`, {
      method: 'PUT'
    });
    alert("Œuf validé !");
    fetchEggs();
  };

  fetchEggs();
});

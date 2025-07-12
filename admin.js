document.addEventListener("DOMContentLoaded", () => {
  const omeletteList = document.getElementById("liste-omelette");
  const nourrirList = document.getElementById("liste-nourrir");

  // Affichage liste d’attente
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

  // Création d’un employé (simulé ici)
  document.getElementById("employee-form").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("empName").value;
    const email = document.getElementById("empEmail").value;
    const password = document.getElementById("empPassword").value;

    // Backend à relier à /api/v1/auth/register avec rôle EMPLOYEE
    console.log("Employé à créer :", { name, email, password, role: "EMPLOYEE" });
    alert("Employé créé (simulation)");

    e.target.reset();
  });
});

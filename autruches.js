document.addEventListener("DOMContentLoaded", async () => {
  const token = sessionStorage.getItem("jwt");

  if (!token) {
    alert("Vous devez être connecté pour accéder à cette page.");
    window.location.href = "login.html";
    return;
  }

  const container = document.getElementById("autruches-container");
  const ranchSelect = document.getElementById("ranch-select");
  const filtreBtn = document.getElementById("filtre-combine");
  const liste = document.getElementById("liste-autruches");

  async function chargerAutruches() {
    const res = await fetch("autruches.json");
    return await res.json();
  }


  async function fetchProvenances() {
    const response = await fetch("autruches.json");
    const autruches = await response.json();
    const provenances = [...new Set(autruches.map(a => a.provenance))];
    return provenances;
  }


  function afficherAutruches(data) {
    container.innerHTML = "";
    if (data.length === 0) {
      container.innerHTML = "<p>Aucune autruche trouvée.</p>";
      return;
    }

    data.forEach(autruche => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <h3>${autruche.nom}</h3>
        <p><strong>Âge :</strong> ${autruche.age} ans</p>
        <p><strong>Poids :</strong> ${autruche.poids} kg</p>
        <p><strong>Taille :</strong> ${autruche.taille} m</p>
        <p><strong>Provenance :</strong> ${autruche.provenance}</p>
        <p><strong>Ranch :</strong> ${autruche.ranch}</p>
        <p><strong>Anecdote :</strong> ${autruche.anecdote}</p>
        <p><strong>Genre :</strong> ${autruche.genre}</p>
      `;
      container.appendChild(div);
    });
  }

  //  FILTRE
  async function appliquerFiltreCombiné() {
    const autruches = await chargerAutruches();
    const selectedRanch = ranchSelect.value;

    const filtrées = autruches.filter(a =>
      a.age > 3 &&
      a.poids > 100 &&
      (selectedRanch === "" || a.ranch === selectedRanch)
    );

    afficherAutruches(filtrées);

   
    liste.innerHTML = "";
    filtrées.forEach(a => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${a.nom}</strong> (${a.ranch}) — ${a.age} ans, ${a.poids}kg`;
      liste.appendChild(li);
    });
  }

 
  const toutesLesAutruches = await chargerAutruches();
  afficherAutruches(toutesLesAutruches);

  // Filtre par ranch
  ranchSelect.addEventListener("change", () => {
    const selectedRanch = ranchSelect.value;
    const filtrées = selectedRanch
      ? toutesLesAutruches.filter(a => a.ranch === selectedRanch)
      : toutesLesAutruches;

    afficherAutruches(filtrées);
    liste.innerHTML = ""; // vide la liste détaillée
  });

  // Filtre combiné
  filtreBtn.addEventListener("click", appliquerFiltreCombiné);

 
  const provenances = await fetchProvenances();
  console.log("Provenances uniques :", provenances); 
});

 document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("autruches-container");
    const ranchSelect = document.getElementById("ranch-select");
    const filtreBtn = document.getElementById("filtre-combine");
    const liste = document.getElementById("liste-autruches");

    // Charger les autruches depuis le fichier JSON
    async function chargerAutruches() {
      const res = await fetch("autruches.json");
      return await res.json();
    }

    // Afficher les autruches dans des cartes
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

    // Appliquer un filtre combiné (âge > 3, poids > 100, ranch)
    async function appliquerFiltreCombiné() {
      const autruches = await chargerAutruches();
      const selectedRanch = ranchSelect.value;

      const filtrées = autruches.filter(a =>
        a.age > 3 &&
        a.poids > 100 &&
        (selectedRanch === "" || a.ranch === selectedRanch)
      );

      afficherAutruches(filtrées);

      // Met à jour la liste textuelle
      liste.innerHTML = "";
      filtrées.forEach(a => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${a.nom}</strong> (${a.ranch}) — ${a.age} ans, ${a.poids}kg`;
        liste.appendChild(li);
      });
    }

    // Initialisation : charger toutes les autruches
    const toutesLesAutruches = await chargerAutruches();
    afficherAutruches(toutesLesAutruches);

    // Filtre par ranch
    ranchSelect.addEventListener("change", () => {
      const selectedRanch = ranchSelect.value;
      const filtrées = selectedRanch
        ? toutesLesAutruches.filter(a => a.ranch === selectedRanch)
        : toutesLesAutruches;

      afficherAutruches(filtrées);
      liste.innerHTML = ""; // Vide la liste textuelle
    });

    // Bouton filtre combiné
    filtreBtn.addEventListener("click", appliquerFiltreCombiné);
  });


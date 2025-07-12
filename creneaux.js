document.addEventListener("DOMContentLoaded", () => {
  const creneauxContainer = document.getElementById("creneaux-container");

  fetch("creneaux.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des créneaux");
      }
      return response.json();
    })
    .then(data => {
      creneauxContainer.innerHTML = ""; // on vide le message "Chargement..."
      data.forEach((creneau, index) => {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `creneau-${index}`;
        checkbox.name = "creneaux";
        checkbox.value = `${creneau.jour} ${creneau.heure}`;

        const label = document.createElement("label");
        label.htmlFor = checkbox.id;
        label.textContent = `${creneau.jour} ${creneau.heure}`;
        label.style.display = "block";
        label.style.marginTop = "0.5rem";

        creneauxContainer.appendChild(checkbox);
        creneauxContainer.appendChild(label);
      });
    })
    .catch(error => {
      console.error("Erreur :", error);
      creneauxContainer.innerHTML = "Impossible de charger les créneaux.";
    });
});

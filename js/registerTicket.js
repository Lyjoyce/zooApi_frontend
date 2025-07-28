document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ticketForm");
  const visitDateInput = document.getElementById("visitDate");
  const weekdayDisplay = document.getElementById("weekdayDisplay");
  const nbEnfants = document.getElementById("nbEnfants");
  const nbAdultes = document.getElementById("nbAdultes");

  // Affichage du jour de la semaine + vérification
  visitDateInput.addEventListener("input", () => {
    const date = new Date(visitDateInput.value);
    const day = date.getDay(); // 0 = dimanche, ..., 6 = samedi

    if ([0, 3, 6].includes(day)) {
      alert("Les ateliers sont uniquement disponibles les lundi, mardi, jeudi et vendredi.");
      visitDateInput.value = "";
      weekdayDisplay.textContent = "";
      return;
    }

    const weekdays = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    weekdayDisplay.textContent = `Jour sélectionné : ${weekdays[day]}`;
    weekdayDisplay.style.color = "green";
  });

  // Vérification du ratio adulte/enfant
  function checkRatio() {
    const enfants = parseInt(nbEnfants.value, 10);
    const adultes = parseInt(nbAdultes.value, 10);

    if (adultes > 0 && enfants > 0 && enfants / adultes > 6) {
      alert("Le nombre d'adultes est insuffisant : 1 adulte pour 6 enfants maximum.");
    }
  }

  nbEnfants.addEventListener('blur', checkRatio);
  nbAdultes.addEventListener('blur', checkRatio);

  // Soumission du formulaire
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const adultType = document.getElementById("adultType").value;
    const visitDate = visitDateInput.value;
    const enfants = parseInt(nbEnfants.value, 10);
    const adultes = parseInt(nbAdultes.value, 10);

    if (!firstName || !lastName || !email || !visitDate || !adultType || !enfants || !adultes) {
      alert("Tous les champs sont requis.");
      return;
    }

    if (enfants / adultes > 6) {
      alert("Le nombre d'adultes est insuffisant : 1 adulte pour 6 enfants maximum.");
      return;
    }

    const dateObj = new Date(visitDate);
    const dayIndex = dateObj.getDay(); // 0 (dimanche) à 6 (samedi)
    const dayOfWeek = ["DIMANCHE", "LUNDI", "MARDI", "MERCREDI", "JEUDI", "VENDREDI", "SAMEDI"][dayIndex];

    const ateliers = [];
    if (document.getElementById("atelierMatin").checked) {
      ateliers.push("OMELETTE");
    }
    if (document.getElementById("atelierAprem").checked) {
      ateliers.push("NOURRIR");
    }

    if (ateliers.length === 0) {
      alert("Veuillez sélectionner au moins un atelier.");
      return;
    }

    const requestBody = {
      firstName,
      lastName,
      email,
      adultType,
      visitDate,
      dayOfWeek,
      nbEnfants: enfants,
      nbAdultes: adultes,
      ateliers
    };

    try {
      const response = await fetch("http://localhost:8081/api/v1/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Erreur lors de la réservation");
      }

      const result = await response.json();
      alert("Réservation réussie ! Numéro : " + result.ticketNumber);
      form.reset();
      weekdayDisplay.textContent = "";

    } catch (err) {
      console.error("Erreur :", err);
      alert("Une erreur est survenue, veuillez réessayer.");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ticketForm");
  const visitDateInput = document.getElementById("visitDate");
  const weekdayDisplay = document.getElementById("weekdayDisplay");

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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const visitDate = visitDateInput.value;

    if (!firstName || !lastName || !email || !visitDate) {
      alert("Tous les champs sont requis.");
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
      AdultType,
      visitDate,
      dayOfWeek,
      ateliers
    };

    try {
      const response = await fetch("https://ton-api.com/api/v1/tickets/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Réservation confirmée ! Numéro : ${result.ticketNumber}`);
        form.reset();
        weekdayDisplay.textContent = "";
      } else {
        const error = await response.text();
        alert(`Erreur lors de la réservation : ${error}`);
      }
    } catch (err) {
      alert("Erreur réseau : impossible de contacter le serveur.");
      console.error(err);
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ticketForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const requestBody = {
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      email: document.getElementById("email").value.trim(),
      type: document.getElementById("adultType").value,
      visitDate: document.getElementById("visitDate").value
    };

    try {
      const response = await fetch("http://localhost:8081/api/v1/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error("Erreur lors de la réservation");

      const result = await response.json();
      alert("Réservation réussie ! Numéro : " + result.ticketNumber);
      form.reset();

    } catch (err) {
      console.error("Erreur :", err);
      alert("Une erreur est survenue, veuillez réessayer.");
    }
  });
});


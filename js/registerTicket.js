document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ticketForm");

  // Champs
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const visitDateInput = document.getElementById("visitDate");
  const weekdayDisplay = document.getElementById("weekdayDisplay");
  const nbEnfants = document.getElementById("nbEnfants");
  const nbAdultes = document.getElementById("nbAdultes");

  // Ateliers
  const atelierMatin = document.getElementById("atelierMatin");
  const atelierAprem = document.getElementById("atelierAprem");
  const ateliersFieldset = document.getElementById("choix-ateliers");

  // Utils erreurs
  function showError(el, msg) {
    let box = el.querySelector ? el : el.parentNode;
    let err = box.querySelector(".error-message");
    if (!err) {
      err = document.createElement("small");
      err.className = "error-message";
      err.style.color = "red";
      err.style.display = "block";
      box.appendChild(err);
    }
    err.textContent = msg;
  }

  function clearError(el) {
    const box = el.querySelector ? el : el.parentNode;
    const err = box.querySelector(".error-message");
    if (err) err.remove();
  }

  // Validations champ par champ
  function validateFirstName() {
    if (!firstName.value.trim()) showError(firstName, "Le prénom est requis.");
    else clearError(firstName);
  }

  function validateLastName() {
    if (!lastName.value.trim()) showError(lastName, "Le nom est requis.");
    else clearError(lastName);
  }

  function validateEmail() {
    const v = email.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!v) showError(email, "L'email est requis.");
    else if (!re.test(v)) showError(email, "L'email n'est pas valide.");
    else clearError(email);
  }

  // Jours autorisés : Lundi(1), Mardi(2), Jeudi(4), Vendredi(5)
  const ALLOWED_DAYS = [1, 2, 4, 5];
  const WEEKDAYS = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];

  function validateVisitDate() {
    if (!visitDateInput.value) {
      showError(visitDateInput, "La date de visite est requise.");
      weekdayDisplay.textContent = "";
      return;
    }
    const d = new Date(visitDateInput.value);
    const day = d.getDay();
    weekdayDisplay.textContent = `Jour sélectionné : ${WEEKDAYS[day]}`;
    if (!ALLOWED_DAYS.includes(day)) {
      weekdayDisplay.style.color = "red";
      showError(visitDateInput, "Les ateliers sont uniquement disponibles les lundi, mardi, jeudi et vendredi.");
    } else {
      weekdayDisplay.style.color = "green";
      clearError(visitDateInput);
    }
  }

  // --- Fonction unique de validation du ratio ---
  function validateRatio() {
    const enfants = parseInt(nbEnfants.value, 10);
    const adultes = parseInt(nbAdultes.value, 10);

    if (isNaN(enfants) || enfants < 0) {
      showError(nbEnfants, "Le nombre d'enfants doit être positif.");
      return false;
    }
    if (isNaN(adultes) || adultes <= 0) {
      showError(nbAdultes, "Au moins 1 adulte est requis.");
      return false;
    }
    if (enfants > 0 && adultes > 0 && enfants / adultes > 6) {
      showError(nbEnfants, "Ratio invalide : 1 adulte pour 6 enfants max.");
      return false;
    }

    clearError(nbEnfants);
    clearError(nbAdultes);
    return true;
  }

  // Ateliers
  function getAteliers() {
    const list = [];
    if (atelierMatin && atelierMatin.checked) list.push("OMELETTE");
    if (atelierAprem && atelierAprem.checked) list.push("NOURRIR");
    return list;
  }

  function validateAteliers() {
    const list = getAteliers();
    if (list.length === 0) showError(ateliersFieldset, "Veuillez sélectionner au moins un atelier.");
    else clearError(ateliersFieldset);
  }

  // Écoutes blur + input/change (validation dynamique)
  firstName.addEventListener("blur", validateFirstName);
  lastName.addEventListener("blur", validateLastName);
  email.addEventListener("blur", validateEmail);
  visitDateInput.addEventListener("blur", validateVisitDate);
  nbEnfants.addEventListener("blur", validateRatio);
  nbAdultes.addEventListener("blur", validateRatio);

  firstName.addEventListener("input", validateFirstName);
  lastName.addEventListener("input", validateLastName);
  email.addEventListener("input", validateEmail);
  visitDateInput.addEventListener("input", validateVisitDate);
  nbEnfants.addEventListener("input", validateRatio);
  nbAdultes.addEventListener("input", validateRatio);

  if (atelierMatin) {
    atelierMatin.addEventListener("change", validateAteliers);
  }
  if (atelierAprem) {
    atelierAprem.addEventListener("change", validateAteliers);
  }

  // Soumission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validation finale
    validateFirstName();
    validateLastName();
    validateEmail();
    validateVisitDate();
    validateAteliers();

    if (!validateRatio()) {
      alert("Le nombre d'adultes est insuffisant : 1 adulte pour 6 enfants maximum.");
      return;
    }

    // Stop si erreurs visibles
    if (document.querySelectorAll(".error-message").length > 0) return;

    // Préparer la charge utile
    const ateliers = getAteliers();
    const payload = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      visitDate: visitDateInput.value, // "YYYY-MM-DD"
      nbEnfants: String(parseInt(nbEnfants.value, 10)),
      nbAdultes: String(parseInt(nbAdultes.value, 10)),
      ateliers: ateliers
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      let result;
      try { result = JSON.parse(text); } catch { /* pas JSON */ }

      if (!response.ok) {
        const msg = result?.message || text || "Erreur lors de la réservation.";
        alert("Erreur : " + msg);
        return;
      }

      // Succès
      const ticketNumber = result?.ticketNumber || "(numéro indisponible)";
      alert("Réservation réussie ! Numéro : " + ticketNumber);
      form.reset();
      weekdayDisplay.textContent = "";
      clearError(firstName);
      clearError(lastName);
      clearError(email);
      clearError(visitDateInput);
      clearError(nbAdultes);
      clearError(nbEnfants);
      clearError(ateliersFieldset);
    } catch (err) {
      console.error("Erreur :", err);
      alert("Une erreur est survenue, veuillez réessayer.");
    }
  });
});

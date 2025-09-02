document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Récupération des valeurs
        const fullName = document.getElementById("fullName").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const adultType = document.getElementById("adultType").value;

        // Validation simple
        let errors = [];

        if (!fullName) errors.push("Le nom complet est obligatoire.");
        if (!password) errors.push("Le mot de passe est obligatoire.");
        if (password !== confirmPassword) errors.push("Les mots de passe ne correspondent pas.");
        if (!adultType || (adultType !== "professeur" && adultType !== "accompagnant")) {
            errors.push("Veuillez sélectionner un type d’adulte valide.");
        }

        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }

        // Préparer les données à envoyer
        const payload = {
            fullName,
            password,
            adultType
        };

        try {
            const response = await fetch("/api/adult/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                alert("Inscription réussie !");
                form.reset();
            } else {
                const errorData = await response.json();
                alert("Erreur : " + (errorData.message || "Une erreur est survenue"));
            }
        } catch (err) {
            console.error(err);
            alert("Erreur réseau ou serveur.");
        }
    });
});

/*
document.addEventListener("DOMContentLoaded", () => { 
  const form = document.getElementById("ticketForm");

  // Champs
  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const adultType = document.getElementById("adultType");
  const visitDateInput = document.getElementById("visitDate");
  const weekdayDisplay = document.getElementById("weekdayDisplay");
  const nbEnfants = document.getElementById("nbEnfants");
  const nbAdultes = document.getElementById("nbAdultes");

  // Ateliers
  const atelierMatin = document.getElementById("atelierMatin");
  const atelierAprem = document.getElementById("atelierAprem");
  const ateliersFieldset = document.getElementById("choix-ateliers");

  // URL backend configurable
  // const isLocalDev = ["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname);
  const API_BASE_URL = "https://zooapi-autruche.onrender.com/api/v1/tickets";
  // const API_BASE_URL = isLocalDev ? "http://localhost:8080/api/v1/tickets" : "https://api.ton-domaine.com/api/v1/tickets";

  // Utils erreurs
  function showError(el, msg) {
    let box = el.tagName === "FIELDSET" ? el : el.parentNode;
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
    let box = el.tagName === "FIELDSET" ? el : el.parentNode;
    const err = box.querySelector(".error-message");
    if (err) err.remove();
  }

  // Validations champ par champ
  function validateFirstName() {
    if (!firstName.value.trim()) {
      showError(firstName, "Le prénom est requis.");
      return false;
    }
    clearError(firstName);
    return true;
  }

  function validateLastName() {
    if (!lastName.value.trim()) {
      showError(lastName, "Le nom est requis.");
      return false;
    }
    clearError(lastName);
    return true;
  }

  function validateEmail() {
    const v = email.value.trim();
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!v) {
      showError(email, "L'email est requis.");
      return false;
    }
    if (!re.test(v)) {
      showError(email, "L'email n'est pas valide.");
      return false;
    }
    clearError(email);
    return true;
  }

  function validateAdultType() { // NOUVEAU
    if (!adultType.value) {
      showError(adultType, "Veuillez sélectionner un type d'adulte.");
      return false;
    }
    clearError(adultType);
    return true;
  }

  const ALLOWED_DAYS = [1, 2, 4, 5];
  const WEEKDAYS = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];

  function validateVisitDate() {
    if (!visitDateInput.value) {
      showError(visitDateInput, "La date de visite est requise.");
      weekdayDisplay.textContent = "";
      weekdayDisplay.style.color = "black";
      return false;
    }
    const d = new Date(visitDateInput.value);
    const day = d.getDay();
    weekdayDisplay.textContent = `Jour sélectionné : ${WEEKDAYS[day]}`;
    if (!ALLOWED_DAYS.includes(day)) {
      weekdayDisplay.style.color = "red";
      showError(visitDateInput, "Les ateliers sont uniquement disponibles les lundi, mardi, jeudi et vendredi.");
      return false;
    }
    weekdayDisplay.style.color = "green";
    clearError(visitDateInput);
    return true;
  }

  function validateRatio() {
    const enfants = Number(nbEnfants.value);
    const adultes = Number(nbAdultes.value);

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

  function getAteliers() {
    const list = [];
    if (atelierMatin && atelierMatin.checked) list.push("OMELETTE");
    if (atelierAprem && atelierAprem.checked) list.push("NOURRIR");
    return list;
  }

  function validateAteliers() {
    const list = getAteliers();
    if (list.length === 0) {
      showError(ateliersFieldset, "Veuillez sélectionner au moins un atelier.");
      return false;
    }
    clearError(ateliersFieldset);
    return true;
  }

  // Listeners
  firstName.addEventListener("blur", validateFirstName);
  lastName.addEventListener("blur", validateLastName);
  email.addEventListener("blur", validateEmail);
  adultType.addEventListener("blur", validateAdultType);
  visitDateInput.addEventListener("blur", validateVisitDate);
  nbEnfants.addEventListener("blur", validateRatio);
  nbAdultes.addEventListener("blur", validateRatio);
  firstName.addEventListener("input", validateFirstName);
  lastName.addEventListener("input", validateLastName);
  email.addEventListener("input", validateEmail);
  adultType.addEventListener("input", validateAdultType);
  visitDateInput.addEventListener("input", validateVisitDate);
  nbEnfants.addEventListener("input", validateRatio);
  nbAdultes.addEventListener("input", validateRatio);
  if (atelierMatin) atelierMatin.addEventListener("change", validateAteliers);
  if (atelierAprem) atelierAprem.addEventListener("change", validateAteliers);

  // Soumission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isValid =
      validateFirstName() &
      validateLastName() &
      validateEmail() &
      validateAdultType()&
      validateVisitDate() &
      validateRatio() &
      validateAteliers();

    if (!isValid) {
      alert("Veuillez corriger les erreurs avant de soumettre.");
      return;
    }

    const payload = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      adultType: adultType.value,
      visitDate: visitDateInput.value,
      nbEnfants: Number(nbEnfants.value),
      nbAdultes: Number(nbAdultes.value),
      ateliers: getAteliers() // tableau de chaînes
    };

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      let result;
      try { result = JSON.parse(text); } catch {}

      if (!response.ok) {
        const msg = result?.message || text || "Erreur lors de la réservation.";
        alert("Erreur : " + msg);
        return;
      }

      const ticketNumber = result?.ticketNumber || "(numéro indisponible)";
      alert("Réservation réussie ! Numéro : " + ticketNumber);
      form.reset();
      weekdayDisplay.textContent = "";
      weekdayDisplay.style.color = "black";
      clearError(firstName);
      clearError(lastName);
      clearError(email);
      clearError(adultType);
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
*/
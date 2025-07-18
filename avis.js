document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("avis-form");
  const token = sessionStorage.getItem("token");

  // 🔒 Vérifie que l'utilisateur est connecté
  if (!token) {
    alert("Vous devez être connecté pour laisser un avis.");
    form.querySelector('button[type="submit"]').disabled = true;
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 📝 Récupération des valeurs du formulaire
    const message = document.getElementById("message").value.trim();
    const note = parseInt(document.getElementById("note").value);

    if (!message || isNaN(note)) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const avisPayload = {
      message: message,
      note: note
    };

    try {
      const response = await fetch("https://ton-backend/api/v1/avis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(avisPayload)
      });

      if (response.ok) {
        alert("Merci pour votre avis ! Il sera publié après validation.");
        form.reset();
      } else if (response.status === 401) {
        alert("Session expirée. Veuillez vous reconnecter.");
        sessionStorage.removeItem("token");
        window.location.href = "login.html";
      } else {
        const errorData = await response.json();
        alert("Erreur : " + (errorData.message || "Impossible d’envoyer l’avis."));
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
      alert("Erreur de connexion. Veuillez réessayer plus tard.");
    }
  });
});

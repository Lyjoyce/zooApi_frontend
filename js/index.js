function toggleTable() {
  const table = document.getElementById("ranch-table");
  if (table.style.display === "none" || table.style.display === "") {
    table.style.display = "block";
  } else {
    table.style.display = "none";
  }
}

// --- Gestion formulaire d'avis (seulement si le formulaire existe) ---
const form = document.querySelector('form');

if (form) {
  const token = sessionStorage.getItem("token");

  if (!token) {
    alert("Vous devez être connecté pour laisser un avis.");
    form.querySelector('button[type="submit"]').disabled = true;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const comment = document.getElementById('message')?.value.trim();
    const rating = parseInt(document.getElementById('note')?.value);

    if (!comment || isNaN(rating)) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      const response = await fetch('https://api/v1/avis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: comment, note: rating })
      });

      if (response.ok) {
        alert("Merci pour votre avis !");
        form.reset();
      } else if (response.status === 401) {
        alert("Votre session a expiré. Veuillez vous reconnecter.");
        sessionStorage.removeItem("token");
        window.location.href = "login.html";
      } else {
        const error = await response.json();
        alert("Erreur : " + (error.message || "Impossible d’envoyer l’avis."));
      }
    } catch (err) {
      console.error(err);
      alert("Erreur de connexion au serveur.");
    }
  });
}

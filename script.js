function toggleTable() {
      const table = document.getElementById("ranch-table");
      if (table.style.display === "none" || table.style.display === "") {
        table.style.display = "block";
      } else {
        table.style.display = "none";
      }
    }
    // Vérifie si l'utilisateur est connecté (via token JWT)
    const token = sessionStorage.getItem("token"); // suppose que le token est stocké au login

    if (!token) {
      alert("Vous devez être connecté pour laisser un avis.");
      form.querySelector('button[type="submit"]').disabled = true;
      return;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const comment = document.getElementById('message').value.trim();
      const rating = parseInt(document.getElementById('note').value);

      if (!comment || isNaN(rating)) {
        alert("Veuillez remplir tous les champs.");
        return;
      }

      try {
        const response = await fetch('https://ton-backend/api/avis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ message, note })
        });

        if (response.ok) {
          alert("Merci pour votre avis !");
          form.reset();
        } else if (response.status === 401) {
          alert("Votre session a expiré. Veuillez vous reconnecter.");
          sessionStorage.removeItem("token");
          window.location.href = "login.html"; // rediriger vers page de connexion
        } else {
          const error = await response.json();
          alert("Erreur : " + (error.message || "Impossible d’envoyer l’avis."));
        }
      } catch (err) {
        console.error(err);
        alert("Erreur de connexion au serveur.");
      }
    });


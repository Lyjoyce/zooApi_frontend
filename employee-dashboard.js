  /*  document.addEventListener("DOMContentLoaded", () => {
  const firstName = sessionStorage.getItem("employeeFirstName");
  const lastName = sessionStorage.getItem("employeeLastName");

  if (firstName && lastName) {
    document.getElementById("employee-name").textContent =
      `👋 Bonjour ${firstName} ${lastName}`;
  }
});

    
    document.addEventListener("DOMContentLoaded", () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        alert("Veuillez vous connecter comme employé.");
        window.location.href = "login.html";
        return;
      }

      fetch("/api/v1/avis", {
        headers: {
          "Authorization": "Bearer " + token
        }
      })
      .then(res => res.json())
      .then(data => {
        const table = document.getElementById("avisTableBody");
        table.innerHTML = "";

        const avisNonValides = data.filter(avis => !avis.validated);

        avisNonValides.forEach(avis => {
          const row = document.createElement("tr");

          row.innerHTML = `
            <td>${avis.firstName}</td>
            <td>${new Date(avis.date).toLocaleString()}</td>
            <td>${avis.note}</td>
            <td>${avis.message || "(Pas de message)"}</td>
            <td>
              <button onclick="validerAvis('${avis.id}', this)">Valider</button>
            </td>
          `;

          table.appendChild(row);
        });
      })
      .catch(err => {
        console.error(err);
        alert("Erreur lors du chargement des avis.");
      });
    });

    function validerAvis(id, button) {
      const token = sessionStorage.getItem("token");
      button.disabled = true;
      button.textContent = "Validation...";

      fetch(`/api/v1/employees/valider-avis/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + token
        }
      })
      .then(res => {
        if (!res.ok) throw new Error("Erreur validation");
        return res.json();
      })
      .then(() => {
        alert("✅ Avis validé !");
        location.reload();
      })
      .catch(err => {
        console.error(err);
        alert("❌ Une erreur est survenue.");
        button.disabled = false;
        button.textContent = "Valider";
      });
    }
      */
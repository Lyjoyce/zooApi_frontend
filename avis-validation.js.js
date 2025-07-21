document.addEventListener("DOMContentLoaded", async () => {
  // Récupération des infos de session
  const firstName = sessionStorage.getItem("employeeFirstName");
  const lastName = sessionStorage.getItem("employeeLastName");
  const token = sessionStorage.getItem("token");

  if (!token) {
    alert("🔒 Veuillez vous connecter comme employé.");
    window.location.href = "login.html";
    return;
  }

  if (firstName && lastName) {
    document.getElementById("employee-name").textContent = `👋 Bonjour ${firstName} ${lastName}`;
  }

  await chargerAvis();
});

const headers = {
  "Authorization": "Bearer " + sessionStorage.getItem("token"),
  "Content-Type": "application/json"
};

async function chargerAvis() {
  try {
    const response = await fetch('/api/v1/avis/non-valides', { headers });
    if (!response.ok) throw new Error("Erreur d’accès aux avis");

    const avis = await response.json();
    const tbody = document.getElementById('avisTableBody');
    tbody.innerHTML = '';

    avis.forEach(a => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${escapeHtml(a.firstName)}</td>
        <td>${new Date(a.date).toLocaleString()}</td>
        <td>${a.note}</td>
        <td>${escapeHtml(a.message || '(Pas de message)')}</td>
        <td><button onclick="validerAvis('${a.id}', this)">Valider</button></td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error(err);
    alert("❌ Erreur lors du chargement des avis.");
  }
}

async function validerAvis(id, button) {
  button.disabled = true;
  button.textContent = "Validation...";

  try {
    const response = await fetch(`/api/v1/employees/${id}/validate`, {
      method: 'PUT',
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur de validation: ${errorText}`);
    }

    alert("✅ Avis validé !");
    await chargerAvis(); // recharge la liste sans rafraîchir la page
  } catch (err) {
    console.error(err);
    alert("❌ Une erreur est survenue : " + err.message);
    button.disabled = false;
    button.textContent = "Valider";
  }
}

// Fonction simple pour échapper le texte et éviter les injections XSS
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


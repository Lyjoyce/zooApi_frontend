// Centralisation du token
const jwtToken = sessionStorage.getItem("token");
if (!jwtToken) {
  alert("🔒 Veuillez vous connecter comme employé.");
  window.location.href = "employee-login.html";
}

// Headers centralisés
const headers = {
  "Authorization": "Bearer " + jwtToken,
  "Content-Type": "application/json"
};

// Affichage du nom de l'employé
document.addEventListener("DOMContentLoaded", () => {
  const firstName = sessionStorage.getItem("employeeFirstName");
  const lastName = sessionStorage.getItem("employeeLastName");
  if (firstName && lastName) {
    document.getElementById("employee-name").textContent = `👋 Bonjour ${firstName} ${lastName}`;
  }

  // Chargement initial des avis
  chargerAvis();
});

// --- FETCH ---
// Récupère les avis non validés depuis l'API
async function getAvis() {
  const response = await fetch('/api/v1/avis/non-valides', { headers });
  if (!response.ok) throw new Error("Erreur d’accès aux avis");
  return await response.json();
}

// Valide un avis par son ID
async function validerAvisApi(id) {
  const response = await fetch(`/api/v1/employees/${id}/validate`, {
    method: 'PUT',
    headers
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur de validation: ${errorText}`);
  }
}

// --- AFFICHAGE ---
// Affiche les avis dans le tableau
function afficherAvis(avis) {
  const tbody = document.getElementById('avisTableBody');
  tbody.innerHTML = '';

  avis.forEach(a => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHtml(a.firstName)}</td>
      <td>${new Date(a.date).toLocaleString()}</td>
      <td>${a.note}</td>
      <td>${escapeHtml(a.message || '(Pas de message)')}</td>
      <td><button class="validate-btn" data-id="${a.id}">Valider</button></td>
    `;
    tbody.appendChild(row);
  });

  // Ajout des listeners pour valider les avis
  document.querySelectorAll(".validate-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      btn.disabled = true;
      btn.textContent = "Validation...";

      try {
        await validerAvisApi(id);
        alert("✅ Avis validé !");
        await chargerAvis();
      } catch (err) {
        console.error(err);
        alert("❌ Une erreur est survenue : " + err.message);
        btn.disabled = false;
        btn.textContent = "Valider";
      }
    });
  });
}

// --- ORCHESTRATION ---
// Charge et affiche les avis
async function chargerAvis() {
  try {
    const avis = await getAvis();
    afficherAvis(avis);
  } catch (err) {
    console.error(err);
    alert("❌ Erreur lors du chargement des avis.");
  }
}

// --- UTILS ---
// Fonction simple pour échapper le texte et éviter les injections XSS
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

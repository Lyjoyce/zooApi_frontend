function logout() {
  // Supprime uniquement le token (ou tout si besoin)
  sessionStorage.removeItem("jwt");
  // Si tu veux vraiment vider toute la session :
  // sessionStorage.clear();

  // Redirige vers la page de connexion
  window.location.href = "/login.html";
}

// Attache l'événement au bouton déconnexion
document.getElementById("logout-button").addEventListener("click", logout);

document.getElementById("logout-button").addEventListener("click", () => {
    // Supprimer le token du stockage
    sessionStorage.removeItem("jwt");

    // (Facultatif) Supprimer d'autres infos éventuelles
    sessionStorage.clear();

    // Redirection vers la page de connexion
    window.location.href = "/login.html";
  });

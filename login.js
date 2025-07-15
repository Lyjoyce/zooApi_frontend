
  
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  const errorMsg = document.getElementById("error-message");
  errorMsg.textContent = "";

  try {
    const response = await fetch("https://localhost:8081/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Email ou mot de passe incorrect.");
      } else {
        throw new Error("Erreur serveur. Réessayez plus tard.");
      }
    }

    const data = await response.json();
    const token = data.token;

    // Stockage sécurisé du token dans sessionStorage (non persistant)
    sessionStorage.setItem("jwt", token);

    // Redirection vers l’espace utilisateur (modifie si besoin)
    window.location.href = "/autruches.html";
  } catch (error) {
    errorMsg.textContent = error.message;
  }
});

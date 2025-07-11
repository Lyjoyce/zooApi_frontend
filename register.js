document.getElementById("register-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const type = document.getElementById("type").value;

  const errorMsg = document.getElementById("error-message");
  errorMsg.textContent = "";

  const requestBody = {
    firstName,
    lastName,
    email,
    phone,
    password,
    type // Envoie le type choisi (ex: "PROFESSEUR")
  };

  try {
    const response = await fetch("http://localhost:8081/api/v1/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de l’inscription.");
    }

    const data = await response.json();
    const token = data.token;

    sessionStorage.setItem("jwt", token);

    // Redirection après succès
    window.location.href = "/dashboard.html";
  } catch (error) {
    errorMsg.textContent = error.message;
  }
});

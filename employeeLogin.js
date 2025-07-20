document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:8081/api/v1/employees/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) throw new Error("Échec de connexion");

    const data = await response.json();

    // Stockage en sessionStorage
    sessionStorage.setItem("employeeEmail", data.email);
    sessionStorage.setItem("employeeRole", data.role);
    sessionStorage.setItem("employeeFirstName", data.firstName);
    sessionStorage.setItem("employeeLastName", data.lastName);

    // Redirection vers tableau de bord
    window.location.href = "/employee-dashboard.html";

  } catch (error) {
    alert("❌ " + error.message);
  }
});

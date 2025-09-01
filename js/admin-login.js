const form = document.getElementById('adminLoginForm');
    const message = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = form.email.value;
      const password = form.password.value;

      try {
        const response = await fetch('http://localhost:8080/api/v1/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) throw new Error("Identifiants invalides.");

        const data = await response.json();
        localStorage.setItem("adminToken", data.token);
        message.style.color = "#005349";
        message.textContent = "Connexion réussie. Redirection...";
        setTimeout(() => window.location.href = "admin-dashboard.html", 1000);
      } catch (err) {
        message.style.color = "#F66C64";
        message.textContent = err.message;
      }
    });

    /*
    const form = document.getElementById('adminLoginForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = form.email.value;
  const password = form.password.value;

  try {
    const response = await fetch('https://zooapi-autruche.onrender.com/api/v1/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) throw new Error("Identifiants invalides.");

    const data = await response.json();
    localStorage.setItem("adminToken", data.token);
    message.style.color = "#005349";
    message.textContent = "Connexion réussie. Redirection...";
    setTimeout(() => window.location.href = "admin-dashboard.html", 1000);
  } catch (err) {
    message.style.color = "#F66C64";
    message.textContent = err.message;
  }
});

    */
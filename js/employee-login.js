document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('employeeLoginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  if (!form || !emailInput || !passwordInput) {
    console.error("Un ou plusieurs éléments du formulaire n'ont pas été trouvés !");
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/employees/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      let data;
      const contentType = response.headers.get('Content-Type');

      // Parsing sécurisé
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Réponse inattendue du serveur: ${text || 'vide'}`);
      }

      // Gestion des erreurs HTTP
      if (!response.ok) {
        alert(data.message || "Échec de la connexion. Vérifiez vos identifiants.");
        return;
      }

      // Vérification de la structure des données
      if (!data.role || !data.firstName || !data.lastName) {
        alert("Réponse du serveur inattendue.");
        console.error("Données serveur :", data);
        return;
      }

      alert(`Bienvenue ${data.firstName} ${data.lastName} (${data.role})`);

      // Redirection selon le rôle
      switch (data.role.toUpperCase()) {
        case 'EMPLOYEE':
          window.location.href = 'zooApi_frontend/employee-dashboard.html';
          break;
        case 'VETERINAIRE':
          window.location.href = 'zooApi_frontend/veterinaire-dashboard.html';
          break;
        default:
          window.location.href = 'dashboard.html';
          break;
      }

    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Erreur lors de la tentative de connexion. Vérifiez votre connexion ou le serveur.");
    }
  });
});

/*
// Vérifie que le formulaire et les inputs existent
const form = document.getElementById('employeeLoginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

if (!form || !emailInput || !passwordInput) {
  console.error("Un ou plusieurs éléments du formulaire n'ont pas été trouvés !");
} else {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    const BASE_URL = 'https://zooapi-autruche.onrender.com';

    try {
      const response = await fetch(`${BASE_URL}/api/v1/employees/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // GitHub Pages est un site statique, il faut que le serveur autorise CORS depuis ton domaine
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || "Échec de la connexion. Vérifiez vos identifiants.");
        return;
      }

      const data = await response.json();

      if (!data.role || !data.firstName || !data.lastName) {
        alert("Réponse du serveur inattendue.");
        console.error("Données serveur :", data);
        return;
      }

      alert(`Bienvenue ${data.firstName} ${data.lastName} (${data.role})`);

      // Redirection conditionnelle selon le rôle
      switch (data.role.toUpperCase()) {
        case 'EMPLOYEE':
          window.location.href = '/zooApi_frontend/dashboard-employee.html';
          break;
        case 'VETERINAIRE':
          window.location.href = '/zooApi_frontend/dashboard-veterinaire.html';
          break;
        default:
          window.location.href = '/zooApi_frontend/dashboard.html';
      }

    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Erreur lors de la tentative de connexion. Vérifiez votre connexion ou le serveur.");
    }
  });
}
*/
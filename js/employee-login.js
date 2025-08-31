
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

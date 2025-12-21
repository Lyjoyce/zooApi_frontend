
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
      const response = await fetch("https://zooapi-autruche.onrender.com/api/v1/employees/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    email: email,
    password: password
  })
})


    /*try {
      const response = await fetch('http://localhost:8080/api/v1/employees/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
*/
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

      // Redirection selon le rôle (gestion multiple rôles et espaces)
      const role = data.role.toUpperCase().trim();
      console.log("Rôle reçu :", role);

      if (role.includes('ROLE_EMPLOYEE')) {
        window.location.href = 'https://lyjoyce.github.io/zooApi_frontend/employee-dashboard.html';
      } else if (role.includes('ROLE_VETERINAIRE')) {
        window.location.href = 'https://lyjoyce.github.io/zooApi_frontend/veterinaire-dashboard.html';
      } else {
        window.location.href = 'https://lyjoyce.github.io/zooApi_frontend/dashboard.html';
      }

    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      alert("Erreur lors de la tentative de connexion. Vérifiez votre connexion ou le serveur.");
    }
  });
 });
   


/*
const form = document.getElementById('employeeLoginForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value;

  // Validation des champs
  if (!email || !password) {
    message.style.color = "#F66C64";
    message.textContent = "Veuillez remplir tous les champs !";
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/v1/employees/login", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    // Gestion des erreurs serveur
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Échec de la connexion. Vérifiez vos identifiants.");
    }

    const data = await response.json();

    // Stockage du token dans sessionStorage pour plus de sécurité
    sessionStorage.setItem("employeeToken", data.token);

    // Affichage du message de bienvenue
    message.style.color = "#005349";
    message.textContent = `Bienvenue ${data.firstName} ${data.lastName}. Redirection...`;

    // Redirection après 1 seconde selon le rôle (multi-rôles gérés)
    setTimeout(() => {
      const role = data.role.toUpperCase();

      if (role.includes("EMPLOYEE")) {
        window.location.href = 'https://lyjoyce.github.io/zooApi_frontend/employee-dashboard.html';
      } else if (role.includes("VETERINAIRE")) {
        window.location.href = 'https://lyjoyce.github.io/zooApi_frontend/veterinaire-dashboard.html';
      } else {
        // Cas par défaut
        message.style.color = "#F66C64";
        message.textContent = "Rôle inconnu. Contactez l'administrateur.";
      }
    }, 1000);

  } catch (err) {
    message.style.color = "#F66C64";
    message.textContent = err.message;
  }
});
*/

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
/*const form = document.getElementById('employeeLoginForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = form.email.value.trim();
  const password = form.password.value;

  if (!email || !password) {
    message.style.color = "#F66C64";
    message.textContent = "Veuillez remplir tous les champs !";
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/api/v1/employees/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || "Échec de la connexion. Vérifiez vos identifiants.");
    }

    const data = await response.json();
    localStorage.setItem("employeeToken", data.token);

    message.style.color = "#005349";
    message.textContent = `Bienvenue ${data.firstName} ${data.lastName}. Redirection...`;

    setTimeout(() => {
      switch (data.role.toUpperCase()) {
        case 'EMPLOYEE':
          window.location.href = 'https://lyjoyce.github.io/zooApi_frontend/employee-dashboard.html';
          break;
        case 'VETERINAIRE':
          window.location.href = 'https://lyjoyce.github.io/zooApi_frontend/veterinaire-dashboard.html';
          break;
      }
    }, 1000);

  } catch (err) {
    message.style.color = "#F66C64";
    message.textContent = err.message;
  }
});
*/
/*
const form = document.getElementById('employeeLoginForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const password = form.password.value;

  if (!email || !password) {
    message.style.color = "#F66C64";
    message.textContent = "Veuillez remplir tous les champs !";
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/v1/employees/login", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) throw new Error("Identifiants invalides.");

    const data = await response.json();
    localStorage.setItem("employeeToken", data.token); // si tu as un token
    message.style.color = "#005349";
    message.textContent = `Connexion réussie. Bienvenue ${data.firstName} ${data.lastName}. Redirection...`;

    setTimeout(() => {
      window.location.href = "https://lyjoyce.github.io/zooApi_frontend/employee-dashboard.html";
    }, 1000);

  } catch (err) {
    message.style.color = "#F66C64";
    message.textContent = err.message;
  }
});
*/
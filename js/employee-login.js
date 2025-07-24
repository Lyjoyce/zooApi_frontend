 document.getElementById('employeeLoginForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('/api/v1/employees/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          alert("Échec de la connexion. Vérifiez vos identifiants.");
          return;
        }

        const data = await response.json();
        alert(`Bienvenue ${data.firstName} ${data.lastName} (${data.role})`);

        // Exemple de redirection après succès
        window.location.href = '/dashboard-employee.html';

      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        alert("Erreur lors de la tentative de connexion.");
      }
    });
document.getElementById("register-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("password").value;
  const type = document.getElementById("type").value;

  const errorMsg = document.getElementById("error-message");
  const successMsg = document.getElementById("success-message");
  errorMsg.textContent = "";
  successMsg.textContent = "";

  // Vérifie si un utilisateur avec ce mail existe déjà
  const waitingList = JSON.parse(localStorage.getItem("waitingList")) || [];
  const exists = waitingList.find((user) => user.email === email);
  
  if (exists) {
    errorMsg.textContent = "Cet email est déjà sur la liste d'attente.";
    return;
  }

  const newUser = {
    firstName,
    lastName,
    email,
    phone,
    password, // En production : ne jamais stocker en clair !
    type,
    dateInscription: new Date().toISOString()
  };

  waitingList.push(newUser);
  localStorage.setItem("waitingList", JSON.stringify(waitingList));

  successMsg.textContent = "Inscription réussie ! Vous êtes sur la liste d'attente.";
  document.getElementById("register-form").reset();
});

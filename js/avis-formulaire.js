const verifForm = document.getElementById('verif-form');
const avisForm = document.getElementById('avis-form');
const statusDiv = document.getElementById('avis-status');

let currentTicketId = null;

verifForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const ticketNumber = document.getElementById('ticketNumber').value.trim();
  const firstName = document.getElementById('firstName').value.trim();
  const visitDate = document.getElementById('visitDate').value;

  const response = await fetch('/api/v1/avis/verification', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticketNumber, firstName, visitDate })
  });

  if (response.ok) {
    const data = await response.json();
    currentTicketId = data.ticketId; // Pour associer l’avis au bon ticket
    avisForm.style.display = 'block';
    verifForm.style.display = 'none';
    statusDiv.textContent = "🎉 Vérification réussie ! Vous pouvez maintenant laisser votre avis.";
  } else {
    const err = await response.text();
    statusDiv.style.color = "red";
    statusDiv.textContent = `❌ Vérification échouée : ${err}`;
  }
});

avisForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const note = document.getElementById('note').value;
  const message = document.getElementById('message').value.trim();

  const response = await fetch('/api/v1/avis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ticketId: currentTicketId,
      note,
      message
    })
  });

  if (response.ok) {
    statusDiv.style.color = "green";
    statusDiv.textContent = "✅ Merci pour votre avis ! Il sera publié après validation.";
    avisForm.reset();
    avisForm.style.display = 'none';
  } else {
    const err = await response.text();
    statusDiv.style.color = "red";
    statusDiv.textContent = `❌ Erreur lors de l’envoi : ${err}`;
  }
});

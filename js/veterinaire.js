// ======================================================
// 🔹 RÈGLES MÉTIER (alignées avec EggService backend)
// ======================================================

// 👉 Validation d’un œuf (doit avoir ≤ 10 jours)
function validateEgg(id) {
  const egg = eggsData.find(e => e.id === id);
  if (egg) {
    const dateLaid = new Date(egg.dateLaid);
    const diffDays = Math.floor((Date.now() - dateLaid.getTime()) / (1000*60*60*24));

    if (diffDays > 10) {
      alert(`❌ Œuf ${id} a plus de 10 jours, il ne peut pas être validé.`);
      return;
    }

    egg.validatedByVet = true;
    egg.validationDate = new Date().toISOString().split('T')[0];
    alert(`✔️ Œuf ${id} validé (pondu il y a ${diffDays} jours).`);
    renderEggsTable();
  }
}

// 👉 Réservation FIFO (par date de ponte croissante)
function reserveEggs(quantity) {
  const availableEggs = eggsData
    .filter(e => e.active && !e.allocated)
    .sort((a, b) => new Date(a.dateLaid) - new Date(b.dateLaid));

  if (availableEggs.length < quantity) {
    alert("Pas assez d'œufs disponibles.");
    return;
  }

  const eggsToReserve = availableEggs.slice(0, quantity);
  eggsToReserve.forEach(egg => egg.allocated = true);

  alert(`✔️ ${quantity} œuf(s) attribué(s) à un atelier (FIFO).`);
  renderEggsTable();
}

// 👉 Libération d’œufs (annulation réservation)
function releaseEgg(id) {
  const egg = eggsData.find(e => e.id === id);
  if (egg) {
    egg.allocated = false;
    alert(`🔄 Œuf ${id} libéré.`);
    renderEggsTable();
  }
}

// 👉 Conservation (30 ou 60 jours)
function conserveEgg(id, days) {
  const egg = eggsData.find(e => e.id === id);
  if (egg && egg.validatedByVet) {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    egg.conservationEndDate = endDate.toISOString().split('T')[0];
    alert(`🥚 Œuf ${id} mis en conservation jusqu’au ${egg.conservationEndDate}.`);
    renderEggsTable();
  } else {
    alert("❌ L'œuf doit être validé avant conservation !");
  }
}

// 👉 Attribution d’un œuf à un atelier
function assignEggToAtelier(eggId, atelierName) {
  const egg = eggsData.find(e => e.id === eggId);
  if (!egg) {
    alert(`Œuf ${eggId} introuvable !`);
    return;
  }
  if (!egg.validatedByVet) {
    alert(`❌ Œuf ${eggId} doit être validé avant attribution.`);
    return;
  }
  if (!egg.allocated) {
    alert(`❌ Œuf ${eggId} doit être réservé avant attribution.`);
    return;
  }

  egg.atelier = atelierName;
  alert(`✔️ Œuf ${eggId} attribué à l’atelier "${atelierName}".`);
  renderEggsTable();
}

// 👉 Désactivation d’un œuf (soft delete)
function deactivateEgg(id) {
  const egg = eggsData.find(e => e.id === id);
  if (egg) {
    egg.active = false;
    alert(`🚫 Œuf ${id} désactivé (soft delete).`);
    renderEggsTable();
  }
}

// ======================================================
// 🔹 GESTION DES DONNÉES
// ======================================================

let eggsData = [];

async function loadEggs() {
  try {
    const response = await fetch('/json/eggs.json');
    eggsData = await response.json();
    renderEggsTable();
    renderEggsChart();
  } catch (err) {
    console.error('Erreur chargement œufs :', err);
  }
}
// =========================================================
// Rendu du tableau des œufs + Légende visuelle
// =========================================================
function renderEggsTable() {
  const tbody = document.getElementById('eggsTableBody');
  tbody.innerHTML = '';

  eggsData.forEach((egg, index) => {
    if (!egg.id) egg.id = index + 1;

    if (egg.active) {
      const dateLaid = new Date(egg.dateLaid);
      const expiryDate = new Date(dateLaid);
      expiryDate.setDate(dateLaid.getDate() + 60);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${egg.id}</td>
        <td>${dateLaid.toLocaleDateString()}</td>
        <td>${expiryDate.toLocaleDateString()}</td>
        <td>${egg.femaleId}</td>
        <td>${egg.atelier || '-'}</td>
        <td>${egg.validatedByVet ? "Oui" : "Non"}</td>
        <td class="actions"></td>
      `;

      const actionsCell = tr.querySelector('.actions');

      // Bouton Valider
      const validateBtn = document.createElement("button");
      validateBtn.textContent = "Valider";
      validateBtn.className = "validate";
      validateBtn.onclick = () => validateEgg(egg.id);
      actionsCell.appendChild(validateBtn);

      // Bouton Réserver
      const reserveBtn = document.createElement("button");
      reserveBtn.textContent = "Réserver";
      reserveBtn.className = "allocate";
      reserveBtn.onclick = () => reserveEggs(1);
      actionsCell.appendChild(reserveBtn);

      // Bouton Libérer
      const releaseBtn = document.createElement("button");
      releaseBtn.textContent = "Libérer";
      releaseBtn.className = "reactivate";
      releaseBtn.onclick = () => releaseEgg(egg.id);
      actionsCell.appendChild(releaseBtn);

      // Bouton Conserver 30j
      const conserve30Btn = document.createElement("button");
      conserve30Btn.textContent = "Conserver 30j";
      conserve30Btn.className = "validate";
      conserve30Btn.onclick = () => conserveEgg(egg.id, 30);
      actionsCell.appendChild(conserve30Btn);

      // Bouton Conserver 60j
      const conserve60Btn = document.createElement("button");
      conserve60Btn.textContent = "Conserver 60j";
      conserve60Btn.className = "validate";
      conserve60Btn.onclick = () => conserveEgg(egg.id, 60);
      actionsCell.appendChild(conserve60Btn);

      // Bouton Désactiver
      const deactivateBtn = document.createElement("button");
      deactivateBtn.textContent = "Désactiver";
      deactivateBtn.className = "deactivate";
      deactivateBtn.onclick = () => deactivateEgg(egg.id);
      actionsCell.appendChild(deactivateBtn);

      tbody.appendChild(tr);
    }
  });

  renderLegend();
}

// =========================================================
// Légende visuelle des boutons
// =========================================================
function renderLegend() {
  const legendContainer = document.getElementById('legend-container');
  if (!legendContainer) return;

  legendContainer.innerHTML = `
    <h3>Légende actions</h3>
    <div class="legend-grid">
      <button class="validate">Valider</button> : Validation vétérinaire<br>
      <button class="allocate">Réserver</button> : Réservation FIFO<br>
      <button class="reactivate">Libérer</button> : Libération d’un œuf<br>
      <button class="validate">Conserver 30/60j</button> : Mise en conservation<br>
      <button class="deactivate">Désactiver</button> : Retrait (soft delete)<br>
    </div>
  `;
}

// ======================================================
// 🔹 FORMULAIRE : ENREGISTREMENT NOUVEL ŒUF
// ======================================================

document.getElementById('eggForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const ostrichId = parseInt(document.getElementById('ostrichId').value);
  const dateLaid = document.getElementById('dateLaid').value;

  const newEgg = {
    id: eggsData.length + 1,
    femaleId: ostrichId,
    dateLaid: dateLaid,
    active: true,
    allocated: false,
    validatedByVet: false,
    atelier: "",
    conservationEndDate: null,
    validationDate: null
  };

  eggsData.push(newEgg);
  alert(`✔️ Œuf enregistré avec succès (ID: ${newEgg.id}) !`);
  document.getElementById('eggForm').reset();
  renderEggsTable();
  renderEggsChart();
});

// ======================================================
// 🔹 FORMULAIRE : ASSOCIATION ATELIER
// ======================================================

document.getElementById('assignForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const eggId = parseInt(document.getElementById('eggIdAssign').value);
  const atelier = document.getElementById('atelierName').value.trim();
  assignEggToAtelier(eggId, atelier);
  document.getElementById('assignForm').reset();
});

// ======================================================
// 🔹 GRAPHIQUE DE PONTE
// ======================================================

function renderEggsChart() {
  const countsByDate = {};
  eggsData.forEach(egg => {
    const date = egg.dateLaid;
    countsByDate[date] = (countsByDate[date] || 0) + 1;
  });

  const labels = Object.keys(countsByDate).sort();
  const values = labels.map(date => countsByDate[date]);

  const ctx = document.getElementById('eggsChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: "Œufs pondus",
        data: values,
        backgroundColor: '#F88379'
      }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });
}

// ======================================================
// 🔹 LOGOUT
// ======================================================

document.getElementById('logout-button').addEventListener('click', () => {
  localStorage.clear();
  window.location.href = '/index.html';
});

// ======================================================
// 🔹 INITIALISATION
// ======================================================

loadEggs();

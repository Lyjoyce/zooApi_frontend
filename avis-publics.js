const avisList = document.getElementById('avisList');
const atelierFilter = document.getElementById('atelierFilter');
const noteFilter = document.getElementById('noteFilter');
const filterButton = document.getElementById('filterButton');

let allAvis = [];

async function fetchAvis() {
  const response = await fetch('/api/v1/avis'); // Liste des avis validés
  allAvis = await response.json();
  displayAvis(allAvis);
}

function displayAvis(data) {
  avisList.innerHTML = '';
  if (data.length === 0) {
    avisList.innerHTML = '<p>Aucun avis ne correspond à ces critères.</p>';
    return;
  }

  data.forEach(avis => {
    const avisEl = document.createElement('div');
    avisEl.className = 'avis-item';

    avisEl.innerHTML = `
      <p><strong>Note :</strong> ${'⭐'.repeat(avis.note)} (${avis.note}/5)</p>
      <p><strong>Message :</strong> ${avis.message}</p>
      ${avis.atelier ? `<p><strong>Atelier :</strong> ${avis.atelier}</p>` : ''}
      ${avis.date ? `<p><em>${new Date(avis.date).toLocaleDateString()}</em></p>` : ''}
    `;

    avisList.appendChild(avisEl);
  });
}

filterButton.addEventListener('click', () => {
  const atelier = atelierFilter.value;
  const minNote = parseInt(noteFilter.value, 10);

  const filtered = allAvis.filter(avis =>
    (!atelier || avis.atelier === atelier) &&
    avis.note >= minNote
  );

  displayAvis(filtered);
});

fetchAvis();


// Funzioni principali per caricamento, azioni e parsing schede

function togglePanel(panelId) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById(panelId).classList.add('active');
}

document.getElementById('uploadForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const file = document.getElementById('fileInput').files[0];
  if (!file) return;

  const reader = new FileReader();
  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === 'json') {
    reader.onload = function(evt) {
      try {
        const jsonData = JSON.parse(evt.target.result);
        document.getElementById('gestioneDati').innerText = JSON.stringify(jsonData, null, 2);
        window.schedaGiocatore = jsonData;
      } catch (err) {
        alert('Errore nella lettura del file JSON');
      }
    };
    reader.readAsText(file);
  } else if (ext === 'txt') {
    reader.onload = function(evt) {
      const lines = evt.target.result.split('\n');
      const data = {};
      lines.forEach(line => {
        const [key, ...rest] = line.split(':');
        if (key && rest.length > 0) {
          data[key.trim().toLowerCase().replace(/\s+/g, '_')] = rest.join(':').trim();
        }
      });
      document.getElementById('gestioneDati').innerText = JSON.stringify(data, null, 2);
      window.schedaGiocatore = data;
    };
    reader.readAsText(file);
  } else if (ext === 'docx') {
    reader.onload = function(evt) {
      const arrayBuffer = reader.result;
      mammoth.extractRawText({ arrayBuffer: arrayBuffer })
        .then(result => {
          const text = result.value;
          const data = {};
          text.split('\n').forEach(line => {
            const [key, ...rest] = line.split(':');
            if (key && rest.length > 0) {
              data[key.trim().toLowerCase().replace(/\s+/g, '_')] = rest.join(':').trim();
            }
          });
          document.getElementById('gestioneDati').innerText = JSON.stringify(data, null, 2);
          window.schedaGiocatore = data;
        })
        .catch(err => alert('Errore nel parsing DOCX: ' + err.message));
    };
    reader.readAsArrayBuffer(file);
  } else if (ext === 'pdf') {
    reader.onload = function(evt) {
      const typedarray = new Uint8Array(evt.target.result);
      pdfjsLib.getDocument({ data: typedarray }).promise.then(doc => {
        let text = '';
        let pages = [];
        for (let i = 1; i <= doc.numPages; i++) {
          pages.push(doc.getPage(i).then(page => {
            return page.getTextContent().then(content => {
              return content.items.map(i => i.str).join(' ');
            });
          }));
        }
        Promise.all(pages).then(pagesText => {
          text = pagesText.join('\n');
          const data = {};
          text.split('\n').forEach(line => {
            const [key, ...rest] = line.split(':');
            if (key && rest.length > 0) {
              data[key.trim().toLowerCase().replace(/\s+/g, '_')] = rest.join(':').trim();
            }
          });
          document.getElementById('gestioneDati').innerText = JSON.stringify(data, null, 2);
          window.schedaGiocatore = data;
        });
      }).catch(err => alert('Errore nel parsing PDF: ' + err.message));
    };
    reader.readAsArrayBuffer(file);
  } else {
    alert('Formato file non ancora supportato per la lettura automatica.');
  }
});

function eseguiAzione() {
  const azione = document.getElementById('azioneSelect').value;
  const scheda = window.schedaGiocatore;
  if (!scheda) {
    alert('Carica prima una scheda del personaggio');
    return;
  }

  let risultato = '';
  switch (azione) {
    case 'attacco':
      const bonusAttacco = parseInt(scheda.bonus_attacco) || 0;
      const dado = Math.floor(Math.random() * 20) + 1;
      const totale = dado + bonusAttacco;
      risultato = `Tiro d'attacco: d20(${dado}) + Bonus(${bonusAttacco}) = ${totale}`;
      break;

    case 'incantesimo':
      const cd = 8 + (parseInt(scheda.car_mod) || 0) + (parseInt(scheda.proficiency) || 0);
      risultato = `CD Incantesimo: 8 + Mod Carisma(${scheda.car_mod}) + Competenza(${scheda.proficiency}) = ${cd}`;
      break;

    case 'tiro_salvezza':
      const salvezza = Math.floor(Math.random() * 20) + 1 + (parseInt(scheda.ts_sag) || 0);
      risultato = `Tiro Salvezza Saggezza: d20 + Bonus(${scheda.ts_sag}) = ${salvezza}`;
      break;
  }

  document.getElementById('risultatoAzione').textContent = risultato + "\n(Il GM può modificare il risultato se necessario)";
}

document.getElementById('creazionePGForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const scheda = {
    nome: document.getElementById('nomePG').value,
    classe: document.getElementById('classePG').value,
    livello: parseInt(document.getElementById('livelloPG').value),
    car_mod: parseInt(document.getElementById('carPG').value) || 0,
    proficiency: parseInt(document.getElementById('profPG').value) || 0,
    bonus_attacco: parseInt(document.getElementById('attPG').value) || 0,
    ts_sag: parseInt(document.getElementById('tsSagPG').value) || 0
  };
  document.getElementById('outputCreazione').textContent = JSON.stringify(scheda, null, 2);
});

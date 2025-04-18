
document.addEventListener("DOMContentLoaded", () => {
  togglePanel('home');
  aggiornaFormEdizione();
});

function togglePanel(panelId) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById(panelId).classList.add('active');
}

function aggiornaFormEdizione() {
  const edizione = document.getElementById("edizioneSelect").value;
  fetch(`data/edizioni/${edizione}/razze.json`)
    .then(response => response.json())
    .then(data => {
      const razzaSelect = document.getElementById("razzaPG");
      razzaSelect.innerHTML = "";
      for (const razza in data) {
        const option = document.createElement("option");
        option.value = razza;
        option.textContent = razza;
        razzaSelect.appendChild(option);
      }
      aggiornaStatistiche(data[razzaSelect.value]);
    });

  fetch(`data/edizioni/${edizione}/classi.json`)
    .then(response => response.json())
    .then(data => {
      const classeSelect = document.getElementById("classePG");
      classeSelect.innerHTML = "";
      for (const classe in data) {
        const option = document.createElement("option");
        option.value = classe;
        option.textContent = classe;
        classeSelect.appendChild(option);
      }
    });
}

document.getElementById("razzaPG").addEventListener("change", () => {
  const edizione = document.getElementById("edizioneSelect").value;
  const razza = document.getElementById("razzaPG").value;
  fetch(`data/edizioni/${edizione}/razze.json`)
    .then(r => r.json())
    .then(data => aggiornaStatistiche(data[razza]));
});

function aggiornaStatistiche(stats) {
  const statsContainer = document.getElementById("statsContainer");
  statsContainer.innerHTML = "";
  for (const key in stats) {
    const label = document.createElement("label");
    label.textContent = key + ": ";
    const input = document.createElement("input");
    input.type = "number";
    input.value = stats[key];
    input.name = key;
    statsContainer.appendChild(label);
    statsContainer.appendChild(input);
    statsContainer.appendChild(document.createElement("br"));
  }
}

document.getElementById('creazionePGForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const edizione = document.getElementById("edizioneSelect").value;
  const nome = document.getElementById("nomePG").value;
  const razza = document.getElementById("razzaPG").value;
  const classe = document.getElementById("classePG").value;
  const livello = document.getElementById("livelloPG").value;
  const statsInputs = document.querySelectorAll('#statsContainer input');
  const statistiche = {};
  statsInputs.forEach(input => {
    statistiche[input.name] = parseInt(input.value);
  });
  const scheda = { edizione, nome, razza, classe, livello, statistiche };
  document.getElementById('outputCreazione').textContent = JSON.stringify(scheda, null, 2);
});

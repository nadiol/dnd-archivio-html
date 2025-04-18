// Script gestione-dati.js

function analizzaTesto() {
  const tipo = document.getElementById("tipoDato").value;
  const input = document.getElementById("inputGenerico").value;
  const output = {};

  // Parsing base per separazione tipo "Campo: valore"
  input.split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      output[key.trim()] = rest.join(':').trim();
    }
  });

  mostraEditor(output);
}

function mostraEditor(dati) {
  const container = document.getElementById("outputEditor");
  container.innerHTML = '';
  for (const key in dati) {
    const label = document.createElement("label");
    label.textContent = key;
    const input = document.createElement("input");
    input.name = key;
    input.value = dati[key];
    input.style.width = '100%';
    container.appendChild(label);
    container.appendChild(document.createElement("br"));
    container.appendChild(input);
    container.appendChild(document.createElement("br"));
  }
  document.getElementById("salvaBtn").classList.remove("hidden");
}

function salvaJsonFinale() {
  const inputs = document.querySelectorAll("#outputEditor input");
  const jsonData = {};
  inputs.forEach(input => {
    jsonData[input.name] = input.value;
  });
  const output = JSON.stringify(jsonData, null, 2);
  document.getElementById("anteprimaJson").textContent = output;
}

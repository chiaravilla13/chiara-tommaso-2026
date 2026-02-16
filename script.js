https://script.google.com/macros/s/AKfycbyPGhee1wf-LfZrrfsLAfLfqMNAL4wg-oZ9DakUzLQvo_KtcNuQ6R8b8L628_1yTrg/execconst ENDPOINT_URL = "INCOLLA_QUI_URL_APPS_SCRIPT";

const form = document.getElementById("rsvpForm");
const people = document.getElementById("people");
const addPersonBtn = document.getElementById("addPerson");
const statusEl = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");

function addPersonField(value = "") {
  const row = document.createElement("div");
  row.className = "personRow";

  const input = document.createElement("input");
  input.className = "input";
  input.type = "text";
  input.placeholder = "Nome e cognome (es. Luca Bianchi)";
  input.value = value;

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "btn danger";
  remove.textContent = "Rimuovi";
  remove.addEventListener("click", () => {
    row.remove();
    if (people.children.length === 0) addPersonField();
  });

  row.appendChild(input);
  row.appendChild(remove);
  people.appendChild(row);
}

// campo iniziale
addPersonField();

addPersonBtn.addEventListener("click", () => addPersonField());

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";

  if (!ENDPOINT_URL || ENDPOINT_URL.startsWith("INCOLLA_QUI")) {
    statusEl.textContent = "Manca l’URL del Google Apps Script.";
    return;
  }

  const rsvp = form.querySelector('input[name="rsvp"]:checked')?.value || "";
  const allergie = document.getElementById("allergie").value.trim();
  const website = document.getElementById("website").value.trim(); // honeypot

  const partecipanti = Array.from(people.querySelectorAll("input"))
    .map(i => i.value.trim())
    .filter(Boolean);

  if (!rsvp) {
    statusEl.textContent = "Seleziona Sì o No.";
    return;
  }
  if (partecipanti.length === 0) {
    statusEl.textContent = "Inserisci almeno un nominativo.";
    return;
  }

  const payload = { rsvp, partecipanti, allergie, website };

  submitBtn.disabled = true;
  submitBtn.textContent = "Invio…";

  try {
    // no-cors: salva comunque sul foglio (non possiamo leggere la risposta)
    await fetch(ENDPOINT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    statusEl.textContent = "✅ Conferma inviata! Grazie 💛";
    form.reset();

    // ricrea il campo partecipante
    people.innerHTML = "";
    addPersonField();
  } catch (err) {
    statusEl.textContent = "❌ Errore nell’invio. Riprova tra poco.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Invia conferma";
  }
});

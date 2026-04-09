const ENDPOINT_URL = "https://script.google.com/macros/s/AKfycbyPGhee1wf-LfZrrfsLAfLfqMNAL4wg-oZ9DakUzLQvo_KtcNuQ6R8b8L628_1yTrg/exec";

const form = document.getElementById("rsvpForm");
const people = document.getElementById("people");
const addPersonBtn = document.getElementById("addPerson");
const statusEl = document.getElementById("status");
const submitBtn = document.getElementById("submitBtn");
const allergieRow = document.getElementById("allergieRow");

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

function toggleAllergie() {
  const rsvp = form.querySelector('input[name="rsvp"]:checked')?.value || "";
  if (!allergieRow) return;
  allergieRow.style.display = (rsvp === "No") ? "none" : "block";
}
form.querySelectorAll('input[name="rsvp"]').forEach(r => r.addEventListener("change", toggleAllergie));
toggleAllergie();

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";

  const rsvp = form.querySelector('input[name="rsvp"]:checked')?.value || "";
  let allergie = document.getElementById("allergie").value.trim();
  if (rsvp === "No") allergie = "";

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
    await fetch(ENDPOINT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    statusEl.textContent = "✅ Conferma inviata! Grazie 💛";
    form.reset();

    people.innerHTML = "";
    addPersonField();
    toggleAllergie();
  } catch (err) {
    statusEl.textContent = "❌ Errore nell’invio. Riprova tra poco.";
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Invia conferma";
  }
});

const units = [
  {
    id: "AX-07",
    type: "Carro de auxilio",
    driver: "Luis Ramírez",
    km: "1.8 km",
    eta: "6 min",
    status: "Disponible",
    emoji: "🚗",
    recommended: true
  },
  {
    id: "MT-08",
    type: "Moto de auxilio",
    driver: "Jorge Medina",
    km: "2.3 km",
    eta: "8 min",
    status: "En camino",
    emoji: "🏍️"
  },
  {
    id: "GR-04",
    type: "Grúa plataforma",
    driver: "Mario A. Solís",
    km: "3.1 km",
    eta: "12 min",
    status: "Ocupado",
    emoji: "🚚"
  }
];

let selectedUnit = "AX-07";
let seconds = 10;

const unitList = document.getElementById("unitList");
const assignBtn = document.getElementById("assignBtn");
const reassignBtn = document.getElementById("reassignBtn");
const cancelBtn = document.getElementById("cancelBtn");
const toast = document.getElementById("toast");

function renderUnits() {
  unitList.innerHTML = "";

  units.forEach(unit => {
    const div = document.createElement("div");
    div.className = "unit" + (unit.id === selectedUnit ? " active" : "");

    div.innerHTML = `
      <div class="emoji">${unit.emoji}</div>
      <div>
        <b>${unit.id} <small>${unit.type}</small></b>
        <small>Operador: ${unit.driver}</small><br>
        <span class="pill ${
          unit.status === "Disponible" ? "green" :
          unit.status === "Ocupado" ? "orange" : "blue"
        } tag">${unit.status}</span>
        ${unit.recommended ? '<span class="pill green tag">RECOMENDADA</span>' : ''}
      </div>
      <div class="eta">
        <b>${unit.eta}</b><br>
        <small>${unit.km}</small>
      </div>
    `;

    div.addEventListener("click", () => {
      selectedUnit = unit.id;
      assignBtn.textContent = "Asignar a " + selectedUnit;
      renderUnits();

      document.querySelectorAll(".vehicle").forEach(v => v.classList.remove("selected"));
      const vehicle = document.querySelector(`[data-unit="${selectedUnit}"]`);
      if (vehicle) vehicle.classList.add("selected");
    });

    unitList.appendChild(div);
  });
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

assignBtn.addEventListener("click", () => {
  showToast(`Servicio asignado a ${selectedUnit}`);
  document.getElementById("badgeRequests").textContent = "0";
  document.getElementById("activeRequests").textContent = "0";
  assignBtn.textContent = "Asignado a " + selectedUnit;
  assignBtn.disabled = true;
  assignBtn.style.opacity = ".75";
});

reassignBtn.addEventListener("click", () => {
  selectedUnit = selectedUnit === "AX-07" ? "MT-08" : "AX-07";
  assignBtn.disabled = false;
  assignBtn.style.opacity = "1";
  assignBtn.textContent = "Asignar a " + selectedUnit;
  renderUnits();
  showToast("Unidad sugerida actualizada");
});

cancelBtn.addEventListener("click", () => {
  if (confirm("¿Cancelar la solicitud manualmente?")) {
    showToast("Solicitud cancelada por cabina");
    document.getElementById("activeRequests").textContent = "0";
    document.getElementById("badgeRequests").textContent = "0";
  }
});

document.getElementById("hidePanel").addEventListener("click", () => {
  document.querySelector(".request-panel").style.display = "none";
  showToast("Panel cerrado");
});

document.querySelectorAll(".menu-item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".menu-item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    showToast("Sección: " + btn.textContent.trim());
  });
});

document.querySelectorAll(".vehicle").forEach(v => {
  v.addEventListener("click", () => {
    selectedUnit = v.dataset.unit;

    assignBtn.disabled = false;
    assignBtn.style.opacity = "1";
    assignBtn.textContent = "Asignar a " + selectedUnit;

    document.querySelectorAll(".vehicle").forEach(x => x.classList.remove("selected"));
    v.classList.add("selected");

    renderUnits();
  });
});

function updateClock() {
  const now = new Date();

  document.getElementById("clock").textContent = now.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit"
  });

  document.getElementById("dateText").textContent = now.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

setInterval(updateClock, 1000);
updateClock();

setInterval(() => {
  seconds = seconds >= 20 ? 1 : seconds + 1;
  document.getElementById("seconds").textContent = seconds;
}, 1000);

renderUnits();

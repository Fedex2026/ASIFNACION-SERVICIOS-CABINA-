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
let activeRequests = 1;
let seconds = 10;
let zoomLevel = 1;

const unitList = document.getElementById("unitList");
const assignBtn = document.getElementById("assignBtn");
const reassignBtn = document.getElementById("reassignBtn");
const cancelBtn = document.getElementById("cancelBtn");
const toast = document.getElementById("toast");
const map = document.querySelector(".map");

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

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
      selectUnit(unit.id);
      showToast("Unidad seleccionada: " + unit.id);
    });

    unitList.appendChild(div);
  });
}

function selectUnit(unitId) {
  selectedUnit = unitId;

  assignBtn.disabled = false;
  assignBtn.style.opacity = "1";
  assignBtn.textContent = "Asignar a " + selectedUnit;

  document.querySelectorAll(".vehicle").forEach(vehicle => {
    vehicle.classList.remove("selected");
  });

  const vehicle = document.querySelector(`[data-unit="${selectedUnit}"]`);
  if (vehicle) {
    vehicle.classList.add("selected");
  }

  renderUnits();
}

function resetButtons() {
  assignBtn.disabled = false;
  reassignBtn.disabled = false;
  cancelBtn.disabled = false;

  assignBtn.style.opacity = "1";
  reassignBtn.style.opacity = "1";
  cancelBtn.style.opacity = "1";
}

assignBtn.addEventListener("click", () => {
  const unit = units.find(u => u.id === selectedUnit);

  if (!unit) {
    showToast("Selecciona una unidad");
    return;
  }

  unit.status = "En camino";

  assignBtn.textContent = "Asignado a " + selectedUnit;
  assignBtn.disabled = true;
  assignBtn.style.opacity = ".7";

  document.getElementById("activeRequests").textContent = "1";
  document.getElementById("badgeRequests").textContent = "1";

  renderUnits();
  showToast("Servicio asignado a " + selectedUnit);
});

reassignBtn.addEventListener("click", () => {
  const currentIndex = units.findIndex(u => u.id === selectedUnit);
  const nextIndex = (currentIndex + 1) % units.length;

  selectUnit(units[nextIndex].id);

  assignBtn.disabled = false;
  assignBtn.style.opacity = "1";
  assignBtn.textContent = "Asignar a " + selectedUnit;

  showToast("Solicitud reasignada a " + selectedUnit);
});

cancelBtn.addEventListener("click", () => {
  const ok = confirm("¿Seguro que quieres cancelar esta solicitud?");

  if (!ok) return;

  activeRequests = 0;

  document.getElementById("activeRequests").textContent = "0";
  document.getElementById("badgeRequests").textContent = "0";

  assignBtn.disabled = true;
  reassignBtn.disabled = true;
  cancelBtn.disabled = true;

  assignBtn.style.opacity = ".5";
  reassignBtn.style.opacity = ".5";
  cancelBtn.style.opacity = ".5";

  showToast("Solicitud cancelada por cabina");
});

document.getElementById("hidePanel").addEventListener("click", () => {
  const panel = document.querySelector(".request-panel");

  panel.style.display = "none";
  showToast("Panel de solicitud cerrado");
});

document.querySelectorAll(".menu-item").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".menu-item").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    showToast("Abriendo: " + button.textContent.trim());
  });
});

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(item => {
      item.classList.remove("active");
    });

    tab.classList.add("active");

    showToast("Vista: " + tab.textContent.trim());
  });
});

document.querySelectorAll(".vehicle").forEach(vehicle => {
  vehicle.addEventListener("click", () => {
    const unitId = vehicle.dataset.unit;
    selectUnit(unitId);
    showToast("Unidad seleccionada: " + unitId);
  });
});

document.querySelector(".filter").addEventListener("click", () => {
  showToast("Filtros abiertos");
});

document.querySelector(".zplus").addEventListener("click", () => {
  zoomLevel += 0.1;

  if (zoomLevel > 1.4) {
    zoomLevel = 1.4;
  }

  map.style.transform = `scale(${zoomLevel})`;
  map.style.transformOrigin = "center";
  showToast("Zoom acercado");
});

document.querySelector(".zminus").addEventListener("click", () => {
  zoomLevel -= 0.1;

  if (zoomLevel < 1) {
    zoomLevel = 1;
  }

  map.style.transform = `scale(${zoomLevel})`;
  map.style.transformOrigin = "center";
  showToast("Zoom alejado");
});

document.querySelector(".zloc").addEventListener("click", () => {
  map.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  showToast("Centrando mapa en solicitud");
});

document.querySelectorAll(".action").forEach(button => {
  button.addEventListener("mouseenter", () => {
    button.style.filter = "brightness(1.1)";
  });

  button.addEventListener("mouseleave", () => {
    button.style.filter = "brightness(1)";
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

function updateSeconds() {
  seconds = seconds >= 20 ? 1 : seconds + 1;
  document.getElementById("seconds").textContent = seconds;
}

setInterval(updateClock, 1000);
setInterval(updateSeconds, 1000);

updateClock();
renderUnits();
resetButtons();
/* ========================= */
/* ESTADOS DEL SERVICIO */
/* ========================= */

const currentStatus = document.getElementById("currentStatus");
const historyList = document.getElementById("historyList");

function updateServiceStatus(status) {

  currentStatus.textContent = status;

  const item = document.createElement("div");

  item.className = "history-item";

  item.innerHTML = `
    ${new Date().toLocaleTimeString()} - ${status}
  `;

  historyList.prepend(item);

  showToast("Estado actualizado: " + status);
}

/* ========================= */
/* BOTONES ESTADO */
/* ========================= */

document.getElementById("statusAssigned")
?.addEventListener("click", () => {
  updateServiceStatus("📋 Asignado");
});

document.getElementById("statusRoute")
?.addEventListener("click", () => {
  updateServiceStatus("🚗 En Camino");
});

document.getElementById("statusArrive")
?.addEventListener("click", () => {
  updateServiceStatus("📍 Arribo");
});

document.getElementById("statusTow")
?.addEventListener("click", () => {
  updateServiceStatus("🔗 Cargando Vehículo");
});

document.getElementById("statusDestination")
?.addEventListener("click", () => {
  updateServiceStatus("🏁 Destino");
});

document.getElementById("statusFinish")
?.addEventListener("click", () => {

  updateServiceStatus("✅ Finalizado");

  const finished = document.getElementById("finishedServices");

  finished.textContent =
    Number(finished.textContent) + 1;
});

/* ========================= */
/* ACCIONES CABINA */
/* ========================= */

document.getElementById("callOperator")
?.addEventListener("click", () => {

  showToast("Llamando operador...");

});

document.getElementById("viewRoute")
?.addEventListener("click", () => {

  showToast("Mostrando ruta");

});

document.getElementById("refreshMap")
?.addEventListener("click", () => {

  showToast("Mapa actualizado");

});

document.getElementById("autoAssign")
?.addEventListener("click", () => {

  const bestUnit = "AX-07";

  selectedUnit = bestUnit;

  assignBtn.textContent =
    "Asignar a " + bestUnit;

  showToast(
    "Unidad recomendada: " + bestUnit
  );

});

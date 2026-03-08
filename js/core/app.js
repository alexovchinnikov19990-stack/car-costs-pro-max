const App = {
  show(p) {
    document.querySelectorAll(".page").forEach(e => e.classList.add("hidden"));
    document.getElementById(p).classList.remove("hidden");
    document.querySelectorAll("nav button[data-page]").forEach(b =>
      b.classList.toggle("active", b.dataset.page === p));
  },
  init() {
    const today = new Date().toISOString().split("T")[0];
    document.querySelectorAll('input[type="date"]').forEach(el => { if (!el.value) el.value = today; });

    // Живой расчёт суммы заправки
    ["fuelLiters","fuelPrice"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("input", App.updateFuelCalc);
    });

    Fuel.render(); Service.render(); Mileage.render();
    Costs.render(); Reminders.render(); CarProfile.load();
    Analytics.update();
    App.show("dashboard");
  },
  updateFuelCalc() {
    const l = parseFloat(document.getElementById("fuelLiters").value) || 0;
    const p = parseFloat(document.getElementById("fuelPrice").value)  || 0;
    const el = document.getElementById("fuelCalc");
    if (!el) return;
    el.textContent = (l && p) ? `💰 Итого: ${(l * p).toFixed(2)} ₽` : "";
  }
};
document.addEventListener("DOMContentLoaded", () => App.init());


const App = {
  show(p) {
    document.querySelectorAll(".page").forEach(e => e.classList.add("hidden"));
    document.getElementById(p).classList.remove("hidden");

    // Активная кнопка навигации
    document.querySelectorAll("nav button[data-page]").forEach(b => {
      b.classList.toggle("active", b.dataset.page === p);
    });
  },
  init() {
    // Установить сегодняшнюю дату по умолчанию во всех date-полях
    const today = new Date().toISOString().split("T")[0];
    document.querySelectorAll('input[type="date"]').forEach(el => {
      if (!el.value) el.value = today;
    });

    Fuel.render();
    Service.render();
    Mileage.render();
    Costs.render();
    Analytics.update();

    // Активировать dashboard по умолчанию
    App.show("dashboard");
  }
};

document.addEventListener("DOMContentLoaded", () => App.init());

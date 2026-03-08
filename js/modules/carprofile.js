const CarProfile = {
  save() {
    const car = {
      make:        document.getElementById("carMake").value.trim(),
      year:        document.getElementById("carYear").value,
      color:       document.getElementById("carColor").value.trim(),
      fuel:        document.getElementById("carFuel").value.trim(),
      engine:      document.getElementById("carEngine").value.trim(),
      initMileage: parseFloat(document.getElementById("carInitMileage").value) || 0,
      buyDate:     document.getElementById("carBuyDate").value,
      norm:        parseFloat(document.getElementById("carNorm").value) || null,
      budget:      parseFloat(document.getElementById("budgetMonth").value) || null,
    };
    Storage.setObj("car", car);
    CarProfile.renderCard(car);
    Analytics.update();
    alert("Данные автомобиля сохранены ✓");
  },
  load() {
    const car = Storage.getObj("car");
    if (!car.make) return;
    const ids = { carMake:"make", carYear:"year", carColor:"color", carFuel:"fuel",
                  carEngine:"engine", carInitMileage:"initMileage", carBuyDate:"buyDate",
                  carNorm:"norm", budgetMonth:"budget" };
    Object.entries(ids).forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (el && car[key]) el.value = car[key];
    });
    CarProfile.renderCard(car);
  },
  renderCard(car) {
    const el = document.getElementById("carCard");
    if (!car.make) { el.classList.remove("visible"); return; }
    el.className = "car-card-preview visible";
    el.innerHTML = `
      <div class="car-card-make">🚗 ${car.make}</div>
      <div class="car-card-sub">${car.year || ""} ${car.color ? "· " + car.color : ""}</div>
      <div class="car-card-grid">
        ${car.engine   ? `<div class="car-card-row">Двигатель: <b>${car.engine}</b></div>` : ""}
        ${car.fuel     ? `<div class="car-card-row">Топливо: <b>${car.fuel}</b></div>` : ""}
        ${car.norm     ? `<div class="car-card-row">Норм. расход: <b>${car.norm} л/100км</b></div>` : ""}
        ${car.budget   ? `<div class="car-card-row">Бюджет/мес: <b>${car.budget} ₽</b></div>` : ""}
        ${car.initMileage ? `<div class="car-card-row">Пробег при покупке: <b>${car.initMileage} км</b></div>` : ""}
        ${car.buyDate  ? `<div class="car-card-row">Дата покупки: <b>${car.buyDate}</b></div>` : ""}
      </div>
    `;
    // Обновить шапку дашборда
    const bar = document.getElementById("dashCarBar");
    if (bar && car.make) {
      bar.textContent = `🚗 ${car.make}${car.year ? " · " + car.year : ""}${car.engine ? " · " + car.engine : ""}`;
      bar.classList.add("visible");
    }
  }
};

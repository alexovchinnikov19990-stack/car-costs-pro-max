
const Analytics = {
  // БАГ #8 ИСПРАВЛЕН: храним экземпляры Chart.js, чтобы уничтожать перед пересозданием
  _charts: {},

  update() {
    const fuel = Storage.get("fuel");
    const service = Storage.get("service");
    const costs = Storage.get("costs");
    const mileage = Storage.get("mileage");

    let fuelCost = 0;
    fuel.forEach(f => fuelCost += f.liters * f.price);

    let serviceCost = 0;
    service.forEach(s => serviceCost += s.cost);

    let otherCost = 0;
    costs.forEach(c => otherCost += c.value);

    const total = fuelCost + serviceCost + otherCost;
    document.getElementById("totalCost").textContent = total.toFixed(2) + " ₽";

    if (mileage.length > 1) {
      // БАГ #9 ИСПРАВЛЕН: сортировка по дате — без неё km мог быть отрицательным
      const sorted = [...mileage].sort((a, b) => a.date.localeCompare(b.date));
      const km = sorted[sorted.length - 1].value - sorted[0].value;
      document.getElementById("totalKm").textContent = km + " км";
      if (km > 0) {
        document.getElementById("costPerKm").textContent = (total / km).toFixed(2) + " ₽";
      }
    }

    Analytics.charts(fuelCost, serviceCost, otherCost, fuel);
  },

  charts(fuelCost, serviceCost, otherCost, fuel) {
    // БАГ #8 ИСПРАВЛЕН: уничтожаем старые графики перед созданием новых
    if (this._charts.structure) {
      this._charts.structure.destroy();
    }
    if (this._charts.monthly) {
      this._charts.monthly.destroy();
    }

    const ctx = document.getElementById("structureChart");
    if (ctx) {
      this._charts.structure = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Топливо", "Сервис", "Прочее"],
          datasets: [{
            data: [fuelCost, serviceCost, otherCost],
            backgroundColor: ["#0a84ff", "#30d158", "#ffd60a"]
          }]
        }
      });
    }

    const monthly = {};
    fuel.forEach(f => {
      const m = f.date.slice(0, 7);
      if (!monthly[m]) monthly[m] = 0;
      monthly[m] += f.liters * f.price;
    });

    const ctx2 = document.getElementById("fuelMonthlyChart");
    if (ctx2) {
      this._charts.monthly = new Chart(ctx2, {
        type: "bar",
        data: {
          labels: Object.keys(monthly).sort(),
          datasets: [{
            label: "Расходы на топливо (₽)",
            data: Object.keys(monthly).sort().map(k => monthly[k]),
            backgroundColor: "#0a84ff"
          }]
        }
      });
    }
  }
};

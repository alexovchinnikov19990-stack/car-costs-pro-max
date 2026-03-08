const Fuel = {
  add() {
    const date    = document.getElementById("fuelDate").value;
    const liters  = parseFloat(document.getElementById("fuelLiters").value);
    const price   = parseFloat(document.getElementById("fuelPrice").value);
    const mileage = parseFloat(document.getElementById("fuelMileage").value);
    if (!date || !liters || !price || !mileage) { alert("Заполните все поля заправки"); return; }
    const list = Storage.get("fuel");
    list.push({ date, liters, price, mileage });
    list.sort((a,b) => a.date.localeCompare(b.date));
    Storage.set("fuel", list);
    Fuel.render(); Analytics.update();
    document.getElementById("fuelLiters").value = "";
    document.getElementById("fuelPrice").value  = "";
    document.getElementById("fuelMileage").value = "";
    document.getElementById("fuelCalc").textContent = "";
  },
  // Fuelio-style: расход считается между соседними заправками
  calcConsumption(list) {
    const res = [];
    const sorted = [...list].sort((a,b) => a.date.localeCompare(b.date));
    for (let i = 1; i < sorted.length; i++) {
      const km = sorted[i].mileage - sorted[i-1].mileage;
      if (km > 0) {
        res.push({ ...sorted[i], consumption: (sorted[i].liters / km * 100).toFixed(1) });
      } else {
        res.push({ ...sorted[i], consumption: null });
      }
    }
    if (sorted.length) res.unshift({ ...sorted[0], consumption: null });
    return res;
  },
  render() {
    const list   = Storage.get("fuel");
    const el     = document.getElementById("fuelList");
    const statsEl= document.getElementById("fuelStats");
    el.innerHTML = "";
    if (!list.length) { statsEl.innerHTML = ""; return; }

    const car   = Storage.getObj("car");
    const norm  = parseFloat(car.norm) || null;
    const withConsumption = Fuel.calcConsumption(list);

    // Статистика секции
    let totalL = 0, totalCost = 0;
    list.forEach(f => { totalL += f.liters; totalCost += f.liters * f.price; });
    const avgPrice = totalCost / totalL;
    statsEl.innerHTML = `
      <div class="stat-item"><b>${totalL.toFixed(1)} л</b><span>Всего литров</span></div>
      <div class="stat-item"><b>${totalCost.toFixed(0)} ₽</b><span>Потрачено</span></div>
      <div class="stat-item"><b>${avgPrice.toFixed(2)} ₽</b><span>Средняя цена</span></div>
    `;
    statsEl.style.display = "flex";

    // Список (новые сверху)
    [...withConsumption].reverse().forEach((i, idx) => {
      const realIdx = list.length - 1 - idx;
      const li      = document.createElement("li");
      const total   = (i.liters * i.price).toFixed(2);
      let badge = "";
      if (i.consumption !== null) {
        const c = parseFloat(i.consumption);
        let cls = "eff-good";
        if (norm) { cls = c <= norm ? "eff-good" : c <= norm * 1.2 ? "eff-warn" : "eff-bad"; }
        else      { cls = c < 8 ? "eff-good" : c < 11 ? "eff-warn" : "eff-bad"; }
        badge = `<span class="efficiency-badge ${cls}">${i.consumption} л/100км</span>`;
      }
      li.innerHTML = `
        <span>${i.date} | ${i.liters}л × ${i.price}₽ = <b>${total} ₽</b> | ${i.mileage}км ${badge}</span>
        <button class="del-btn" onclick="Fuel.remove(${realIdx})">✕</button>
      `;
      el.appendChild(li);
    });
  },
  remove(idx) {
    const list = Storage.get("fuel");
    list.splice(idx, 1);
    Storage.set("fuel", list);
    Fuel.render(); Analytics.update();
  }
};

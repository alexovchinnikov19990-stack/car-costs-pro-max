const Service = {
  add() {
    const date    = document.getElementById("serviceDate").value;
    const name    = document.getElementById("serviceName").value.trim();
    const cost    = parseFloat(document.getElementById("serviceCost").value);
    const mileage = parseFloat(document.getElementById("serviceMileage").value);
    if (!date || !name || !cost || !mileage) { alert("Заполните все поля сервиса"); return; }
    const list = Storage.get("service");
    list.push({ date, name, cost, mileage });
    Storage.set("service", list);
    Service.render(); Analytics.update();
    document.getElementById("serviceName").value = "";
    document.getElementById("serviceCost").value = "";
    document.getElementById("serviceMileage").value = "";
  },
  render() {
    const list   = Storage.get("service");
    const el     = document.getElementById("serviceList");
    const statsEl= document.getElementById("serviceStats");
    el.innerHTML = "";
    if (!list.length) { statsEl.innerHTML = ""; return; }
    const total = list.reduce((s,i) => s + i.cost, 0);
    statsEl.innerHTML = `
      <div class="stat-item"><b>${list.length}</b><span>Записей</span></div>
      <div class="stat-item"><b>${total.toFixed(0)} ₽</b><span>Потрачено</span></div>
    `;
    statsEl.style.display = "flex";
    [...list].reverse().forEach((i, idx) => {
      const realIdx = list.length - 1 - idx;
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${i.date} | ${i.name} | <b>${i.cost} ₽</b> | ${i.mileage} км</span>
        <button class="del-btn" onclick="Service.remove(${realIdx})">✕</button>
      `;
      el.appendChild(li);
    });
  },
  remove(idx) {
    const list = Storage.get("service");
    list.splice(idx, 1);
    Storage.set("service", list);
    Service.render(); Analytics.update();
  }
};

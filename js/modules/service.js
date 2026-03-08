
const Service = {
  add() {
    const date = document.getElementById("serviceDate").value;
    const name = document.getElementById("serviceName").value.trim();
    const cost = Number(document.getElementById("serviceCost").value);
    const mileage = Number(document.getElementById("serviceMileage").value);

    // БАГ #5 ИСПРАВЛЕН: валидация полей
    if (!date || !name || !cost || !mileage) {
      alert("Заполните все поля сервиса");
      return;
    }

    const item = { date, name, cost, mileage };
    const list = Storage.get("service");
    list.push(item);
    Storage.set("service", list);
    Service.render();
    Analytics.update();

    document.getElementById("serviceName").value = "";
    document.getElementById("serviceCost").value = "";
    document.getElementById("serviceMileage").value = "";
  },
  render() {
    const list = Storage.get("service");
    const el = document.getElementById("serviceList");
    el.innerHTML = "";
    list.forEach((i, idx) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${i.date} | ${i.name} | <b>${i.cost} ₽</b> | ${i.mileage} км</span>
        <button class="del-btn" onclick="Service.remove(${idx})">✕</button>
      `;
      el.appendChild(li);
    });
  },
  remove(idx) {
    const list = Storage.get("service");
    list.splice(idx, 1);
    Storage.set("service", list);
    Service.render();
    Analytics.update();
  }
};

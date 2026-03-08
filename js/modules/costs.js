
const Costs = {
  add() {
    const date = document.getElementById("costDate").value;
    const name = document.getElementById("costName").value.trim();
    const value = Number(document.getElementById("costValue").value);

    // БАГ #7 ИСПРАВЛЕН: валидация полей
    if (!date || !name || !value) {
      alert("Заполните все поля расхода");
      return;
    }

    const item = { date, name, value };
    const list = Storage.get("costs");
    list.push(item);
    Storage.set("costs", list);
    Costs.render();
    Analytics.update();

    document.getElementById("costName").value = "";
    document.getElementById("costValue").value = "";
  },
  render() {
    const list = Storage.get("costs");
    const el = document.getElementById("costList");
    el.innerHTML = "";
    list.forEach((i, idx) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${i.date} | ${i.name} | <b>${i.value} ₽</b></span>
        <button class="del-btn" onclick="Costs.remove(${idx})">✕</button>
      `;
      el.appendChild(li);
    });
  },
  remove(idx) {
    const list = Storage.get("costs");
    list.splice(idx, 1);
    Storage.set("costs", list);
    Costs.render();
    Analytics.update();
  }
};

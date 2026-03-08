const Costs = {
  add() {
    const date  = document.getElementById("costDate").value;
    const cat   = document.getElementById("costCat").value;
    const name  = document.getElementById("costName").value.trim() || cat;
    const value = parseFloat(document.getElementById("costValue").value);
    if (!date || !value) { alert("Заполните дату и сумму"); return; }
    const list = Storage.get("costs");
    list.push({ date, name, cat, value });
    Storage.set("costs", list);
    Costs.render(); Analytics.update();
    document.getElementById("costName").value  = "";
    document.getElementById("costValue").value = "";
  },
  render() {
    const list   = Storage.get("costs");
    const el     = document.getElementById("costList");
    const statsEl= document.getElementById("costsStats");
    el.innerHTML = "";
    if (!list.length) { statsEl.innerHTML = ""; return; }
    const total = list.reduce((s,i) => s + i.value, 0);
    statsEl.innerHTML = `
      <div class="stat-item"><b>${list.length}</b><span>Записей</span></div>
      <div class="stat-item"><b>${total.toFixed(0)} ₽</b><span>Потрачено</span></div>
    `;
    statsEl.style.display = "flex";
    [...list].reverse().forEach((i, idx) => {
      const realIdx = list.length - 1 - idx;
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${i.date} | ${i.name} | <b>${i.value} ₽</b></span>
        <button class="del-btn" onclick="Costs.remove(${realIdx})">✕</button>
      `;
      el.appendChild(li);
    });
  },
  remove(idx) {
    const list = Storage.get("costs");
    list.splice(idx, 1);
    Storage.set("costs", list);
    Costs.render(); Analytics.update();
  }
};

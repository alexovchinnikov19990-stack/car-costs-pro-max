const Mileage = {
  add() {
    const date  = document.getElementById("mileageDate").value;
    const value = parseFloat(document.getElementById("mileageValue").value);
    if (!date || !value) { alert("Заполните все поля пробега"); return; }
    const list = Storage.get("mileage");
    list.push({ date, value });
    list.sort((a,b) => a.date.localeCompare(b.date));
    Storage.set("mileage", list);
    Mileage.render(); Analytics.update();
    document.getElementById("mileageValue").value = "";
  },
  render() {
    const list = Storage.get("mileage");
    const el   = document.getElementById("mileageList");
    el.innerHTML = "";
    [...list].reverse().forEach((i, idx) => {
      const realIdx = list.length - 1 - idx;
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${i.date} | <b>${i.value} км</b></span>
        <button class="del-btn" onclick="Mileage.remove(${realIdx})">✕</button>
      `;
      el.appendChild(li);
    });
  },
  remove(idx) {
    const list = Storage.get("mileage");
    list.splice(idx, 1);
    Storage.set("mileage", list);
    Mileage.render(); Analytics.update();
  }
};

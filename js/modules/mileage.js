
const Mileage = {
  add() {
    const date = document.getElementById("mileageDate").value;
    const value = Number(document.getElementById("mileageValue").value);

    // БАГ #6 ИСПРАВЛЕН: валидация полей
    if (!date || !value) {
      alert("Заполните все поля пробега");
      return;
    }

    const item = { date, value };
    const list = Storage.get("mileage");
    list.push(item);
    Storage.set("mileage", list);
    Mileage.render();
    Analytics.update();

    document.getElementById("mileageValue").value = "";
  },
  render() {
    const list = Storage.get("mileage");
    const el = document.getElementById("mileageList");
    el.innerHTML = "";
    list.forEach((i, idx) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${i.date} | <b>${i.value} км</b></span>
        <button class="del-btn" onclick="Mileage.remove(${idx})">✕</button>
      `;
      el.appendChild(li);
    });
  },
  remove(idx) {
    const list = Storage.get("mileage");
    list.splice(idx, 1);
    Storage.set("mileage", list);
    Mileage.render();
    Analytics.update();
  }
};

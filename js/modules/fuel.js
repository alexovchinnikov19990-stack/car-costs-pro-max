
const Fuel = {
  add() {
    const date = document.getElementById("fuelDate").value;
    const liters = Number(document.getElementById("fuelLiters").value);
    const price = Number(document.getElementById("fuelPrice").value);
    const mileage = Number(document.getElementById("fuelMileage").value);
    const type = document.getElementById("fuelType").value;

    // БАГ #3 ИСПРАВЛЕН: валидация обязательных полей
    if (!date || !liters || !price || !mileage) {
      alert("Заполните все поля заправки");
      return;
    }

    const item = { date, liters, price, mileage, type };
    const list = Storage.get("fuel");
    list.push(item);
    Storage.set("fuel", list);
    Fuel.render();
    Analytics.update();

    // Очищаем поля после добавления
    document.getElementById("fuelLiters").value = "";
    document.getElementById("fuelPrice").value = "";
    document.getElementById("fuelMileage").value = "";
  },
  render() {
    const list = Storage.get("fuel");
    const el = document.getElementById("fuelList");
    el.innerHTML = "";
    list.forEach((i, idx) => {
      const li = document.createElement("li");
      // БАГ #4 ИСПРАВЛЕН: отображалась цена за литр, теперь показываем итоговую сумму
      const total = (i.liters * i.price).toFixed(2);
      li.innerHTML = `
        <span>${i.date} | ${i.liters} л × ${i.price} ₽ = <b>${total} ₽</b> | ${i.mileage} км</span>
        <button class="del-btn" onclick="Fuel.remove(${idx})">✕</button>
      `;
      el.appendChild(li);
    });
  },
  remove(idx) {
    const list = Storage.get("fuel");
    list.splice(idx, 1);
    Storage.set("fuel", list);
    Fuel.render();
    Analytics.update();
  }
};

const Reminders = {
  add() {
    const title   = document.getElementById("remTitle").value.trim();
    const date    = document.getElementById("remDate").value;
    const mileage = parseFloat(document.getElementById("remMileage").value) || null;
    const type    = document.getElementById("remType").value;
    if (!title || !date) { alert("Укажите название и дату"); return; }
    const list = Storage.get("reminders");
    list.push({ title, date, mileage, type, done: false });
    Storage.set("reminders", list);
    Reminders.render();
    document.getElementById("remTitle").value   = "";
    document.getElementById("remMileage").value = "";
  },
  render() {
    const list = Storage.get("reminders");
    const el   = document.getElementById("reminderList");
    el.innerHTML = "";
    const today = new Date().toISOString().split("T")[0];

    // Обновляем колокольчик
    const hasDue = list.some(r => !r.done && r.date <= today);
    const bell   = document.getElementById("bellBtn");
    if (bell) bell.classList.toggle("has-due", hasDue);

    // Дашборд — ближайшие напоминания
    Reminders.renderDash(list, today);

    if (!list.length) { el.innerHTML = '<li style="justify-content:center;color:rgba(255,255,255,.4)">Нет напоминаний</li>'; return; }

    list.forEach((r, idx) => {
      if (r.done) return;
      const li   = document.createElement("li");
      const days = Math.round((new Date(r.date) - new Date(today)) / 86400000);
      let dueLabel = days < 0 ? `⚠️ Просрочено на ${Math.abs(days)} д.`
                    : days === 0 ? "📌 Сегодня!"
                    : `через ${days} дн.`;
      li.className = days < 0 ? "overdue" : days <= 7 ? "due-soon" : "";
      li.innerHTML = `
        <div class="rem-header">
          <b>${r.type} — ${r.title}</b>
          <div style="display:flex;gap:6px">
            <button class="del-btn" style="background:rgba(48,209,88,.2);border-color:rgba(48,209,88,.4);color:#30d158" onclick="Reminders.done(${idx})">✓</button>
            <button class="del-btn" onclick="Reminders.remove(${idx})">✕</button>
          </div>
        </div>
        <div class="rem-due">📅 ${r.date}${r.mileage ? ' | 🛣 '+r.mileage+' км' : ''} — ${dueLabel}</div>
      `;
      el.appendChild(li);
    });
  },
  renderDash(list, today) {
    const el = document.getElementById("dashReminders");
    if (!el) return;
    el.innerHTML = "";
    const upcoming = list.filter(r => !r.done).sort((a,b) => a.date.localeCompare(b.date)).slice(0,3);
    upcoming.forEach(r => {
      const days = Math.round((new Date(r.date) - new Date(today)) / 86400000);
      if (days > 30) return;
      const div = document.createElement("div");
      div.className = "dash-remind-item" + (days <= 0 ? "" : " soon");
      div.textContent = days <= 0
        ? `🔴 ${r.type}: ${r.title} — просрочено!`
        : `🟡 ${r.type}: ${r.title} — через ${days} дн.`;
      el.appendChild(div);
    });
  },
  done(idx) {
    const list = Storage.get("reminders");
    list[idx].done = true;
    Storage.set("reminders", list);
    Reminders.render();
  },
  remove(idx) {
    const list = Storage.get("reminders");
    list.splice(idx, 1);
    Storage.set("reminders", list);
    Reminders.render();
  }
};

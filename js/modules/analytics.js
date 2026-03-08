const Analytics = {
  _charts: {},
  _consumPeriod: 'all',

  update() {
    const fuel    = Storage.get("fuel");
    const service = Storage.get("service");
    const costs   = Storage.get("costs");
    const mileage = Storage.get("mileage");
    const car     = Storage.getObj("car");

    let fuelCost = 0; fuel.forEach(f => fuelCost += f.liters * f.price);
    let svcCost  = 0; service.forEach(s => svcCost += s.cost);
    let othCost  = 0; costs.forEach(c => othCost += c.value);
    const total  = fuelCost + svcCost + othCost;

    document.getElementById("totalCost").textContent = total.toFixed(2) + " ₽";

    // --- Пробег ---
    let km = 0;
    const initMileage = parseFloat(car.initMileage) || 0;
    if (mileage.length >= 1) {
      const sorted = [...mileage].sort((a,b) => a.date.localeCompare(b.date));
      const lastKm = sorted[sorted.length-1].value;
      const firstKm = mileage.length === 1 ? (initMileage || sorted[0].value) : sorted[0].value;
      km = lastKm - (initMileage > 0 ? initMileage : firstKm);
      if (km < 0) km = lastKm - firstKm;
      document.getElementById("totalKm").textContent = km + " км";
      if (km > 0) document.getElementById("costPerKm").textContent = (total/km).toFixed(2) + " ₽";
    }

    // --- Средний расход ---
    const withC = Fuel.calcConsumption(fuel);
    const validC = withC.filter(f => f.consumption !== null).map(f => parseFloat(f.consumption));
    if (validC.length) {
      const avg = (validC.reduce((a,b)=>a+b,0)/validC.length).toFixed(1);
      document.getElementById("avgConsumption").textContent = avg + " л/100";
    }

    // --- Бюджет ---
    Analytics.updateBudget(fuel, service, costs, car);

    // --- Инсайты ---
    Analytics.updateInsights(fuel, service, costs, mileage, car, total, km, validC);

    // --- Графики ---
    Analytics.buildPeriodSelector(fuel);
    Analytics.charts(fuelCost, svcCost, othCost, fuel);
  },

  updateBudget(fuel, service, costs, car) {
    const budget = parseFloat(car.budget) || 0;
    const block  = document.getElementById("budgetBlock");
    if (!budget || !block) return;

    const now   = new Date();
    const ym    = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
    let spent   = 0;
    fuel.forEach(f    => { if(f.date.slice(0,7)===ym) spent += f.liters*f.price; });
    service.forEach(s => { if(s.date.slice(0,7)===ym) spent += s.cost; });
    costs.forEach(c   => { if(c.date.slice(0,7)===ym) spent += c.value; });

    const pct  = Math.min(spent / budget * 100, 100);
    const cls  = pct < 70 ? "" : pct < 100 ? " warn" : " over";
    block.className = "budget-block visible";
    block.innerHTML = `
      <div class="budget-title">Бюджет месяца (${ym})</div>
      <div class="budget-bar-wrap"><div class="budget-bar${cls}" style="width:${pct}%"></div></div>
      <div class="budget-text"><span>${spent.toFixed(0)} ₽ потрачено</span><span>лимит ${budget} ₽</span></div>
    `;
  },

  updateInsights(fuel, service, costs, mileage, car, total, km, validC) {
    const el   = document.getElementById("insights");
    if (!el) return;
    el.innerHTML = "";
    const norm = parseFloat(car.norm) || null;

    const addInsight = (text, cls="") => {
      const d = document.createElement("div");
      d.className = "insight" + (cls ? " "+cls : "");
      d.innerHTML = text;
      el.appendChild(d);
    };

    // Расход vs норма
    if (validC.length && norm) {
      const avg = validC.reduce((a,b)=>a+b,0)/validC.length;
      const diff = ((avg-norm)/norm*100).toFixed(1);
      if (avg > norm * 1.15)
        addInsight(`⛽ Средний расход <b>${avg.toFixed(1)} л/100км</b> — на ${diff}% выше нормы. Проверьте давление в шинах.`, "warn");
      else
        addInsight(`⛽ Средний расход <b>${avg.toFixed(1)} л/100км</b> — в пределах нормы (${norm} л/100).`, "good");
    }

    // Тренд цены топлива последних 2 месяцев
    if (fuel.length >= 4) {
      const sorted = [...fuel].sort((a,b)=>a.date.localeCompare(b.date));
      const last4  = sorted.slice(-4);
      const avgNew = (last4.slice(-2).reduce((s,f)=>s+f.price,0)/2).toFixed(2);
      const avgOld = (last4.slice(0,2).reduce((s,f)=>s+f.price,0)/2).toFixed(2);
      if (parseFloat(avgNew) > parseFloat(avgOld) * 1.05)
        addInsight(`📈 Цена топлива растёт: ${avgOld} → ${avgNew} ₽/л`, "warn");
      else if (parseFloat(avgNew) < parseFloat(avgOld) * 0.97)
        addInsight(`📉 Цена топлива снижается: ${avgOld} → ${avgNew} ₽/л`, "good");
    }

    // Давно не было сервиса
    if (service.length) {
      const lastSvc = [...service].sort((a,b)=>b.date.localeCompare(a.date))[0];
      const daysSince = Math.round((new Date() - new Date(lastSvc.date)) / 86400000);
      if (daysSince > 180)
        addInsight(`🔧 Последний сервис <b>${daysSince} дней назад</b> (${lastSvc.date}). Рекомендуем проверку.`, "warn");
    }

    // Стоимость за год
    if (total > 0) {
      const allDates = [
        ...fuel.map(f=>f.date), ...service.map(s=>s.date), ...costs.map(c=>c.date)
      ].sort();
      if (allDates.length) {
        const days = Math.max(1, Math.round((new Date() - new Date(allDates[0]))/86400000));
        const perMonth = (total / days * 30).toFixed(0);
        addInsight(`📅 Средние расходы: <b>${perMonth} ₽/мес</b> за последние ${days} дней`);
      }
    }
  },

  buildPeriodSelector(fuel) {
    const sel = document.getElementById("consumPeriodSel");
    if (!sel) return;
    const months  = [...new Set(fuel.map(f => f.date.slice(0,7)))].sort();
    const current = sel.value || "all";
    sel.innerHTML = '<option value="all">Весь период</option>' +
      months.map(m => `<option value="${m}"${m===current?" selected":""}>${m}</option>`).join("");
    Analytics._consumPeriod = sel.value;
  },

  charts(fuelCost, svcCost, othCost, fuel) {
    const chartColors = { grid: "rgba(255,255,255,0.06)", tick: "#888" };
    const destroy = key => { if (this._charts[key]) { this._charts[key].destroy(); delete this._charts[key]; } };

    // 1. Пирог структуры
    destroy("structure");
    const ctx1 = document.getElementById("structureChart");
    if (ctx1) {
      this._charts.structure = new Chart(ctx1, {
        type: "doughnut",
        data: {
          labels: ["Топливо", "Сервис", "Прочее"],
          datasets: [{ data: [fuelCost, svcCost, othCost],
            backgroundColor: ["#0a84ff","#30d158","#ffd60a"], borderWidth: 2, borderColor:"rgba(0,0,0,.3)" }]
        },
        options: { plugins: { legend: { labels: { color:"#fff", font:{ size:12 } } } } }
      });
    }

    // 2. Расход л/100км
    destroy("consumption");
    const ctx2 = document.getElementById("consumptionChart");
    if (ctx2 && fuel.length > 1) {
      const period = Analytics._consumPeriod || "all";
      const withC  = Fuel.calcConsumption(fuel).filter(f => f.consumption !== null);
      const filtered = period === "all" ? withC : withC.filter(f => f.date.slice(0,7) === period);
      this._charts.consumption = new Chart(ctx2, {
        type: "bar",
        data: {
          labels: filtered.map(f => f.date.slice(5)),
          datasets: [{ label:"л/100км", data: filtered.map(f => f.consumption),
            backgroundColor: filtered.map(f => {
              const c = parseFloat(f.consumption);
              return c < 8 ? "rgba(48,209,88,.75)" : c < 11 ? "rgba(255,214,10,.75)" : "rgba(255,69,58,.75)";
            }), borderRadius: 5 }]
        },
        options: {
          plugins: { legend: { labels: { color:"#fff" } } },
          scales: {
            x: { ticks:{ color: chartColors.tick }, grid:{ color: chartColors.grid } },
            y: { ticks:{ color: chartColors.tick, callback: v=>v+" л" }, grid:{ color: chartColors.grid }, beginAtZero:true }
          }
        }
      });
    }

    // 3. Динамика цены топлива
    destroy("fuelPrice");
    const ctx3 = document.getElementById("fuelPriceChart");
    if (ctx3 && fuel.length >= 2) {
      const sorted = [...fuel].sort((a,b) => a.date.localeCompare(b.date));
      this._charts.fuelPrice = new Chart(ctx3, {
        type: "line",
        data: {
          labels: sorted.map(f => f.date.slice(5)),
          datasets: [{ label:"₽/л", data: sorted.map(f => f.price),
            borderColor:"#0a84ff", backgroundColor:"rgba(10,132,255,.1)",
            tension: 0.35, fill:true, pointRadius:3 }]
        },
        options: {
          plugins: { legend: { labels: { color:"#fff" } } },
          scales: {
            x: { ticks:{ color: chartColors.tick }, grid:{ color: chartColors.grid } },
            y: { ticks:{ color: chartColors.tick }, grid:{ color: chartColors.grid } }
          }
        }
      });
    }

    // 4. Расходы по месяцам (накопленные)
    destroy("monthlyTotal");
    const ctx4 = document.getElementById("monthlyTotalChart");
    const allData = Storage.all();
    if (ctx4) {
      const monthly = {};
      allData.fuel.forEach(f    => { const m=f.date.slice(0,7); if(!monthly[m]) monthly[m]={fuel:0,svc:0,other:0}; monthly[m].fuel  += f.liters*f.price; });
      allData.service.forEach(s => { const m=s.date.slice(0,7); if(!monthly[m]) monthly[m]={fuel:0,svc:0,other:0}; monthly[m].svc   += s.cost; });
      allData.costs.forEach(c   => { const m=c.date.slice(0,7); if(!monthly[m]) monthly[m]={fuel:0,svc:0,other:0}; monthly[m].other += c.value; });
      const labels = Object.keys(monthly).sort();
      this._charts.monthlyTotal = new Chart(ctx4, {
        type: "bar",
        data: {
          labels,
          datasets: [
            { label:"Топливо",  data: labels.map(m=>monthly[m].fuel.toFixed(0)),  backgroundColor:"rgba(10,132,255,.8)",  borderRadius:4 },
            { label:"Сервис",   data: labels.map(m=>monthly[m].svc.toFixed(0)),   backgroundColor:"rgba(48,209,88,.8)",   borderRadius:4 },
            { label:"Прочее",   data: labels.map(m=>monthly[m].other.toFixed(0)), backgroundColor:"rgba(255,214,10,.8)",  borderRadius:4 }
          ]
        },
        options: {
          plugins: { legend: { labels: { color:"#fff" } } },
          scales: {
            x: { stacked:true, ticks:{ color: chartColors.tick }, grid:{ color: chartColors.grid } },
            y: { stacked:true, ticks:{ color: chartColors.tick }, grid:{ color: chartColors.grid } }
          }
        }
      });
    }
  },

  onPeriodChange() {
    const sel = document.getElementById("consumPeriodSel");
    Analytics._consumPeriod = sel ? sel.value : "all";
    const f = Storage.get("fuel"), s = Storage.get("service"), c = Storage.get("costs");
    let fc=0,sc=0,oc=0;
    f.forEach(x=>fc+=x.liters*x.price); s.forEach(x=>sc+=x.cost); c.forEach(x=>oc+=x.value);
    Analytics.charts(fc, sc, oc, f);
  }
};

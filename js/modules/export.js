const Export = {
  backup() {
    const blob = new Blob([JSON.stringify(Storage.all(), null, 2)], { type:"application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = "car-costs-backup.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  pdf() {
    if (!window.jspdf) { alert("jsPDF не загружен. Проверьте соединение."); return; }
    const { jsPDF } = window.jspdf;
    const doc  = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
    const data = Storage.all();
    const car  = data.car || {};
    const W    = doc.internal.pageSize.getWidth();
    const M    = 14;
    let y      = 0;

    const newPage = () => { doc.addPage(); y = 20; };
    const checkY  = (n=8) => { if (y + n > 275) newPage(); };

    // ── Обложка ──
    doc.setFillColor(10, 10, 14);
    doc.rect(0, 0, W, 297, "F");
    doc.setFillColor(10, 132, 255);
    doc.rect(0, 0, W, 48, "F");
    doc.setTextColor(255,255,255);
    doc.setFontSize(20); doc.setFont("helvetica","bold");
    doc.text("Car Costs PRO MAX", M, 22);
    doc.setFontSize(11); doc.setFont("helvetica","normal");
    doc.text("Отчёт по расходам на автомобиль", M, 32);
    doc.text(new Date().toLocaleDateString("ru-RU",{day:"2-digit",month:"long",year:"numeric"}), W-M, 32, {align:"right"});

    if (car.make) {
      doc.setFontSize(13); doc.setFont("helvetica","bold");
      doc.text(`${car.make}${car.year?" · "+car.year:""}`, M, 42);
    }
    y = 60;

    // ── Сводка ──
    const fuel = data.fuel||[], svc=data.service||[], costs=data.costs||[], mileage=data.mileage||[];
    let fc=0,sc=0,oc=0;
    fuel.forEach(f=>fc+=f.liters*f.price); svc.forEach(s=>sc+=s.cost); costs.forEach(c=>oc+=c.value);
    const total = fc+sc+oc;
    let km=0;
    if (mileage.length>=1) {
      const sorted=[...mileage].sort((a,b)=>a.date.localeCompare(b.date));
      km = mileage.length===1 ? sorted[0].value : sorted[sorted.length-1].value - sorted[0].value;
    }
    const cards=[
      ["Всего расходов", total.toFixed(2)+" руб."],
      ["Топливо",        fc.toFixed(2)+" руб."],
      ["Сервис",         sc.toFixed(2)+" руб."],
      ["Прочее",         oc.toFixed(2)+" руб."],
      ["Пробег",         km+" км"],
      ["Стоимость 1 км", km>0?(total/km).toFixed(2)+" руб.":"—"],
    ];
    const cw=(W-M*2)/3;
    cards.forEach((c,i)=>{
      const cx=M+(i%3)*cw, cy=y+Math.floor(i/3)*20;
      doc.setFillColor(20,20,26); doc.roundedRect(cx,cy,cw-3,18,2,2,"F");
      doc.setTextColor(100,100,120); doc.setFontSize(7); doc.setFont("helvetica","normal");
      doc.text(c[0].toUpperCase(), cx+3, cy+6);
      doc.setTextColor(10,132,255); doc.setFontSize(10); doc.setFont("helvetica","bold");
      doc.text(c[1], cx+3, cy+14);
    });
    y += 44;

    // ── Секции ──
    const sections=[
      { title:"Заправки", rows:fuel,
        heads:["Дата","Литры","Цена/л","Сумма","Пробег"],
        row: f=>[f.date, f.liters+"л", f.price+" ₽", (f.liters*f.price).toFixed(0)+" ₽", f.mileage+" км"] },
      { title:"Сервис", rows:svc,
        heads:["Дата","Работа","Стоимость","Пробег"],
        row: s=>[s.date, s.name, s.cost+" ₽", s.mileage+" км"] },
      { title:"Прочие расходы", rows:costs,
        heads:["Дата","Категория","Описание","Сумма"],
        row: c=>[c.date, c.cat||"—", c.name, c.value+" ₽"] },
      { title:"Пробег", rows:mileage,
        heads:["Дата","Пробег"],
        row: m=>[m.date, m.value+" км"] },
    ];

    sections.forEach(sec=>{
      checkY(16);
      doc.setFillColor(10,132,255);
      doc.rect(M, y, W-M*2, 9, "F");
      doc.setTextColor(255,255,255); doc.setFontSize(10); doc.setFont("helvetica","bold");
      doc.text(sec.title, M+3, y+6.2);
      y+=11;

      if (!sec.rows.length) {
        doc.setTextColor(120,120,130); doc.setFontSize(9); doc.setFont("helvetica","italic");
        checkY(8); doc.text("Нет записей", M+3, y+5); y+=10; return;
      }

      const cols=sec.heads.length, colW=(W-M*2)/cols;
      checkY(8);
      doc.setFillColor(35,35,40);
      doc.rect(M,y,W-M*2,7,"F");
      doc.setTextColor(180,180,200); doc.setFontSize(8); doc.setFont("helvetica","bold");
      sec.heads.forEach((h,ci)=>doc.text(h, M+ci*colW+2, y+5));
      y+=8;

      sec.rows.forEach((r,ri)=>{
        checkY(7);
        if (ri%2===0){ doc.setFillColor(18,18,22); doc.rect(M,y,W-M*2,6.5,"F"); }
        const cells=sec.row(r);
        doc.setTextColor(210,210,220); doc.setFontSize(8); doc.setFont("helvetica","normal");
        cells.forEach((cell,ci)=>doc.text(String(cell).slice(0,28), M+ci*colW+2, y+4.5));
        y+=7;
      });
      y+=8;
    });

    // ── Напоминания ──
    const rems=(data.reminders||[]).filter(r=>!r.done);
    if (rems.length) {
      checkY(16);
      doc.setFillColor(255,214,10);
      doc.rect(M,y,W-M*2,9,"F");
      doc.setTextColor(0,0,0); doc.setFontSize(10); doc.setFont("helvetica","bold");
      doc.text("Активные напоминания", M+3, y+6.2);
      y+=11;
      rems.forEach(r=>{
        checkY(7);
        doc.setTextColor(220,220,200); doc.setFontSize(9); doc.setFont("helvetica","normal");
        doc.text(`• ${r.type}: ${r.title} — ${r.date}${r.mileage?" | "+r.mileage+" км":""}`, M+3, y+5);
        y+=7;
      });
    }

    // ── Футер ──
    const pages=doc.internal.getNumberOfPages();
    for(let p=1;p<=pages;p++){
      doc.setPage(p);
      doc.setFillColor(8,8,12); doc.rect(0,287,W,10,"F");
      doc.setTextColor(70,70,85); doc.setFontSize(7); doc.setFont("helvetica","normal");
      doc.text("Car Costs PRO MAX", M, 293);
      doc.text(`${p} / ${pages}`, W-M, 293, {align:"right"});
    }
    doc.save(`car-costs-${new Date().toISOString().slice(0,10)}.pdf`);
  }
};

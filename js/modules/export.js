
const Export = {
  backup() {
    const data = Storage.all();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "car-costs-backup.json";
    a.click();
    // БАГ #10 ИСПРАВЛЕН: освобождаем URL после скачивания — иначе утечка памяти
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
};

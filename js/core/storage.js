
const Storage = {
  get(k) {
    // БАГ #1 ИСПРАВЛЕН: добавлен try/catch — повреждённые данные в localStorage не роняют приложение
    try {
      return JSON.parse(localStorage.getItem(k) || "[]");
    } catch {
      return [];
    }
  },
  set(k, v) {
    localStorage.setItem(k, JSON.stringify(v));
  },
  all() {
    return {
      fuel: this.get("fuel"),
      service: this.get("service"),
      mileage: this.get("mileage"),
      costs: this.get("costs")
    };
  }
};

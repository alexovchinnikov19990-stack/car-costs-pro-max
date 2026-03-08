const Storage = {
  get(k) {
    try { return JSON.parse(localStorage.getItem(k) || "[]"); } catch { return []; }
  },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
  getObj(k) {
    try { return JSON.parse(localStorage.getItem(k) || "{}"); } catch { return {}; }
  },
  setObj(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
  all() {
    return {
      fuel: this.get("fuel"), service: this.get("service"),
      mileage: this.get("mileage"), costs: this.get("costs"),
      reminders: this.get("reminders"), car: this.getObj("car")
    };
  }
};

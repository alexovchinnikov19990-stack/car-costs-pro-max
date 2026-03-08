
const Storage={
get(k){return JSON.parse(localStorage.getItem(k)||"[]")},
set(k,v){localStorage.setItem(k,JSON.stringify(v))},
all(){return{fuel:this.get("fuel"),service:this.get("service"),mileage:this.get("mileage"),costs:this.get("costs")}}
}


const App={
show(p){
document.querySelectorAll(".page").forEach(e=>e.classList.add("hidden"))
document.getElementById(p).classList.remove("hidden")
},
init(){
Fuel.render()
Service.render()
Mileage.render()
Costs.render()
Analytics.update()
}
}
window.onload=App.init

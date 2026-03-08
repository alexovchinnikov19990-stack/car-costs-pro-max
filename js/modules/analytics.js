
const Analytics={
update(){
const fuel=Storage.get("fuel")
const service=Storage.get("service")
const costs=Storage.get("costs")
const mileage=Storage.get("mileage")

let fuelCost=0
fuel.forEach(f=>fuelCost+=f.liters*f.price)

let serviceCost=0
service.forEach(s=>serviceCost+=s.cost)

let otherCost=0
costs.forEach(c=>otherCost+=c.value)

const total=fuelCost+serviceCost+otherCost
totalCost.textContent=total.toFixed(2)

if(mileage.length>1){
const km=mileage[mileage.length-1].value - mileage[0].value
totalKm.textContent=km
if(km>0) costPerKm.textContent=(total/km).toFixed(2)
}

Analytics.charts(fuelCost,serviceCost,otherCost,fuel)
},

charts(fuelCost,serviceCost,otherCost,fuel){
const ctx=document.getElementById("structureChart")
if(ctx){
new Chart(ctx,{type:"pie",data:{labels:["Fuel","Service","Other"],datasets:[{data:[fuelCost,serviceCost,otherCost]}]}})
}

const monthly={}
fuel.forEach(f=>{
const m=f.date.slice(0,7)
if(!monthly[m]) monthly[m]=0
monthly[m]+=f.liters*f.price
})

const ctx2=document.getElementById("fuelMonthlyChart")
if(ctx2){
new Chart(ctx2,{type:"bar",data:{labels:Object.keys(monthly),datasets:[{label:"Fuel cost",data:Object.values(monthly)}]}})
}
}
}


const Fuel={
add(){
const item={date:fuelDate.value,liters:Number(fuelLiters.value),price:Number(fuelPrice.value),mileage:Number(fuelMileage.value),type:fuelType.value}
const list=Storage.get("fuel")
list.push(item)
Storage.set("fuel",list)
Fuel.render()
Analytics.update()
},
render(){
const list=Storage.get("fuel")
fuelList.innerHTML=""
list.forEach(i=>{
const li=document.createElement("li")
li.textContent=`${i.date} | ${i.liters}L | ${i.price}`
fuelList.appendChild(li)
})
}
}

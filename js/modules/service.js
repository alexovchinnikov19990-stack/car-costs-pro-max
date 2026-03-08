
const Service={
add(){
const item={date:serviceDate.value,name:serviceName.value,cost:Number(serviceCost.value),mileage:Number(serviceMileage.value)}
const list=Storage.get("service")
list.push(item)
Storage.set("service",list)
Service.render()
Analytics.update()
},
render(){
const list=Storage.get("service")
serviceList.innerHTML=""
list.forEach(i=>{
const li=document.createElement("li")
li.textContent=`${i.date} | ${i.name} | ${i.cost}`
serviceList.appendChild(li)
})
}
}

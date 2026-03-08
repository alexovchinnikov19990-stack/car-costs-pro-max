
const Costs={
add(){
const item={date:costDate.value,name:costName.value,value:Number(costValue.value)}
const list=Storage.get("costs")
list.push(item)
Storage.set("costs",list)
Costs.render()
Analytics.update()
},
render(){
const list=Storage.get("costs")
costList.innerHTML=""
list.forEach(i=>{
const li=document.createElement("li")
li.textContent=`${i.date} | ${i.name} | ${i.value}`
costList.appendChild(li)
})
}
}

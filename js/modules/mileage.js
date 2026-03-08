
const Mileage={
add(){
const item={date:mileageDate.value,value:Number(mileageValue.value)}
const list=Storage.get("mileage")
list.push(item)
Storage.set("mileage",list)
Mileage.render()
Analytics.update()
},
render(){
const list=Storage.get("mileage")
mileageList.innerHTML=""
list.forEach(i=>{
const li=document.createElement("li")
li.textContent=`${i.date} | ${i.value}`
mileageList.appendChild(li)
})
}
}

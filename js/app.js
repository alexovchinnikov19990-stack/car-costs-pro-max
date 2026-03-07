document.addEventListener("DOMContentLoaded",()=>{

loadState()

renderTables()

updateDashboard()

renderChart()

})

function addFuel(){

let date = prompt("Дата")
let liters = Number(prompt("Литры"))
let price = Number(prompt("Цена за литр"))

let sum = liters * price

state.fuel.push({date,liters,price,sum})

saveState()

renderTables()

updateDashboard()

renderChart()

}

function addService(){

let date = prompt("Дата")
let desc = prompt("Описание")
let price = Number(prompt("Цена"))

state.service.push({date,desc,price})

saveState()

renderTables()

updateDashboard()

renderChart()

}

function addOther(){

let date = prompt("Дата")
let desc = prompt("Описание")
let price = Number(prompt("Цена"))

state.other.push({date,desc,price})

saveState()

renderTables()

updateDashboard()

renderChart()

}

function renderTables(){

let fuelBody = document.querySelector("#fuelTable tbody")
fuelBody.innerHTML=""

state.fuel.forEach(f=>{

fuelBody.innerHTML += `
<tr>
<td>${f.date}</td>
<td>${f.liters}</td>
<td>${f.price}</td>
<td>${f.sum}</td>
</tr>
`

})

let serviceBody = document.querySelector("#serviceTable tbody")
serviceBody.innerHTML=""

state.service.forEach(s=>{

serviceBody.innerHTML += `
<tr>
<td>${s.date}</td>
<td>${s.desc}</td>
<td>${s.price}</td>
</tr>
`

})

let otherBody = document.querySelector("#otherTable tbody")
otherBody.innerHTML=""

state.other.forEach(o=>{

otherBody.innerHTML += `
<tr>
<td>${o.date}</td>
<td>${o.desc}</td>
<td>${o.price}</td>
</tr>
`

})

}

function showTab(tab){

document.querySelectorAll(".tab").forEach(el=>{
el.classList.remove("active")
})

document.getElementById(tab).classList.add("active")

}

function updateDashboard(){

document.getElementById("totalCost").innerText = getTotalCost()

document.getElementById("fuelCost").innerText = getFuelCost()

document.getElementById("serviceCost").innerText = getServiceCost()

document.getElementById("costPerKm").innerText = getCostPerKm()

}

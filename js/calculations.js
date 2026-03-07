function getTotalCost(){

let fuel = state.fuel.reduce((a,b)=>a+b.sum,0)
let service = state.service.reduce((a,b)=>a+b.price,0)
let other = state.other.reduce((a,b)=>a+b.price,0)

return fuel + service + other

}

function getFuelCost(){

return state.fuel.reduce((a,b)=>a+b.sum,0)

}

function getServiceCost(){

return state.service.reduce((a,b)=>a+b.price,0)

}

function getCostPerKm(){

if(state.mileage===0) return 0

return (getTotalCost()/state.mileage).toFixed(2)

}

let chart

function renderChart(){

const ctx = document.getElementById('costChart')

let fuel = getFuelCost()
let service = getServiceCost()
let other = state.other.reduce((a,b)=>a+b.price,0)

if(chart) chart.destroy()

chart = new Chart(ctx, {

type: 'pie',

data: {

labels: ['Fuel','Service','Other'],

datasets:[{

data:[fuel,service,other]

}]

}

})

}

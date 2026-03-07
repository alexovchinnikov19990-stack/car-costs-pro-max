function saveState(){

localStorage.setItem("carState", JSON.stringify(state))

}

function loadState(){

const data = localStorage.getItem("carState")

if(data){

state = JSON.parse(data)

}

}

function init(){
const searchState=document.querySelector('#search-state')
searchState.addEventListener('submit',e=>{
    e.preventDefault()
    const inputState=document.querySelector('#input-state') 
    console.log(inputState.value) 
})
searchState.addEventListener('submit',e=>{
    e.preventDefault()
    const inputCity=document.querySelector('#input-city') 
    console.log(inputCity.value) 
})
}
document.addEventListener("DOMContentLoaded", init);
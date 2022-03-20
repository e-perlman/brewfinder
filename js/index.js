function init(){
const searchForm=document.querySelector('#search-form')
searchForm.addEventListener('submit',e=>{
    e.preventDefault()
    const inputState=document.querySelector('#input-state').value
    const inputCity=document.querySelector('#input-city').value 
    const inputKeyword=document.querySelector('#input-keyword').value

    searchBy(inputState,inputCity,inputKeyword)
})
function searchBy(state,city,keyword){
    //Order of specific search: keyword,city,state
    // Only a keyword is inputted
    if (keyword.length>0&&city.length===0&&state.length===0){
        fetchKeyword(keyword.toLowerCase())
    }
    //Keyword and city inputted (state doesn't matter), search by keyword and refine by city
    else if(keyword.length>0&&city.length>0){
        formatSearch(city.toLowerCase())
        //console.log(`${keyword} ${city}`)
    }
    //Only keyword and state is inputted, search by keyword and refine by state
    else if(keyword.length>0&&city.length===0&&state.length>0){
        formatSearch(state.toLowerCase())
        //console.log(`${keyword} ${state}`)
    }
    //Only city inputted (state doesn't matter)
    else if(keyword.length===0&&city.length>0){
        formatSearch(city.toLowerCase())
        //console.log(city)
    }
    //Only state inputted
    else if(keyword.length===0&&city.length==0&&state.length>0){
        formatSearch(state.toLowerCase())
        //console.log(state)
    }
    else{
        console.log('need more info!')
    }
}
function formatSearch(input){
    console.log(input.replaceAll(' ','_'))
    
}
function fetchKeyword(keyword){
    fetch(`https://api.openbrewerydb.org/breweries/search?query=${keyword}`)
    .then(res=>res.json())
    .then(brewery=>listBrewery(brewery))
}
function fetchCity(city){
    fetch(`https://api.openbrewerydb.org/breweries?by_city=${city}`)
    .then(res=>res.json())
    .then(brewery=>listBrewery(brewery))
}
function fetchState(state){
    fetch(`https://api.openbrewerydb.org/breweries?by_state=${state}`)
    .then(res=>res.json())
    .then(brewery=>listBrewery(brewery))
}
}
document.addEventListener("DOMContentLoaded", init);
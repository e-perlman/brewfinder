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
    const formatState=formatSearch(state.toLowerCase())
    const formatCity=formatSearch(city.toLowerCase())
    const formatKeyword=formatSearch(keyword.toLowerCase())
    //Order of specific search: keyword,city,state
    
    // Only a keyword is inputted
    if (keyword.length>0&&city.length===0&&state.length===0){
        fetchKeyword(formatKeyword)
    }
    //Only keyword and city inputted, search by keyword and refine by city
    else if(keyword.length>0&&city.length>0&&state.length===0){
        fetchKeyword(formatKeyword,formatCity,)  
    }
    //Only keyword and state is inputted, search by keyword and refine by state
    else if(keyword.length>0&&city.length===0&&state.length>0){
        fetchKeyword(formatKeyword,formatState)
    }
    //Keyword,city and state, search by keyword and refine by city and state
    else if(keyword.length>0&&city.length>0&&state.length>0){
        fetchKeyword(formatKeyword,formatCity,formatState)  
    }
    //Only city inputted
    else if(keyword.length===0&&city.length>0&&state.length===0){
        fetchCity(formatCity)
    }
    //Only state inputted
    else if(keyword.length===0&&city.length==0&&state.length>0){
        fetchState(formatState)
    }
    //Only city and state inputted, search by city filter by state
    else if(keyword.length===0&&city.length>0&&state.length>0){
        fetchCity(formatCity,formatState)
    }
    else{
        console.log('need more info!')
    }
}
function formatSearch(input){
    console.log(input.replaceAll(' ','_'))
    
}
function fetchKeyword(keyword,city,state){
    fetch(`https://api.openbrewerydb.org/breweries/search?query=${keyword}`)
    .then(res=>res.json())
    .then(brewery=>listBrewery(brewery))
}
function fetchCity(city,state){
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
function init(){
const searchForm=document.querySelector('#search-form')
searchForm.addEventListener('submit',e=>{
    e.preventDefault()
    const inputState=document.querySelector('#input-state').value
    const inputCity=document.querySelector('#input-city').value 
    const inputKeyword=document.querySelector('#input-keyword').value

    searchBy(inputState,inputCity,inputKeyword)
})
function formatSearch(input){
    return input.replaceAll(' ','_')  
}
function unFormatSearch(input){
    return input.replaceAll('_',' ')
}
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
        fetchKeyword(formatKeyword,formatCity,formatState)  
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

function fetchKeyword(keyword,city,state){
    console.log(keyword)
    console.log(city)
    console.log(state)
    fetch(`https://api.openbrewerydb.org/breweries/search?query=${keyword}`)
    .then(res=>res.json())
    .then(brewery=>listBrewery(brewery))
}
function fetchCity(city,state){
    fetch(`https://api.openbrewerydb.org/breweries?by_city=${city}`)
    .then(res=>res.json())
    .then(breweries=>{
        breweries.forEach(brewery=>{
            if (state===undefined){
                listBrewery(brewery)
            }
            else{
                const unFormatState=unFormatSearch(state)
                if (unFormatState.toUpperCase()==brewery.state.toUpperCase()){
                    listBrewery(brewery)
                }
                else{}
            }
        })
    })
}
function fetchState(state){
    fetch(`https://api.openbrewerydb.org/breweries?by_state=${state}`)
    .then(res=>res.json())
    .then(breweries=>breweries.forEach(brewery=>listBrewery(brewery)))
}
function listBrewery(brewery){
    const breweryName=document.createElement('li')
    breweryName.textContent=brewery.name
    document.querySelector('#beer-list').appendChild(breweryName)

    breweryName.addEventListener('click',()=>{
        const displayDetails=document.querySelector('#show-detail')
        while(displayDetails.firstChild){
            displayDetails.removeChild(displayDetails.firstChild)
        }
        showDetails(brewery)
    })
    
}
function showDetails(brewery){
    const name=document.createElement('h2')
    name.textContent=brewery.name

    const breweryType=document.createElement('h3')
    breweryType.textContent=`Brewery Type: ${brewery['brewery_type']}`

    const address=document.createElement('h4')
    address.textContent=`Address: ${brewery.street} ${brewery.city}, ${brewery.state} ${brewery['postal_code']}`

    const phone =document.createElement('h4')
    phone.textContent=`Phone Number: ${brewery.phone}`

    const favoriteButton=document.createElement('button')
    favoriteButton.textContent='Add to Favorites'
    favoriteButton.addEventListener('click',()=>{
        addFavorite(brewery)
    })
document.querySelector('#show-detail').append(name,breweryType,address,phone,favoriteButton)
}
function addFavorite(brewery){
    const favBrew=document.createElement('div')
    favBrew.id=brewery.name

    const name=document.createElement('h2')
    name.textContent=brewery.name
    
    const deleteButton=document.createElement('button')
    deleteButton.textContent='Remove from Favorites'
    deleteButton.addEventListener('click',()=>{
        favBrew.remove()
    })
    favBrew.append(name,deleteButton)
    document.querySelector('#favorites').appendChild(favBrew)
}
}
document.addEventListener("DOMContentLoaded", init);
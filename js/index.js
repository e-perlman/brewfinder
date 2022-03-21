function init(){
const searchForm=document.querySelector('#search-form')
searchForm.addEventListener('submit',e=>{
    e.preventDefault()
    const inputState=document.querySelector('#input-state').value
    const inputCity=document.querySelector('#input-city').value 
    const inputKeyword=document.querySelector('#input-keyword').value
    const inputType=document.querySelector('#beer-type').value

    searchBy(inputState,inputCity,inputKeyword,inputType)
})
function formatSearch(input){
    return input.replaceAll(' ','_')  
}
function unFormatSearch(input){
    return input.replaceAll('_',' ')
}
function searchBy(state,city,keyword,type){
    const formatState=formatSearch(state.toLowerCase())
    const formatCity=formatSearch(city.toLowerCase())
    const formatKeyword=formatSearch(keyword.toLowerCase())
    //Order of specific search: keyword,type,city,state
    
    //keyword inputted
    if (keyword.length>0){
        fetchKeyword(formatKeyword,formatCity,formatState,type)
    }
    // //type but no keyword
    // else if(keyword.length===0&&type!=='none'){
    //     fetchType(type,formatCity,formatState)
    // }
    //city no keyword
    else if(keyword.length===0&&city.length>0){
        fetchCity(formatCity,formatState,type)
    }
    //Only state inputted
    else if(keyword.length===0&&city.length==0&&state.length>0){
        fetchState(formatState,type)
    }
    else{
        console.log('need more info!')
    }
}

function fetchKeyword(keyword,city,state,type){
    fetch(`https://api.openbrewerydb.org/breweries/search?query=${keyword}`)
    .then(res=>res.json())
    .then(breweries=>{
        breweries.forEach(brewery=>{
            if (state.length===0&&city.length===0){
                if(type==='none'){listBrewery(brewery)}
                else if(brewery['brewery_type']===type){listBrewery(brewery)}
            }
            else if (state.length===0){
                const unFormatCity=unFormatSearch(city)
                if (typeof brewery.city==='string'&& unFormatCity.toUpperCase()===brewery.city.toUpperCase()){
                    if(type==='none'){listBrewery(brewery)}
                    else if(brewery['brewery_type']===type){listBrewery(brewery)}
                }
                else{console.log('no results')}
            }
            else if (city.length===0){
                const unFormatState=unFormatSearch(state)
                if (typeof brewery.state==='string'&& unFormatState.toUpperCase()===brewery.state.toUpperCase()){
                    if(type==='none'){listBrewery(brewery)}
                    else if(brewery['brewery_type']===type){listBrewery(brewery)}
                }
                else{console.log('no results')}
            }
            else{
                const unFormatState=unFormatSearch(state)
                const unFormatCity=unFormatSearch(city)
                if (typeof brewery.city==='string' && typeof brewery.state==='string'&& unFormatCity.toUpperCase()===brewery.city.toUpperCase()&&unFormatState.toUpperCase()===brewery.state.toUpperCase()){
                    if(type==='none'){listBrewery(brewery)}
                    else if(brewery['brewery_type']===type){listBrewery(brewery)}
                }
                else{console.log('no results')}
            }
        })
    })
}
function fetchCity(city,state,type){
    fetch(`https://api.openbrewerydb.org/breweries?by_city=${city}`)
    .then(res=>res.json())
    .then(breweries=>{
        breweries.forEach(brewery=>{
            if (state.length===0){
                if(type==='none'){listBrewery(brewery)}
                else if(brewery['brewery_type']===type){listBrewery(brewery)}
            }
            else{
                const unFormatState=unFormatSearch(state)
                if (typeof brewery.state==='string'&& unFormatState.toUpperCase()===brewery.state.toUpperCase()){
                    if(type==='none'){listBrewery(brewery)}
                    else if(brewery['brewery_type']===type){listBrewery(brewery)}
                }
                else{console.log('no results')}
            }
        })
    })
}
function fetchState(state,type){
    fetch(`https://api.openbrewerydb.org/breweries?by_state=${state}`)
    .then(res=>res.json())
    .then(breweries=>breweries.forEach(brewery=>{
        if(type==='none'){listBrewery(brewery)}
        else if(brewery['brewery_type']===type){listBrewery(brewery)}
    }))
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
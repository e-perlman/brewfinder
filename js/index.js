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
    //city no keyword
    else if(keyword.length===0&&city.length>0){
        fetchCity(formatCity,formatState,type)
    }
    //Only state inputted
    else if(keyword.length===0&&city.length==0&&state.length>0){
        fetchState(formatState,type)
    }
    else if(keyword.length===0&&city.length==0&&state.length==0&&type!=='none'){
        fetchType(type)
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
function fetchType(type){
    fetch(`https://api.openbrewerydb.org/breweries?by_type=${type}`)
    .then(res=>res.json())
    .then(breweries=>breweries.forEach(brewery=>listBrewery(brewery)))
}
function listBrewery(brewery){
    const breweryName=document.createElement('button')
    breweryName.textContent=brewery.name
    breweryName.className='list-group-item list-group-item-action bg-dark text-white'
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
    const card=document.createElement('div')
    card.className='card-body'

    const name=document.createElement('h4')
    name.textContent=brewery.name
    name.className='card-title'

    const breweryType=document.createElement('h5')
    breweryType.textContent=`Brewery Type: ${brewery['brewery_type']}`
    breweryType.className='card-subtitle mb-2 text-muted'

    const address=document.createElement('p')
    address.innerText=`Address: ${brewery.street} \n${brewery.city}, ${brewery.state} ${brewery['postal_code']}`
    address.className='card-text'

    const phone =document.createElement('p')
    phone.textContent=`Phone: ${brewery.phone}`
    phone.className='card-text'

    const favoriteButton=document.createElement('button')
    favoriteButton.textContent='Favorite '
    favoriteButton.className='btn btn-secondary'

    const heart=document.createElement('i')
    heart.className='bi-heart'
    heart.id='fav-heart'
    favoriteButton.appendChild(heart)

    favoriteButton.addEventListener('click',()=>{
        addFavorite(brewery)
        heart.className='bi-heart-fill'
    })
    card.append(name,breweryType,address,phone,favoriteButton)
    document.querySelector('#show-detail').appendChild(card)
}
function addFavorite(brewery){
    const favBrew=document.createElement('li')
    favBrew.id=brewery.name
    // favBrew.className='list-group-item p-1 d-inline-flex justify-content-center align-tems-center bg-dark text-white'
    //favBrew.className='list-group-item p-0 m-0 d-inline-flex bg-dark text-white'
    favBrew.className='list-group-item p-0 mr-0 bg-dark text-white'



    const name=document.createElement('h6')
    name.textContent=brewery.name
    name.className='float-left'
    
    const deleteButton=document.createElement('button')
    deleteButton.className='btn btn-secondary mr-0 float-right'

    const trash=document.createElement('i')
    trash.className='bi-trash'
    deleteButton.appendChild(trash)

    const heart=document.querySelector('#fav-heart')

    deleteButton.addEventListener('click',()=>{
        favBrew.remove()
        heart.className='bi-heart'
    })
    favBrew.append(name,deleteButton)
    document.querySelector('#favorites').appendChild(favBrew)
}
}
document.addEventListener("DOMContentLoaded", init);

function init(){
//Search form with submit event listener
const searchForm=document.querySelector('#search-form')
searchForm.addEventListener('submit',e=>{
    e.preventDefault()
    const inputState=document.querySelector('#input-state').value
    const inputCity=document.querySelector('#input-city').value 
    const inputKeyword=document.querySelector('#input-keyword').value
    const inputType=document.querySelector('#beer-type').value

    searchBy(inputState,inputCity,inputKeyword,inputType)
})
//Formats search input for API endpoint
function formatSearch(input){
    return input.replaceAll(' ','_')  
}
//Formats search input for API object comparison
function unFormatSearch(input){
    return input.replaceAll('_',' ')
}
//Based on search terms entered, determines what fetch API endpoint to use
function searchBy(state,city,keyword,type){
    const formatState=formatSearch(state.toLowerCase())
    const formatCity=formatSearch(city.toLowerCase())
    const formatKeyword=formatSearch(keyword.toLowerCase())
    //Order of specific search: keyword,type,city,state
    
    //A keyword is inputted
    if (keyword.length>0){
        fetchKeyword(formatKeyword,formatCity,formatState,type)
    }
    //A city but no keyword inputted
    else if(keyword.length===0&&city.length>0){
        fetchCity(formatCity,formatState,type)
    }
    //Only a state inputted
    else if(keyword.length===0&&city.length==0&&state.length>0){
        fetchState(formatState,type)
    }
    // Only a type inputted that is not 'none'
    else if(keyword.length===0&&city.length==0&&state.length==0&&type!=='none'){
        fetchType(type)
    }
    // Nothing is inputted, alert prompted
    else{
        window.alert("Please provide at least one search parameter!");
    }
}
//Fetch by keyword endpoint
function fetchKeyword(keyword,city,state,type){
    fetch(`https://api.openbrewerydb.org/breweries/search?query=${keyword}`)
    .then(res=>res.json())
    .then(breweries=>{
        breweries.forEach(brewery=>{
            if (state.length===0&&city.length===0){ //Only keyword is entered
                if(type==='none'){listBrewery(brewery)} //No type is selected
                else if(brewery['brewery_type']===type){listBrewery(brewery)} //Type is selected
            }
            else if (state.length===0){ //Keyword and city is entered, no state
                const unFormatCity=unFormatSearch(city)
                if (typeof brewery.city==='string'&& unFormatCity.toUpperCase()===brewery.city.toUpperCase()){ //Filter out any null
                    if(type==='none'){listBrewery(brewery)}//No type is selected
                    else if(brewery['brewery_type']===type){listBrewery(brewery)} //Type is selected
                }
            }
            else if (city.length===0){ //Keyword and state entered, no city
                const unFormatState=unFormatSearch(state)
                if (typeof brewery.state==='string'&& unFormatState.toUpperCase()===brewery.state.toUpperCase()){ //Filter out any null
                    if(type==='none'){listBrewery(brewery)} //No type is selected
                    else if(brewery['brewery_type']===type){listBrewery(brewery)} //Type is selected
                }
            }
            else{ //Keyword, city and state entered
                const unFormatState=unFormatSearch(state)
                const unFormatCity=unFormatSearch(city)
                if (typeof brewery.city==='string' && typeof brewery.state==='string'&& unFormatCity.toUpperCase()===brewery.city.toUpperCase()&&unFormatState.toUpperCase()===brewery.state.toUpperCase()){ //Filter out any null
                    if(type==='none'){listBrewery(brewery)} //No type is selected
                    else if(brewery['brewery_type']===type){listBrewery(brewery)} //Type is selected
                }
            }
        })
    })
}
//Fetch by city endpoint
function fetchCity(city,state,type){
    fetch(`https://api.openbrewerydb.org/breweries?by_city=${city}`)
    .then(res=>res.json())
    .then(breweries=>{
        breweries.forEach(brewery=>{
            if (state.length===0){ //Only city entered, no keyword or state 
                if(type==='none'){listBrewery(brewery)} //No type is selected
                else if(brewery['brewery_type']===type){listBrewery(brewery)} //type is selected
            }
            else{
                const unFormatState=unFormatSearch(state) //City and state entered, no keyword
                if (typeof brewery.state==='string'&& unFormatState.toUpperCase()===brewery.state.toUpperCase()){ //Filter out null
                    if(type==='none'){listBrewery(brewery)} //No type is selected
                    else if(brewery['brewery_type']===type){listBrewery(brewery)} //Type is selected
                }
            }
        })
    })
}
//Fetch by state endpoint
function fetchState(state,type){
    fetch(`https://api.openbrewerydb.org/breweries?by_state=${state}`)
    .then(res=>res.json())
    .then(breweries=>breweries.forEach(brewery=>{ //Only state entered, no city or keyword
        if(type==='none'){listBrewery(brewery)} //No type is selected
        else if(brewery['brewery_type']===type){listBrewery(brewery)} //Type is selected
    }))
}
//Fetch by type endpoint
function fetchType(type){ //Only type inputted, no keyword, city or state
    fetch(`https://api.openbrewerydb.org/breweries?by_type=${type}`)
    .then(res=>res.json())
    .then(breweries=>breweries.forEach(brewery=>listBrewery(brewery)))
}
//Lists the breweries as buttons in an ul in the first column

function listBrewery(brewery){
    const breweryName=document.createElement('button')
    breweryName.textContent=brewery.name
    breweryName.className='brewery list-group-item list-group-item-action bg-dark text-white'
    document.querySelector('#beer-list').appendChild(breweryName)
    breweryName.addEventListener('click',()=>{ //When specific brewery is clicked
        const displayDetails=document.querySelector('#show-detail') 
        while(displayDetails.firstChild){ //If a brewery in the ul is clicked, #show-detail contents clears
            displayDetails.removeChild(displayDetails.firstChild)
        }
        showDetails(brewery)//Shows brewery details
    })
}

//Shows brewery details as a card in the second column
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

    favoriteButton.addEventListener('click',()=>{ //When favorite button is clicked, brewery is added to favorites list and heart is filled
        addFavorite(brewery)
        heart.className='bi-heart-fill'
    })
    card.append(name,breweryType,address,phone,favoriteButton)
    document.querySelector('#show-detail').appendChild(card)
}
//Adds brewery to favorites list
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

    const trash=document.createElement('i') //Delete from favorties button
    trash.className='bi-trash'
    deleteButton.appendChild(trash)

    const heart=document.querySelector('#fav-heart')

    deleteButton.addEventListener('click',()=>{ //When delete button is selected, brewery is removed from fav list and heart is unfilled
        favBrew.remove()
        heart.className='bi-heart'
    })
    favBrew.append(name,deleteButton)
    document.querySelector('#favorites').appendChild(favBrew)
} 
}
document.addEventListener("DOMContentLoaded", init);

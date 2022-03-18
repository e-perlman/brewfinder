function init(){
const searchForm=document.querySelector('#search-form')
searchForm.addEventListener('submit',e=>{
    e.preventDefault()
    const inputState=document.querySelector('#input-state').value
    const inputCity=document.querySelector('#input-city').value 
    const inputKeyword=document.querySelector('#input-keyword').value

    getList(inputState,inputCity,inputKeyword)
})
function getList(state,city,keyword){
    //Order of specific search: keyword,city,state
    // Only a keyword is inputted
    if (keyword.length>0&&city.length===0&&state.length===0){
        console.log(keyword)
    }
    //Keyword and city inputted (state doesn't matter), search by keyword and refine by city
    else if(keyword.length>0&&city.length>0){
        console.log(`${keyword} ${city}`)
    }
    //Only keyword and state is inputted, search by keyword and refine by state
    else if(keyword.length>0&&city.length===0&&state.length>0){
        console.log(`${keyword} ${state}`)
    }
    //Only city inputted (state doesn't matter)
    else if(keyword.length===0&&city.length>0){
        console.log(city)
    }
    //Only state inputted
    else if(keyword.length===0&&city.length==0&&state.length>0)
        console.log(state)
    else{
        console.log('need more info!')
    }
}
}
document.addEventListener("DOMContentLoaded", init);
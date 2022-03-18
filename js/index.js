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
    if (keyword.length>0){
        console.log(keyword)
    }
    else if(keyword.length===0&&city.length>0){
        console.log(city)
    }
    else if(keyword.length===0&&city.length==0&&state.length>0)
        console.log(state)
    else{
        console.log('need more info!')
    }
}
}
document.addEventListener("DOMContentLoaded", init);
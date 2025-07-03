document.getElementById("tests__button").addEventListener("click",(event)=>{
    event.preventDefault();
    window.location.href = window.location.href.replace(/\/[^\/]*$/, "/nmt");
})
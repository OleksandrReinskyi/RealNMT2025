const tabs = document.querySelectorAll(".tab");
const tabTitles = document.querySelectorAll(".tab__title");



window.addEventListener("click",(event)=>{
    const target = event.target;
    let tabId = target.getAttribute("data-for");
    if(tabId){
        tabs.forEach((item)=>{
            item.classList.remove("active")
        })
        tabTitles.forEach((item)=>{
            item.classList.remove("active")
        })
        document.getElementById(tabId).classList.add("active");
        target.classList.add("active");
    }
})
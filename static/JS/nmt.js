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


const instrConfirmationButton = document.getElementById("instr__confirm");
const instrQuestion = document.getElementById("instr__question");
const instrFollowUp = document.getElementById("instr__followup");

function sosavDown(event){
    instrQuestion.classList.add("active")
    instrConfirmationButton.classList.add("active")
    instrConfirmationButton.removeEventListener("mousedown",sosavDown)
}

function sosavUp(event){
    if(instrQuestion.classList.contains("active")){
        instrFollowUp.classList.add("active")
        document.removeEventListener("mouseup",sosavUp)
        instrConfirmationButton.classList.add("clicked")

    }
}

instrConfirmationButton.addEventListener("mousedown",sosavDown)
document.addEventListener("mouseup",sosavUp)

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

let confirmationIndex = 1;
const testBlocks = document.querySelectorAll("[data-num]")

document.addEventListener("click",(event)=>{
    let target = event.target;
    if(target.classList.contains("test__next")){
        testBlocks.forEach((item)=>{
            item.classList.remove("active")
        })
        testBlocks[confirmationIndex].classList.add("active");
        confirmationIndex++;
    }

    let imageNum = target.getAttribute("data-imgnum");

    if(imageNum){
        target.classList.toggle("active");
    }
})
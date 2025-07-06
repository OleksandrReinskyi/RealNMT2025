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

function wait(ms){
    return new Promise((res,rej)=>{
        setTimeout(()=>{
            res()
        },ms)
    })
}

let confirmationIndex = 1;
const testBlocks = document.querySelectorAll("[data-num]")


instrConfirmationButton.addEventListener("mousedown",sosavDown)
document.addEventListener("mouseup",sosavUp)

const main = document.querySelector("main");

document.addEventListener("click",async (event)=>{
    let target = event.target;
    if(target.classList.contains("test__next")){
        testBlocks.forEach((item)=>{
            item.classList.remove("active")
        })
        testBlocks[confirmationIndex].classList.add("active");
        confirmationIndex++;
        if(confirmationIndex == testBlocks.length){

            await wait(2000);
            
            main.classList.add("hidden");

            await wait(750) 
            main.classList.remove("hidden")

            await wait(250)
            queueMicrotask(()=>{
                for(let i = 0; i<250000;i++){
                    console.log(i)
                }
            })
            
            await wait(250) 
            document.querySelector("body").innerHTML = `
            <h1 id="global-error">Помилка 502: сервер знизу!</h1>
            `
            await wait(3000)
            window.location.href = window.location.href.replace(/\/[^\/]*$/, "/test");
        }
    }

    let imageNum = target.getAttribute("data-imgnum");

    if(imageNum){
        target.classList.toggle("active");
    }
})
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

async function moveToNextBlock(){
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

        await wait(1000)
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

document.addEventListener("click",async (event)=>{
    let target = event.target;
    if(target.classList.contains("test__next")){
        moveToNextBlock()
    }

    let imageNum = target.getAttribute("data-imgnum");
    if(imageNum){
        target.closest(".captcha__img").classList.toggle("active");
    }
})

const headerPacks = document.querySelectorAll(".header__pack")
const bodyPacks = document.querySelectorAll(".captcha__pack");

let packShown = 0;
let confirmationPassed = false;

document.querySelector("#captcha__button").addEventListener("click",(event)=>{
    if(packShown == headerPacks.length-1){
        confirmationPassed = true;
        document.querySelector("#confirmation__button").classList.add("test__next");
        document.querySelector("#captcha__checkbox").classList.add("checked")
        document.querySelector("#captcha__container").classList.remove("active");
        event.preventDefault();
    }
    if(packShown==headerPacks.length-2){
        document.querySelector("#captcha__warning").classList.add("active")
    }
    packShown++;
    for(let i = 0; i<headerPacks.length; i++){
        if(packShown == i){
            headerPacks[i].classList.add("active")
            bodyPacks[i].classList.add("active")
        }else{
            headerPacks[i].classList.remove("active")
            bodyPacks[i].classList.remove("active")
        }
    }
})

document.querySelector("#confirmation__button").addEventListener("click",(event)=>{
    if(!confirmationPassed){
        document.querySelector("#captcha__checkbox").classList.add("warning")
    }
})

let captchaCheckboxFunc = (event)=>{
    document.querySelector("#captcha__container").classList.add("active");
    headerPacks[packShown].classList.add("active")
    bodyPacks[packShown].classList.add("active")
    event.target.classList.add("active");
    document.querySelector("#captcha__checkbox").removeEventListener("click",captchaCheckboxFunc)
}

document.querySelector("#captcha__checkbox").addEventListener("click",captchaCheckboxFunc)

document.querySelector("#start__button").addEventListener("click",(event)=>{
    let value = document.querySelector("#start__input").value;
    if(value == "75640883.14!2348((*9461%000022344-"){
        moveToNextBlock()
    }
})
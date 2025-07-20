let pressedKeys = {}

document.addEventListener("keydown",(event)=>{
    pressedKeys[event.code] = true;
    if(event.code == "F11" || event.code == "F12"){
        if(!pressedKeys["F2"]) event.preventDefault()
    } 
    if(event.code == "Escape") event.preventDefault()
    
}) 

document.addEventListener("keyup",(event)=>{
    delete pressedKeys[event.code];
})

window.addEventListener("contextmenu",(event)=>{
    event.preventDefault()
})


function checkIfLoggedIn(){
    let item = localStorage.getItem("loggedIn")

    if(item){
        if(item.expr < Date.now()){
            localStorage.removeItem("loggedIn")
            if(window.location.pathname != "/"){
                window.location.href = "/"
            }
        }else{
            if(window.location.pathname == "/"){
                window.location.href = "/home"
            }
        }

    }else{
        if(window.location.pathname != "/"){
            window.location.href = "/"
        }
    }
} 

checkIfLoggedIn();
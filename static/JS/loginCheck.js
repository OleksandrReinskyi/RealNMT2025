function checkIfLoggedIn(){
    let item = localStorage.getItem("loggedIn")

    if(item){
        if(item.expr < Date.now()){
            localStorage.removeItem("loggedIn")
            if(window.location.pathname != "/"){
                window.location.href = window.location.href.replace(/\/.+$/g,"/");

            }
        }else{
            if(window.location.pathname == "/"){
               window.location.href = window.location.href.replace(/\/.+$/g,"/home");
            }
        }

    }else{
        if(window.location.pathname != "/"){
            window.location.href = window.location.href.replace(/\/.+$/g,"/");

        }
    }
} 

checkIfLoggedIn();
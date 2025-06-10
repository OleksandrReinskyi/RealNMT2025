const login = "013b12as";
const password = "1@rg3P3n1$";

let loginInput = document.querySelector("#input-login");
let passwordInput = document.querySelector("#input-password");
let loginForm = document.querySelector("#login__form");
let loginError = document.querySelector("#login__error");

let errorMessages = ["Неправильний логін або пароль!","Шановний учаснику, сконцентруйтеся та уведіть дані, надані старшим інструктором. Все буде добре!", "Шановний осел, Ви в якому класі, га, першому?","Альо, Колінька бляха, нармальний пароль, не іспалняй","Але ти баняк, я в шоке..."]
let index = 0;



loginForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    if(loginInput.value == login && passwordInput.value == password){
        logIn();
    }else{
        loginError.innerHTML = errorMessages[index];
        if(index != errorMessages.length){
            index++;
        }
    }
})



function logIn(){
    localStorage.setItem("loggedIn",JSON.stringify({
        expr: Date.now() + 4*60*60*60
    }))
   window.location.href = "/home";
}

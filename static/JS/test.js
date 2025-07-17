/**
 * Functionality
 * 1) Time save 
 * Local storage object every second
 * 2) Answers save 
 * Local storage object every answer save
 * {
 * maths: {id:answer}
 * }
 * 3) Saved answers display on sidebar
 * 
 * Task types
 * 1) With one variant of answer
 * - Plain text
 * - Image 
 * - Image + text
 * Answer - variable with answer ID
 * 2) Numerical input (input text)
 * variable
 * 3) Accordances
 * Answer: [array,array]
 * 4) Sequences
 * Answer: array
 * 5) 3 answers 
 * Answer: array
 * 
 * 
 */

class _Test{
    static idCounter = 0;
    constructor(question,imgPath){
        this.id = _Test.idCounter++;
        this.view = "";
        this.question = question;
        this.img = imgPath;
        
        this.infoBlockBeforeText = "";
        this.sidebarCell = null;
        this.questionInfo = null;
    }

    renderInfoBlock(index,isAnswerSaved){
        if(this.infoBlockBeforeText != ""){
            this.view == `
        <div class="main__block info-block">
            <div class="info-block__text">${this.infoBlockBeforeText}</div>
        </div>`
        }
        
        this.questionInfo = `
            <div class="question__info">
                <div class="question__title">${this.question}</div>
                ${this.img ? `<img class="question__img" src="${this.imgPath}">` :""} 
            </div>
        `

        this.sidebarCell = `
            <a class="side__cell ${isAnswerSaved ? "active" : ""}" data-sideTest-id="${this.id}" href="#test-block__${this.id}">
                ${index}
            </a>
        `
    }
}

class SingleAnswer extends _Test{
    constructor(question,answers,imgPath){
        super(question,imgPath);
        this.answers = answers;
    }

    renderView(index,selectedAnswerId){

        let answersString = ``;

        for(let i of this.answers){
            answersString += `
             <div class="form__block">
                <input class="sin-an__input" type="radio" name="${this.id}-answ" id="sin-an-${i.id}" data-answ-id="${i.id}" ${selectedAnswerId == i.id ? "checked" : ""}>
                <label for="sin-an-${i.id}" class="sin-an__answer">${i.answer}</label>
            </div>`
        }

        this.view += `
        <div class="main__block test-block sin-an" id="test-block__${this.id}" data-test-id="${this.id}">
            <h2 class="question__number">Завдання ${index+1}</h2>
            ${this.questionInfo}
            <form  class="sin-an__form" onsubmit="return false">
            ${answersString}
                <div class="form__block">
                    <button class="an__save" disabled>Зберегти відповідь</button>
                </div>
            </form>
        </div>
        `


    }

    getChosenAnswerId(parent){
        const selectedAnsw = parent.querySelector(".sin-an__input:checked");
        console.log(selectedAnsw)
        return selectedAnsw.getAttribute("data-answ-id");
    }
}

class _TestsArr{
    static testsArrId = 0;
    constructor(){
        this.id = _TestsArr.testsArrId++;
        this.body = null;
        this.side = null;
        this.contents = [];

        this.answers = JSON.parse(localStorage.getItem(this.id) || "{}");
    }
    
    handleClick(event){
        const target = event.target;

        if(target.classList.contains("an__save")){
            this.saveAnswer(target);
        }

        if(target.getAttribute("data-answ-id")){
            let parent = target.closest(".test-block");
            const questionId = parent.getAttribute("data-test-id");
            let answerButton = parent.querySelector(".an__save");
            if(answerButton.disabled == true){
                this.updateSidebar(questionId,false);
                answerButton.disabled = false;
            }
        }
    }

    renderAll(){
        this.body.innerHTML = "";
        for(let i = 0;i<this.contents.length;i++){
            let item = this.contents[i];
            item.renderInfoBlock(i,Boolean(this.answers[item.id]))
            item.renderView(i,this.answers[item.id]);
            this.body.insertAdjacentHTML("beforeend",item.view)

            this.side.insertAdjacentHTML("beforeend",item.sidebarCell)
        }
    }

    saveAnswer(target){
        if(target.disabled == true) return;
        target.disabled = true;
        
        let parent = target.closest(".test-block");
        const questionId = parent.getAttribute("data-test-id");

        const questionClass = this.contents.find((elem)=>{return elem.id == questionId})
        if(questionClass){
            let answerId = questionClass.getChosenAnswerId(parent);
            this.answers[questionId] = answerId;
        }
        localStorage.setItem(this.id,JSON.stringify(this.answers))
        console.log(this.answers)
        this.updateSidebar(questionId,true)
    }

    updateSidebar(id,toggler){
        let sideBarCell = this.side.querySelector(`[data-sidetest-id="${id}"]`);
        if(toggler){
            sideBarCell.classList.add("active")
        }else{
            sideBarCell.classList.remove("active")
        }
    }

    /**
     * types: 
     * - 1 - sin-an (single)
     * - 2 - open-an
     * - 3 - seq-an (sequence)
     * - 4 - mult-an (multiple)
     * - 5 - accord-an (accordance)
     */

    convertTestsArr(arr){
        for(let i of arr){
            if(i.type==1){
                let answers = [];
                for(let answer of i.answers){
                    answers.push(new Answer(answer))
                }
                this.contents.push(new SingleAnswer(i.question,answers,""))
            }
        }
    }
}

class MathTests extends _TestsArr{
    constructor(contents){
        super(contents);
        this.body = document.querySelector("#main__maths");
        this.side = document.querySelector("#side__maths");
        this.body.addEventListener("click",this.handleClick.bind(this))
    }
}

class HistTests extends _TestsArr{
    constructor(contents){
        super(contents);
        this.body = document.querySelector("#main__hist");
        this.body.addEventListener("click",this.handleClick.bind(this))
    }
}


class Answer{
    static idAnswerCounter = 0;
    constructor(text){
        this.id = Answer.idAnswerCounter++;
        this.answer = text;
    }
}



const testsArray = [
    {
        type:1,
        question: "2+2=...?",
        answers:["2?!!?!?","4","5","1","0"],
        img: null
    },
    {
        type:1,
        question:"",
        answers:[""],
        img:""
    }
]



const mathBlock = new MathTests()
mathBlock.convertTestsArr(testsArray)
mathBlock.renderAll();




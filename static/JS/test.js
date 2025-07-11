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
    constructor(question){
        this.id = _Test.idCounter++;
        this.view = null;
        this.question = question;
        this.correctAnswer = null;
        
        this.infoBlockBeforeText = "";
        this.sidebarCell = null;
    }

    renderInfoBlock(index,isAnswerSaved){
        if(this.infoBlockBeforeText){
            this.view += `
        <div class="main__block info-block">
            <div class="info-block__text">${this.infoBlockBeforeText}</div>
        </div>`
        }

        this.sidebarCell = `
            <div class="side__cell ${isAnswerSaved ? "active" : ""}" data-sideTest-id="${this.id}">
                <p class="cell__text">${index}</p>
            </div>
        `
    }
}

class SingleAnswer extends _Test{
    constructor(question,answers,correct){
        super(question);
        this.answers = answers;
        this.correctAnswer = correct;
    }

    renderView(index){

        let answersString = ``;

        for(let i of this.answers){
            answersString += `
             <div class="form__block">
                <input class="sin-an__input" type="radio" name="${i.id}-answ" id="sin-an-${i.id}">
                <label for="sin-an-${i.id}" class="sin-an__answer">${i.answer}</label>
            </div>`
        }

        this.view += `
    <div class="main__block test-block sin-an" data-test-id="${this.id}">
        <h2 class="question__title">Завдання ${index}</h2>
        <p class="question__question">${this.question}</p>
        <form  class="sin-an__form">
           ${answersString}
            <div class="form__block">
                <button class="sin-an__save" >Зберегти відповідь</button>
            </div>
        </form>
    </div>

        `


    }
}

class _TestsArr{
    static testsArrId = 0;
    constructor(contents){
        this.id = _TestsArr.testsArrId++;
        this.body = null;
        this.contents = contents;

        this.answers = JSON.parse(localStorage.getItem(this.id) || "{}");
    }
    
    handleClick(event){
        //when click saveButton: disable it and save answer
        // when click the test option: enable save button (query selector by id)
        // when click sidebarCell: go to that question 
    }

    renderAll(){
        this.body.innerHTML = "";
        for(let i = 0;i<this.contents.length;i++){
            let item = this.contents[i];
            item.renderInfoBlock(i,Boolean(this.answers[item.id]))
            item.renderView(i);
            this.body.insertAdjacentHTML("beforeend",item.view)

        }
    }

    saveAnswer(){

        localStorage.setItem(this.id,JSON.stringify(this.answers))
    }

    updateSidebar(){

    }
}

class MathTests extends _TestsArr{
    constructor(contents){
        super(contents);
        this.body = document.querySelector("#main__maths");
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
        this.id = Answer.idCounter++;
        this.answer = text;
    }
}


const mathBlock = new MathTests(
    [new SingleAnswer("2+2=...?",[
        new Answer("2?!!?!?"),
        new Answer("4"),
        new Answer("5"),
        new Answer("1"),
        new Answer("0"),
    ],"1")]
)

mathBlock.renderAll();

/**
 * Tasks:
 * 1) Click on sidebar cell
 * 2) Save answer 
 * 3) Correct answer?
 * 4) get answer from local storage
 */
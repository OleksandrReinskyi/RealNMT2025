class Helpers{
    static waitRandTime(coef){
        let ms = Math.random()*coef
        return new Promise((res,rej)=>{
            setTimeout(res,ms)
        })
    }
    static toggleGlobalLoading(){
        document.querySelector("#main__loading").classList.toggle("hidden")
    }
    static async simulateLoadingDecorator(func){
        Helpers.toggleGlobalLoading()
        timer.stop()
        await Helpers.waitRandTime(2000);

        func()

        Helpers.toggleGlobalLoading()
        timer.continue()

    }

    static wait(ms){
        return new Promise((res,rej)=>{
            setTimeout(res,ms)
        })
    }
}



class Timer{
    constructor(time,elem){
        this.time = time; //seconds
        this.stopped = false;
        this.displayElem = elem;
    }
    countdown(){
        if(this.stopped) return;
        this.time -= 1;
        this.renderView()
        localStorage.setItem("timer",String(this.time))
        setTimeout(this.countdown.bind(this),1000)
    }
    
    renderView(){
        let buffer = this.time;
        let hours = Math.floor(buffer/(60*60))
        buffer -= hours*60*60;
        let minutes = Math.floor(buffer/(60))
        buffer -= minutes*60
        this.displayElem.innerText = `
        ${hours<10? ("0"+hours): hours}:${minutes<10? ("0"+minutes): minutes}:${buffer<10? ("0"+buffer): buffer}
        `
    }
    stop(){
        this.stopped = true;
    }

    continue(){
        this.stopped = false
        this.countdown()
    }
}


class _Test{
    static idCounter = 0;
    constructor(question,imgPath,audioPath){
        this.id = _Test.idCounter++;
        this.view = "";
        this.question = question;
        this.img = imgPath;
        this.audio = audioPath;

        this.infoBlockBeforeText = "";
        this.sidebarCell = null;
        this.questionInfo = null;
    }

    renderInfoBlock(index,isAnswerSaved){
        if(this.infoBlockBeforeText){
            this.view = `
        <div class="main__block info-block">
            <h2 class="info-block__text">${this.infoBlockBeforeText}</h2>
        </div>`
        }
        
        this.questionInfo = `
            <div class="question__info">
                <div class="question__title">${this.question}</div>
                ${this.img ? `<img class="question__img" src="${this.img}">` :""}
                ${this.audio ? `<audio controls>
                    <source src="${this.audio}" type="audio/ogg"> </audio>` :""}

            </div>
        `

        this.sidebarCell = `
            <a class="side__cell ${isAnswerSaved ? "active" : ""}" data-sideTest-id="${this.id}" href="#test-block__${this.id}">
                ${index+1}
            </a>
        `
    }
}

class SingleAnswer extends _Test{
    constructor(question,answers,imgPath,audioPath,extraClass){
        super(question,imgPath,audioPath);
        this.answers = answers;
        this.extraClass = extraClass
    }

    renderView(index,selectedAnswerId){

        let answersString = ``;

        for(let i of this.answers){
            answersString += `
             <div class="form__block" data-block-answ-id="${i.id}">
                <input class="sin-an__input" type="radio" name="${this.id}-answ" id="sin-an-${i.id}" data-answ-id="${i.id}" ${selectedAnswerId == i.id ? "checked" : ""}>
                <label for="sin-an-${i.id}" class="sin-an__answer">${i.answer}</label>
            </div>`
        }

        this.view += `
        <div class="main__block test-block sin-an ${this.extraClass} " id="test-block__${this.id} " data-test-id="${this.id}">
            <h1 class="question__number">Завдання ${index+1}</h1>
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
        return selectedAnsw.getAttribute("data-answ-id");
    }
}

class OpenAnswer extends _Test{
    constructor(question,imgPath){
        super(question,imgPath);

    }

    renderView(index,savedAnswer){
        this.view += `
        <div class="main__block test-block open-an" id="test-block__${this.id}" data-test-id="${this.id}">
            <h1 class="question__number">Завдання ${index+1}</h1>
            ${this.questionInfo}
            <form  class="open-an__form" onsubmit="return false">
                <div class="form__block">
                    <input class="open-an__input" type="text" data-latexBlock="latex__${this.id}" value="${savedAnswer || ""}">
                </div>
                <div class="form__block open-an__latex" id="latex__${this.id}">

                </div>
                <div class="form__block">
                    <button class="an__save" disabled>Зберегти відповідь</button>
                </div>
            </form>
        </div>
        `
    }




    getChosenAnswerId(parent){
        const selectedAnsw = parent.querySelector(".open-an__input");
        return selectedAnsw.value;
    }
}

class AccrodanceAnswer extends _Test{
    constructor(question,imgPath,questions,answers,includeImg){
        super(question,imgPath);
        this.questions = questions;
        this.answers = answers;
        this.answersAsImgs = includeImg;
    }

    renderView(index,selectedAnswers){
        let questionStr = '';
        let answerStr = ``;
        for(let i = 0;i< this.questions.length; i++){
            let selectedAnsw = selectedAnswers? this.answers.find((elem)=>elem.id == selectedAnswers[i]): false;
            questionStr += `
            <div class="acc-an__row">
                <div class="row__question">${this.answersAsImgs ? `<img class='acc-an__img' src="${this.questions[i]}"></img>` :this.questions[i]}</div>
                <span class="row__arrow">➝</span>
                <div class="row__place ${selectedAnsw ? "active" : ""}">
                    ${selectedAnsw ? `<div class="acc-an__answer selected" data-answ-id="${this.answers[i].id}" id="acc-an__answer-${selectedAnsw.id}">${selectedAnsw.answer}</div>` : ""}
                    <div class="row__close-container ">
                        <button class="row__close-button">×</button>
                    </div>
                </div>
            </div>
            `
        }

        for(let i = 0;i< this.answers.length; i++){
            if(selectedAnswers && selectedAnswers[i]) continue;
            answerStr += `
                <div class="acc-an__answer" data-answ-id="${this.answers[i].id}" id="acc-an__answer-${this.answers[i].id}">${this.answers[i].answer}</div>
            `
        }

        this.view += `
        <div class="main__block test-block acc-an" id="test-block__${this.id}" data-test-id="${this.id}">
            <h1 class="question__number">Завдання ${index+1}</h1>
            ${this.questionInfo}
            <form onsubmit="return false" class="acc-an__form">
                <div class="form__body">
                    <div class="acc-an__rows">
                        ${questionStr}
                    </div>
                    <div class="acc-an__answers">
                        ${answerStr}
                    </div>
                </div>
                <div class="form__block">
                    <button class="an__save" disabled>Зберегти відповідь</button>
                </div>
            </form>
        </div>
        `
    }

    getChosenAnswerId(parent){
        let answers = [];
        Array.from(parent.querySelectorAll(".acc-an__row")).forEach((row)=>{
            answers.push(row.querySelector(".acc-an__answer.selected")?.getAttribute("data-answ-id") || null) 
        })
        return answers;
    }
}

class MultipleAnswer extends _Test{
    constructor(question,imgPath,answers){
        super(question,imgPath);
        this.answers = answers;
    }

    renderView(index, selectedAnswers){

        let answersString = '';
        for(let i of this.answers){
            answersString += `
             <div class="form__block">
                <input class="mult-an__input" type="checkbox" name="${this.id}-answ" id="mult-an-${i.id}" data-answ-id="${i.id}" ${selectedAnswers?.includes(String(i.id)) ? "checked" : ""}>
                <label for="mult-an-${i.id}" class="mult-an__answer">${i.answer}</label>
            </div>`
        }

        this.view += `
        <div class="main__block test-block mult-an" id="test-block__${this.id}" data-test-id="${this.id}">
            <h1 class="question__number">Завдання ${index+1}</h1>
            ${this.questionInfo}
            <form  class="mult-an__form" onsubmit="return false">
            ${answersString}
                <div class="form__block">
                    <button class="an__save" disabled>Зберегти відповідь</button>
                </div>
            </form>
        </div>
        `

    }

    getChosenAnswerId(parent){
        let arr = []
        Array.from(parent.querySelectorAll(".mult-an__input:checked")).forEach((item)=>{
            arr.push(item.getAttribute("data-answ-id"))
        })
        return arr;
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
            this.unsaveAnswer(target);
        }

        if(target.classList.contains("mult-an__input")){
            let parent = target.closest(".test-block");
            if(parent.querySelectorAll(".mult-an__input:checked").length >= 4) event.preventDefault();
        }

        this.clickOnAccordance(target)

    }

    unsaveAnswer(target){
        let parent = target.closest(".test-block");
        const questionId = parent.getAttribute("data-test-id");
        let answerButton = parent.querySelector(".an__save");
        if(answerButton.disabled == true){
            this.updateSidebar(questionId,false);
            answerButton.disabled = false;
            let questionSavedInfo = parent.querySelector(".question__saved");
            if(questionSavedInfo) questionSavedInfo.remove()
        }
    }

    async handleInput(event){
        const target = event.target;
        const attribute = target.getAttribute("data-latexBlock");

        if(attribute){
            this.unsaveAnswer(target);
            let value = target.value;
            const destination = document.getElementById(`${attribute}`);

            value = value.replace(/√/g,"�")
            value = value.replace(/sqrt/g,"����")
            value = value.replace(/Корінь/g,"����")



            destination.innerHTML = `
            <img src="static/imgs/Page/loading-waiting.gif" alt="">
            `
            await Helpers.waitRandTime(1000);

            destination.innerHTML = `\\[${value}\\]`;
            await MathJax.typesetPromise([destination]);
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

    async saveAnswer(target){
        if(target.disabled == true) return;
        target.disabled = true;
        
        let parent = target.closest(".test-block");
        const questionId = parent.getAttribute("data-test-id");

        const questionClass = this.contents.find((elem)=>{return elem.id == questionId})

        if(questionClass){
            let answerId = questionClass.getChosenAnswerId(parent);
            this.answers[questionId] = answerId;
        }

        target.innerText = "Відправлення на перевірку"

        await Helpers.waitRandTime(1500);
        target.innerText = "Зберегти відповідь"

        localStorage.setItem(this.id,JSON.stringify(this.answers))
        this.updateSidebar(questionId,true)

        parent.insertAdjacentHTML("beforeend",`
        <div class="question__saved">
            <p class="saved__icon">𝐢</p>
            <p class="saved__text">Відповідь збережено</p>
        </div>
            `)
    }

    updateSidebar(id,toggler){
        let sideBarCell = this.side.querySelector(`[data-sidetest-id="${id}"]`);
        if(toggler){
            sideBarCell.classList.add("active")
        }else{
            sideBarCell.classList.remove("active")
        }
    }

    clickOnAccordance(target){
        let parent = target.closest(".test-block");
        let selectedAnswer = parent.querySelector(".acc-an__answer.active");
        if(target.classList.contains("row__place")){
            if(!selectedAnswer || target.querySelector(".acc-an__answer.selected")) return
            
            target.appendChild(selectedAnswer);
            selectedAnswer.classList.remove("active");
            selectedAnswer.classList.add("selected")
            target.classList.add("active")
            this.unsaveAnswer(target)
        }
        if(target.classList.contains("acc-an__answer")){
            if(selectedAnswer) return;
            target.classList.toggle("active");
        }
        if(target.classList.contains("row__close-button")){
            let insertedAnswer = target.closest(".row__place").querySelector(".acc-an__answer.selected");
            parent.querySelector(".acc-an__answers").appendChild(insertedAnswer)
            this.unsaveAnswer(target)
            target.closest(".row__place").classList.remove("active")

        }
    }



    /**
     * types: 
     * - 1 - sin-an (single)
     * - 2 - open-an
     * - 4 - mult-an (multiple)
     * - 5 - accord-an (accordance)
     */

    convertTestsArr(arr){
        for(let i of arr){
            let question;
            if(i.type==1){
                let answers = [];
                for(let answer of i.answers){
                    answers.push(new Answer(answer))
                }
                question = new SingleAnswer(i.question,answers,i.img,i.audio,i.classes||"");
            }else if(i.type == 2){
                question = new OpenAnswer(i.question,i.img)
            }else if(i.type==5){
                let answers = [];
                for(let item of i.answers[1]){
                    answers.push(new Answer(item));
                }

                question = new AccrodanceAnswer(i.question,i.img,i.answers[0],answers,i.questionsImg)
            }else if(i.type == 4){
                let answersArr = [];
                for(let item of i.answers){
                    answersArr.push(new Answer(item))
                }

                question = new MultipleAnswer(i.question,i.img,answersArr)
            }
            question.infoBlockBeforeText = i.blockInfo;
            this.contents.push(question);
        }
    }
}

class MathTests extends _TestsArr{
    constructor(contents){
        super(contents);
        this.body = document.querySelector("#maths__body");
        this.side = document.querySelector("#side__maths");
        this.body.addEventListener("click",this.handleClick.bind(this))
        this.body.addEventListener("input",this.handleInput.bind(this))
    }
}

class HistTests extends _TestsArr{
    constructor(contents){
        super(contents);
        this.body = document.querySelector("#hist__body");
        this.side = document.querySelector("#side__hist");
        this.body.addEventListener("click",this.handleClick.bind(this))
        this.body.addEventListener("input",this.handleInput.bind(this))

    }
}


class Answer{
    static idAnswerCounter = 0;
    constructor(text){
        this.id = Answer.idAnswerCounter++;
        this.answer = text;
    }
}


/**
 * Selecting with hardcoding: 
 * - Running (data-answ-id)
 * -- 
 */



const mathTestsArray = [
    {
        type:1,
        question: "2+2=...?",
        answers:["2?!!?!?","4","5","1"],
        img: null,
        blockInfo: "Завдання 1-7 мають по чотири варіанти відповіді, з яких лише ОДИН правильний. Виберіть правильний, на Вашу думку, варіант відповіді й натисніть курсором на значок ліворуч від нього. Варіант відповіді, позначений Вами, ЗБЕРЕЖІТЬ, натиснувши курсором на кнопку під завданням."
    },
    {
        type:1,
        question:"Комп’ютерна мишка рухається прямолінійно об табуретку за законом \\(S(t) = t^2 + 5t + 1\\) (t вимірюється в секундах, S - у метрах). Визначте швидкість його руху в момент часу \\(t = 4\\) c.",
        answers:["27м/c","10м/c","13м/c","134513463456м/с"]
    },
    {
        type:1,
        question:"Назар дістав з рюкзака цілий бутерброд. До нього підійшов Діма та вкусив цей бутерброд. Скільки відсотків бутерброду залишилося?",
        answers:["88%","46%","12%","-6% (без пальців)"]
    },
        {
        type:1,
        question:"",
        answers:["\\(\\frac{1}{\\pi^2 * \\sqrt{e}}\\)","\\(\\sum_{i=1}^{2n}y^i\\)","\\(\\int \\cos \\theta \\,d\\theta = \\sin \\theta.\\)",`\\(\\frac{\\partial u}{\\partial t}
   = h^2 \\left( \\frac{\\partial^2 u}{\\partial x^2}
      + \\frac{\\partial^2 u}{\\partial y^2}
      + \\frac{\\partial^2 u}{\\partial z^2} \\right) \\)`],
        classes:"dissapearing",
        img:"static/imgs/Tests/Maths/2.png"
    },
    {
        type:1,
        question:"",
        answers:["1","15%","67cm","Не відповідати"],
        img:"static/imgs/Tests/Maths/3.png"
    },
    {
        type:1,
        question:"Знайдіть площу даного правильного 4D торуса, якщо його радіус дорівнює 23.45",
        answers:["2345","302,392.75950625","Я не склав","1,758.75"],
        img:"static/imgs/Tests/Maths/6.png"
    },
    {
        type:1,
        question:"Костя пише програму на мові програмування C++. За годину роботи він отримав 2 витечі пам’яті (дуже погано), 4 помилки компіляції (неприємно) та 1 помилку під час runtime-у (погано). Який коефіцієнт гніву буде у Кості, якщо він так працюватиме впродовж 2 годин, якщо 0 % - щасливий, 50% - злий, 100% - гнів та крики?",
        answers:["45%","90%","75%","150% (нема стола)"]
    },
    {
        type:2,
        question:` Нехай у готелі є 23493248 номерів, з яких 3223 зайняті, але 379 можуть звільниться, а можуть і не звільнитись після 15:00. У готель заселяються 324234 людини, з яких 89632 хочуть жити по двох, а ще 34960 по трьох. У готелі є від 100000 до 300000 номерів, які підходять для двох, та інші від 100000 до 300000, які підходять для трьох. Розгляньте всі способи та варіанти для поселення гостей у готелі.`, 
        img:"",
        blockInfo:"Розв'яжіть завдання 8-10. Одержану числову відповідь упишіть у текстове поле під умовою завдання лише десятковим дробом, урахувавши положення коми. Знак «мінус» за потреби впишіть перед першою цифрою числа. Варіант відповіді, занесений у текстове поле, ЗБЕРЕЖІТЬ, натиснувши курсором на кнопку під завданням."
    },
    {
        type:2,
        question:`Обчисліть: \\(sqrt(2)*sqrt(3)\\)`,
    },
    {
        type:2,
        question:` Нехай існує певне число a. Додайте до нього 5 та помножте на π. Помножте на \\(\\frac{5}{π}\\). Далі поділіть це число на 5 та відніміть 5. Запишіть кінцевий результат, якщо a = номеру вашої банківської карти`
    }
]

const histTestsArray = [
    {
        type:1,
        question:"Якби Ви могли повернутись в минуле, з ким би Ви поспілкувались?",
        answers:["Б. Хмельницький","Н. Махно","С. Бандера","Зі мною :3"],
        blockInfo:"Завдання 1-13 мають по чотири варіанти відповіді, з яких лише ОДИН правильний. Виберіть правильний, на Вашу думку, варіант відповіді й натисніть курсором на значок ліворуч від нього. Варіант відповіді, позначений Вами, ЗБЕРЕЖІТЬ, натиснувши курсором на кнопку під завданням."
    },
    {
        type:1,
        question:"Найкращий президент України з 1991 року - це… (так, відповідь об’єктивна)",
        answers:["Л. Кравчук","В. Янукович","П. Порошенко","В. Зеленський"]
    },
    {
        "type": 1,
        "question": "На що О. Рейнський готовий за 4 буханки хлібу?",
        "answers": [
            "Заплатити за них гроші",
            "Станцювати голим на столі",
            "Почати позувати без футболки біля дошки на відео",
            "Зробити сайт їдальні школи"
        ],
        classes:"sideAds"
    },
    {
        "type": 1,
        "question": "Коли відбувся Великий похід… цього… ну як його там…?",
        "answers": [
            "1052 р",
            "1152 р",
            "1669 р",
            "1769 р"
        ]
    },
    {
        "type": 1,
        "question": "Жертвою якої операції став Н. Громов після пошкодження рюкзака О. Рейнського в часи Ховальної війни?",
        "answers": [
            "“Битва з Жижком”",
            "“Піднятий шекель”",
            "“Туалет - вікно”",
            "“Похід на Екватор”"
        ],
    },
    {
        "type": 1,
        "question": "Про кого йдеться у цитаті: “Але вуса, жесть…”?",
        "answers": [
            "М. Міхновський",
            "Т. Шевченко",
            "С. Петлюра",
            "Л. Лук’яненко"
        ]
    },
    {
        "type": 1,
        "question": "Чим закінчилась операція по визволенню спец. агента Д. Безкоровайного?",
        "answers": [
            "Ніякої операції не було: його не зловили",
            "Прийшла поліція",
            "Ніякої операції не було: не знайшли колонку",
            "Д. Безкоровайний прийшов за поліцією"
        ]
    },
    {
        "type": 1,
        "question": "Що мусив К. Соловей зробити для О. Рейнського, аби просунутись далі по квесту?",
        "answers": [
            "Принести туалетний папір",
            "Вбити Н. Громова",
            "Пройти рівень в Bad Piggies",
            "Розв’язати математичні приклади"
        ]
    },
    {
        "type": 1,
        "question": "Що об’єднує даних діячів: Іван Мазепа, Василь Залозецький-Сас, зайчик та камінчик",
        "answers": [
            "Очільники проукраїнських партій",
            "Відомі оратори",
            "Очільники ЛДНР",
            "Жили на території України з народження"
        ]
    },
    {
        "type": 1,
        "question": "Хто такі гун(ер)и?",
        "answers": [
            "Футбольний фанат клубу “Арсенал” у Великій Британії",
            "Кочові племена, які проживали на території України в 2 ст.",
            "Очільники ЛДНР",
            "You know…"
        ],
        classes:"allAdds"

    },
    {
        "type": 1,
        "question": "Що було причиною обірваного карнізу на 2 поверсі біля диванчиків?",
        "answers": [
            "Ядерне бомбардування",
            "Пар з одноразок, які палили у жіночому туалеті, запущений під тиском",
            "Очільники ЛДНР",
            "Помста Н. Громова за замикання у туалеті"
        ]
    },
    {
        "type": 1,
        "question": "Скільки переглядів набрало відео “Мальчік-красавчік”?",
        "answers": [
            "100-1000",
            "1000-10000",
            "10000-50000",
            "50000-100000"
        ]
    },
    {
        type:1,
        question: "За наступним аудіозаписом визначіть задукоментовану історичну подію",
        answers:["Варшавський інцидент “постріл”","Підготовка до операції “Капкан: Єремія”","Трагедія під ліжком","Операція “Suntago: прозора гірка”"],
        img: null,
        audio:"static/imgs/Tests/History/SpookySound.wav"
    },
    {
        type:5,
        question:`Поєдайнте імена діячів з їх прізвиськами`,
        answers:[["1. Н. Громов","2. Д. Безкоровайний","3. М. Лаврів","4. О. Рейнський"],["Машина","Жид","Шмякс","Бібізяна"]],
        img:"",
        blockInfo:"У завданнях 14-15 до кожного з чотирьох фрагментів інформації, позначених цифрою, доберіть один правильний, на Вашу думку, варіант, позначений буквою. Варіант відповіді, позначений Вами, ЗБЕРЕЖІТЬ, натиснувши курсором на кнопку під завданням."
    },
    {
        type:5,
        question:`Поєдайнте плакати з цитатами, що належать до тих самих історичних подій`,
        answers:[["static/imgs/Tests/History/17.1.png","static/imgs/Tests/History/17.2.png","static/imgs/Tests/History/17.3.png","static/imgs/Tests/History/17.4.png"],["Гляньте, яку класну скульптуру сфотографував…","....... - прєзідєнт міра!","....його треба… ВИБОРЮВАТЬ!","Ось фото цього мудака!"]],
        questionsImg:true
    },
    {
        type:4,
        question:`Охарактеризуйте зображеного діяча`,
        answers:["Позитивний","Розумний","Надихаючий","Вірний","Працьовитий","Смішний","Найкращий"],
        img:"static/imgs/Tests/History/15.png",
        blockInfo:"Завдання 16 має сім варіантів відповіді, з яких лише ТРИ правильні. Виберіть правильні, на Вашу думку, варіанти відповідей і натисніть курсором на значок нього. Варіанти відповідей ліворуч від 1, позначені Вами, ЗБЕРЕЖІТЬ, натиснувши курсором на кнопку під завданням."

    },
    {
        type:5,
        question:"Установіть послідовність подій",
        answers: [["1.","2.","3.","4."],["Набуття П. Порошенком статусу “надлюдини”","Заснування відкритого товариства рептилоїдів","Повернення НЛО на землю в зоні 51","Ядерна війна між 2 Євразійською імперією та атлантами"]],
        blockInfo:`У завданні 17 розташуйте події (А-Г) в хронологічній послідовності. Цифрі 1 (перша подія) має відповідати вибрана Вами перша подія, цифрі 2 (друга подія) друга, цифрі 3 (третя подія) третя, цифрі 4 (четверта подія) четверта. Для цього натисніть курсором на інформацію, позначену буквою, а потім на порожнє поле навпроти цифри, яка відповідає вибраній події.
        Ви можете змінити вибраний варіант відповіді: видаліть його, натиснувши курсором на значок. Після цього виберіть новий варіант Вашої відповіді. Після остаточного вибору ЗБЕРЕЖІТЬ відповідь, натиснувши курсором на кнопку під завданням.`        
    }
]

const mathBlock = new MathTests()
mathBlock.convertTestsArr(mathTestsArray)
mathBlock.renderAll();

const histBlock = new HistTests()
histBlock.convertTestsArr(histTestsArray)
histBlock.renderAll()

const timer = new Timer(localStorage.getItem("timer") || 2*60*60,document.querySelector("#popup__timer"))

timer.renderView()
timer.countdown()




class displayTestsBar{
    constructor(){
        this.show = 0;
        this.blocksArr = ["main__maths","main__hist"];
        this.headerControls = ["main-header__maths","main-header__history"];
        this.sideBars= ["side__maths","side__hist"]
    }
    async showTestByTitle(attrShow){
        for await(let i of Object.keys(this.blocksArr)){
            if(i == attrShow){

                await Helpers.simulateLoadingDecorator(()=>{
                    window.scrollTo({top:0,behavior:"smooth"})
                })


                document.getElementById(this.blocksArr[i]).classList.add("active")
                this.show = i;
                document.getElementById(this.headerControls[i]).classList.add("active")
                document.getElementById(this.sideBars[i]).classList.add("active")
                for(let j of Object.keys(this.blocksArr)){
                    if(j!=i){
                        document.getElementById(this.blocksArr[j]).classList.remove("active")
                        document.getElementById(this.headerControls[j]).classList.remove("active")
                        document.getElementById(this.sideBars[j]).classList.remove("active")
                    }
                   
                }
            }
        }
    }
    showTestByButton(attrControl){
        switch(attrControl){
            case "left":
                if(this.show == 0) this.show = this.blocksArr.length-1;
                else this.show--;
                break;
            case "right":
                if(this.show == this.blocksArr.length-1) this.show = 0;
                else this.show++;
                break;
            default:
                break;
        }
        this.showTestByTitle(this.show)
    }
}

let displayTests = new displayTestsBar();

document.addEventListener("click",(event)=>{
    let target = event.target;
    let attrShow = target.getAttribute("data-show");
    if(attrShow){
        displayTests.showTestByTitle(attrShow);
    }

    let attrControl = target.getAttribute("data-control");
    
    if(attrControl){
        displayTests.showTestByButton(attrControl)

    }
})

document.querySelector("#popup__finish-test").addEventListener("click", async (event)=>{
    let historyLength = Object.keys(JSON.parse(localStorage.getItem(histBlock.id))).length;
    let mathLength = Object.keys(JSON.parse(localStorage.getItem(mathBlock.id))).length;
    
    if(historyLength == histTestsArray.length && mathLength == mathTestsArray.length){
        await Helpers.waitRandTime(2000);
        document.getElementById("main__BSOD").classList.add("active");
        document.querySelector("body").classList.add("died")
    }else{
        document.getElementById("popup__warning").innerText="Будь ласка, дайте відповідь на всі запитання!"
        setTimeout(()=>{
            document.getElementById("popup__warning").innerText=""

        },5000)
    }
})

document.querySelector("#popup__hide").addEventListener("click",(event)=>{
    document.querySelector("#popup__timer").classList.toggle("hidden")
})

class MovingAnswer{
    constructor(elem){
        this.element = elem;
        this.container = document.getElementById("test__main")

        document.addEventListener("mousemove",this.trackCursor.bind(this))

        this.element.addEventListener("mouseover",this.sprint.bind(this))

        this.element.addEventListener("mouseover",this.start.bind(this))
        this.element.addEventListener("click",this.ignoreFirstClick.bind(this))

        this.blockX = this.element.offsetLeft ;
        this.blockY = this.element.offsetTop ;

        this.additionalPxX = 0;
        this.additionalPxY = 0;

        this.startMs = 2000;

        this.running = false;
        this.wasRunned = false;
        this.speedDecreasing = false;
        this.canBeStopped = false; 

        this.increment = 1;

        this.sprints = 3;
        this.audio = new Audio();
    }
    
    trackCursor(event){


        if(!this.running) return false;
        if(!this.canBeStopped){
            this.canBeStopped = true;
            setTimeout(()=>{
                this.element.addEventListener("click",this.stop.bind(this))
            },this.startMs)
        }
        const mouseX = event.clientX + window.scrollX;
        const mouseY = event.clientY + window.scrollY;

        const dx = this.blockX - mouseX; 
        const dy = this.blockY - mouseY;

        const distance = Math.sqrt(dx * dx + dy * dy);
        const threshold = 300;

        if (distance < threshold) {

            const force = (threshold - distance)  / this.increment; 

            const angle = Math.atan2(dy, dx);

            let additionalX = Math.cos(angle) * this.additionalPxX;
            let additionalY = Math.sin(angle) * this.additionalPxY;

            let containerRect = this.container.getBoundingClientRect();

            const maxX = containerRect.width + containerRect.x - 50;
            const maxY = 700 + containerRect.y;

            const minY = containerRect.y;
            const minX = containerRect.x;


            if((this.blockX + additionalX)>maxX || (this.blockX + additionalX)<minX) { 
                additionalX = additionalX * (-8);
                if(this.audio.ended){
                    this.audio.src = "static/imgs/Tests/Maths/sprint.ogg"
                    this.audio.play()
                }
            }

            if((this.blockY + additionalY)<minY){
                if(this.audio.ended){
                    this.audio.src = "static/imgs/Tests/Maths/sprint.ogg"
                    this.audio.play()
                }
                additionalY = additionalY * (-8);
            } 



            const offsetX = Math.cos(angle) * force + additionalX;
            const offsetY = Math.sin(angle) * force + additionalY ;
            
            this.additionalPxX = 0
            this.additionalPxY = 0



            this.blockX += offsetX;
            this.blockY += offsetY;

            this.blockX = Math.min(Math.max(minX, this.blockX), maxX);
            this.blockY = Math.min(Math.max(minY, this.blockY), maxY);




            this.element.style.left = this.blockX + "px";
            this.element.style.top = this.blockY + "px";
            
            if(!this.speedDecreasing){
                this.speedDecreasing = true;
                setTimeout(()=>{
                    this.increment += 0.05
                    this.speedDecreasing = false
                },100)
            }

        }

    }
    
    ignoreFirstClick(event){
        if(!this.canBeStopped) event.preventDefault()
    }

    sprint(event){

        if(this.increment>5 || this.sprints == 0){
            this.additionalPxX = 10;
            this.additionalPxY = 10;
        }else{
            this.additionalPxX = 70;
            this.additionalPxY = 70;

        }

    }

    start(event){
        if(!this.running && !this.wasRunned){
                this.wasRunned = true;
            setTimeout(()=>{
                this.running = true;

                this.audio.src = "/static/imgs/Tests/Maths/start.ogg"
                this.audio.play()

                this.element.classList.add("running")
                this.element.insertAdjacentHTML("beforeend",`<img src="static/imgs/Page/troll.png" style="position:absolute;width:100%;height:100%;top:0;left:0">`)
                this.blockX += 10
                this.blockY += 10
                this.element.style.left = this.blockX + "px";
                this.element.style.top = this.blockY + "px";
            },this.startMs)


        }
    }

    async stop(event){
        if(!this.running && !this.wasRunned){
            event.preventDefault();
            return
        }
        if(this.sprints!=0){
            this.blockX += Math.random()*200;
            this.blockY += Math.random()*200;
            if(this.audio.ended){
                this.audio.src = "/static/imgs/Tests/Maths/sprint.ogg"
                this.audio.play()
            }
            this.element.style.left = this.blockX + "px";
            this.element.style.top = this.blockY + "px";
            this.sprints -=1
            return;
            
        }

        this.running = false;
        this.element.style.left = "0px";
        this.element.style.top = "0px";
        this.element.classList.remove("running")
        this.element.querySelector("img").remove()
    }

    
}




class DissapearingBlock{
    constructor(elem){
        this.element = elem;
        document.addEventListener("scroll",this.trackViewPort.bind(this));
        this.y = this.element.offsetTop;
        this.messageShown = false;
         this.element.insertAdjacentHTML("beforeend",`<div id="dissapearing__message"> <p>Це був прикол, LoL! 😂</p></div>`)
    }

    trackViewPort(event){
        if(this.messageShown) return;
        let neededHeight = window.scrollY + window.innerHeight/2

        if(this.y <= neededHeight) {
            this.showMessage()
            this.messageShown =true;
        }
    }
    async showMessage(){
        await Helpers.wait(5000)
        this.element.querySelector("#dissapearing__message").classList.add("active")
        await Helpers.wait(3000);
        this.element.classList.add("vanish")
        let height = this.element.offsetHeight;
        this.element.style.height = height + "px"
        await Helpers.wait(2000);
        this.element.style.display = "none"
    }
}

class AdsAppear{
    constructor(elem){
        this.element = elem;
        document.addEventListener("scroll",this.trackViewPort.bind(this));
        this.y = this.element.offsetTop;
        this.messageShown = false;

    }
    trackViewPort(){
        if(this.element.checkVisibility()) this.y = this.element.offsetTop;
        if(this.messageShown) return;
        let neededHeight = window.scrollY + window.innerHeight/2

        if(this.y <= neededHeight && this.element.checkVisibility()) {
            this.showAdds()
            this.messageShown = true;
        }
    }



}

class sideAdds extends AdsAppear{
    constructor(elem){
        super(elem);
    }
    async showAdds(){
        let ads = Array.from(document.querySelectorAll(".add__side"));
        ads.forEach(element => {
            element.insertAdjacentHTML("beforeend",`<img class="add__loading" src = "static/imgs/Page/loading-waiting.gif" style="width=100%;height=100%">`)
        });
        await Helpers.waitRandTime(7000);

        ads.forEach(element=>{
            element.querySelector(".add__loading").classList.add("hidden");
            element.querySelector(".add__img").classList.add("active")
        })
    }
}

class mainAdds{
    constructor(elem){
        elem.addEventListener("click",this.showAdds.bind(this));
        this.messageShown = false;
        
    }
    async showAdds(){
        if(this.messageShown) return;
        let add = document.querySelector("#add__beton")
        let video = add.querySelector("video");
        add.classList.add("active");
        add.querySelector("#beton__vid-container").insertAdjacentHTML("beforeend",`<img class="add__loading" src = "static/imgs/Page/loading-waiting.gif" style="width=5%;">`)

        await Helpers.wait(1000);

        add.querySelector(".add__loading").classList.add("hidden");

        video.classList.add("active")
        video.play()

        video.addEventListener("ended",async ()=>{
            await Helpers.wait(2000)
            add.classList.remove("active")
            this.messageShown = true;
        })

    }
}

document.addEventListener("DOMContentLoaded",(event)=>{
    new DissapearingBlock(document.querySelector(".dissapearing"));
    new MovingAnswer(document.querySelector(`[data-block-answ-id="1"]`))
    new sideAdds(document.querySelector(".sideAds"))
    new mainAdds(document.querySelector(".allAdds").querySelector(".an__save"))

})
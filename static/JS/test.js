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
    }
}

class infoBlock{
    constructor(text){
        this.text = text;
        this.view = null;
    }

    renderView(){
        
    }
}

class SingleAnswer extends _Test{
    constructor(question,answers,correct){
        super(question);
        this.answers = answers;
        this.correctAnswer = correct;
    }

    rederView(){
        this.view = `
        
        
        `
    }

    submitAnswer(){

    }
}


class Answer{
    static idAnswerCounter = 0;
    constructor(text){
        this.id = Answer.idCounter++;
        this.question = question;
    }
}
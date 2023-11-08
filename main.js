let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answer-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".result");
let quiz_app = document.querySelector(".quiz-app")


// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;

      // Create Bullets + Set Questions Count
      createBullets(qCount);

      // Add Question Data
      addQuestionData(questionsObject[currentIndex], qCount);

      // Start CountDown
     // countdown(3, qCount);

      // Click On Submit
      submitButton.onclick = () => {
        // Get Right Answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;

        // Increase Index
        currentIndex++;

        // Check The Answer
        checkAnswer(theRightAnswer, qCount);

        // Remove Previous Question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        
        
        // Add Question Data
        addQuestionData(questionsObject[currentIndex], qCount);

        // plus Question 
        document.querySelector(".quiz-info > span").innerHTML = `
          سؤال : ${currentIndex + 1}
        `

        // Handle Bullets Class
       handleBullets();

        // Start CountDown
        clearInterval(countdownInterval);
       // countdown(3, qCount);

        // Show Results
       showResults(qCount);
      };
    }
  };

  myRequest.open("GET", "html_Quiz.json", true);
  myRequest.send();
}

getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  // Create Spans
  for (let i = 0; i < num; i++) {
    // Create Bullet
    let theBullet = document.createElement("span");

    // Check If Its First Span
    if (i === 0) {
      theBullet.className = "on";
    }

    // Append Bullets To Main Bullet Container
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    // Create HR 

   let hr =  document.createElement("hr");
    quizArea.appendChild(hr)


    // Create H2 Question Title
    let questionTitle = document.createElement("h2");

    // Create Question Text
    let questionText = document.createTextNode(obj["title"]);

    // Append Text To H2
    questionTitle.appendChild(questionText);

    // Append The H2 To The Quiz Area
    quizArea.appendChild(questionTitle);

    // Create The Answers
    for (let i = 1; i <= 3; i++) {
      // Create Main Answer Div
      let mainDiv = document.createElement("div");

      // Add Class To Main Div
      mainDiv.className = "answer";

      // Create Radio Input
      let radioInput = document.createElement("input");

      // Add Type + Name + Id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      // Make First Option Selected
      

      // Create Label
      let theLabel = document.createElement("label");

      // Add For Attribute
      theLabel.htmlFor = `answer_${i}`;

      // Create Label Text
      let theLabelText = document.createTextNode(obj[`answer_${i}`]);

      // Add The Text To Label
      theLabel.appendChild(theLabelText);

      // Add Input + Label To Main Div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);

      // Append All Divs To Answers Area
      answersArea.appendChild(mainDiv);
    }
  }
}

function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }
   
  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
  }else{
    Swal.fire(
      'الاجابة خاطئة',
      `الاجابة الصحيحة هي ${rAnswer}`,
      'error'
    )
  }
}

function handleBullets(){
  let BulletsSpans = document.querySelectorAll(".bullets .spans span");
  let ArrayOFSpans = Array.from(BulletsSpans);
  ArrayOFSpans.forEach((span , Inbex) =>{
    if(currentIndex === Inbex){
      span.className = "on"
      
    }
  }) 
}

function showResults (count) {
   if (currentIndex === count ) {
     quizArea.remove();
     answersArea.remove();
     submitButton.remove();
     bulletsSpanContainer.remove();
     document.querySelector(".quiz-info").remove();
  

    
     if(rightAnswers >= 18){
      quiz_app.classList.add("perfect");
       resultsContainer.innerHTML += `
      <span > ممتاز جدا جدا </span>  : ${rightAnswers} من ${count}
      `
     
     }else if (rightAnswers >= 15){
      quiz_app.classList.add("good");

     resultsContainer.innerHTML += `
      <span > جيد جدا </span>  : ${rightAnswers} من ${count}
    `
     }else{
      quiz_app.classList.add("bad");

      resultsContainer.innerHTML += `
      <span> سيء جدا </span>  : ${rightAnswers} من ${count}
     `
     }
     
   }
}


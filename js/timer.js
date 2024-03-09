//--------- DEFAULT SETTINGS -------------------
let totalTime = 30000;
let defaultRopeHeight = 20;
let animationInterval = 100;
let maxRopeHeight=0;
let drowningInterval = 20;
let pullingInterval = 30;
let minimumCorrectAnswers = 5;

// --------- STATE VALUES ----------------------
let remainingTotalTime = totalTime;
let mainTimeInterval = null;
let ropeHeight = defaultRopeHeight;
let currentQuestion = 0;
let isWinner = false;
let answersCorrect = 0;
let timeBarIncrement = 0;
let ropeIncrement = 0;

//------------- DOCUMENT READY ------------------
$(document).ready(function() {
    let currentWidth = $("#time").width();
    timeBarIncrement = currentWidth*animationInterval/totalTime;
    maxRopeHeight = $("div[class='container']").height()/3*2-100;
    ropeIncrement = maxRopeHeight*animationInterval/totalTime
})

// ------------ OTHER FUNCTIONS -----------------
function start() {    
    $("#start").css("display", "none");
    $("#answers").css("display", "block");
    $("#time").addClass("timerStarted");
    if (mainTimeInterval != null) {
        clearInterval(mainTimeInterval);
    }
    mainTimeInterval = setInterval(mainTimer, animationInterval);
    showCurrentAnswer();
    showRemainingQuestions();
}

function restart() {
    console.log('restart');
    isWinner = false;
    remainingTotalTime = totalTime;
    ropeHeight = defaultRopeHeight;
    currentQuestion = 0;
    answersCorrect = 0;
    $("#hanging-man").attr("src", hangingImages[0]);
    $("#hanging-man").removeClass("drowning");
    $("#hanging-man").removeClass("success");
    $("#dialog").css("display", "none");
    $("#time").css("width","80%");
    start();
}

function mainTimer() {
    console.log("mainTimer");
    checkGameStatus(); 
    remainingTotalTime -= animationInterval;
    ropeHeight += ropeIncrement;
    renderTime();
    $("#rope").css("height", ropeHeight + "px"); 
}

function renderTime() {    
    $("#actualTime").html(transformSecToMin(remainingTotalTime));  
    let currentWidth = $("#time").width();
    //console.log("renderTime", (currentWidth-timeBarIncrement));
    $("#time").css("width",(currentWidth-timeBarIncrement)+"px");
}

function checkGameStatus() {
    console.log(remainingTotalTime, ropeHeight, answersCorrect);
    if (remainingTotalTime <= 0 || ropeHeight >maxRopeHeight) {
        clearInterval(mainTimeInterval);
        $("#hanging-man").addClass("drowning");
        toggleDialog();        
    } 
    else if (ropeHeight<=defaultRopeHeight && answersCorrect>=5) {
        isWinner = true;
        clearInterval(mainTimeInterval);
        $("#hanging-man").addClass("success");
        toggleDialog();
    }
}

function transformSecToMin(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return ((minutes<10? "0":"") + minutes+"m") +":"+ ((seconds<10? "0":"") + seconds+"s");
}

function showCurrentAnswer() {
    //console.log('showCurrentAnswer', currentQuestion, answers[currentQuestion].answers);
    $("#questionDiv").html(answers[currentQuestion].question);
    let buttonDiv = '';
    for (let answer of answers[currentQuestion].answers) {
        //console.log(answer, answers[currentQuestion].correctAnswer);
        buttonDiv += '<button onclick="submitAnswer(\''+(answer==answers[currentQuestion].correctAnswer)+'\')">'+
            answer+'</button>';
    }
    //console.log("buttonDiv", buttonDiv);
    $("#answerButtonDiv").html(buttonDiv);
}

function submitAnswer(correct) {
    //console.log('submitAnswer', correct);
    if (correct == 'true') {
        ropeHeight += -pullingInterval;
        answersCorrect++;
        if (ropeHeight<defaultRopeHeight) {
            ropeHeight=defaultRopeHeight;           
        }
        showRemainingQuestions();
    } else {
        ropeHeight += drowningInterval;
        toggleHangingImage();
        setTimeout(() => {
        toggleHangingImage();
        }, 500);
    }
    
    $("#rope").css("height", ropeHeight + "px");
    currentQuestion++;
    showCurrentAnswer(); 
}
function showRemainingQuestions() {
    let remaingCorrectAnswers = (minimumCorrectAnswers-answersCorrect);
    $("#remainingQuestions").html("Remaining corrects answers: " + (remaingCorrectAnswers<0?0:remaingCorrectAnswers));
}


let hangingImages = ["images/hanging.png", "images/hanging3.png"];
let hangingIndex = 0;

function toggleHangingImage() {    
    hangingIndex = (hangingIndex+1>hangingImages.length-1)?0:hangingIndex+1;
    //console.log('toggle hanging image', hangingIndex, hangingImages[hangingIndex]);
    $("#hanging-man").css("background-image", "url("+hangingImages[hangingIndex]+")");
}

function toggleDialog() {
    if ($("#dialog").css("display") == "none") { 
        if(isWinner){
            $('#dialog .message').html("Hangman Saved! 🚁🌟 <br/>You nailed it! Five correct answers in 2 minutes – Crocodiles defeated, hangman rescued! <br/><br/>You're a true champion! 🏆🎉");
            $('#dialog img').attr("src", "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXJ0YmR6eHgxMjkyZzM4em10azV6cmdlZXRpYmd6bXFwb3E1M3FscSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wTjgeqs7gg1oU8WMds/giphy.gif");
        }
        else{
            $('#dialog .message').html("Crocs got the win this time! 🐊⌛ <br/>Don't sweat it – hangman will be back for another daring escape. <br/>Ready for a rematch? 🚁💪");
            $('#dialog img').attr("src", "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExazZ4cG4zaTZlaXN6Y3drejh5Z28xenpiNTJ6M3VmODE4dnlhd3praCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/McZw215HSZCeJ2CMun/giphy.gif");
        }
        $("#dialog").css("display", "flex");
    } else {
        $("#dialog").css("display", "none");
    }
}

const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector(".entered-text");
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");
const textPrompt = document.getElementById("text-prompt");
const errorCount = document.querySelector(".errors");
const wpm = document.querySelector(".wpm");


 
var prompts = [
    "The FitnessGram Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. The running speed starts slowly, but gets faster each minute after you hear this signal",
    "One morning my friend and I were thinking about how we could plan our summer break away from school. Driving from our own state to several nearby states would help to expand our limited funds. Inviting six other friends to accompany us would lower our car expenses.",
    "It's not 'bout money, it's more about time. This makes sense when you see how I spend my time. Burst through the ceiling, I'm feeling sublime. Can't leave the game yet, I feel like Lebron. One hundred mil' and I'm still on the grind.",
    "This is going to be thirty seconds of typing for you and therefore you should complete this within thirty seconds. I wish you the best of luck! Oops too short"
]
var promptNum = 0;
//value used to hold current prompt 
var currentPrompt = ""
var characterCount = 0;
let interval;
let timeRunning = false;
var errors = 0;

//used to represent time intervals
let timer = [0,0,0,0]; 
textPrompt.innerHTML = prompts[promptNum];
promptNum++;
var wordsPerMin = null;
var time = 0;
//used to keep track of words per minute

//function to load different prompts into the screen
async function updateQuote(){
    currentPrompt = prompts[promptNum];
    if(promptNum < prompts.length -1){
        promptNum++;
    }else {
        promptNum = 0;
    }

    textPrompt.innerHTML = currentPrompt;
}
// Add leading zero to numbers 9 or below (purely for aesthetics):

function addLeadingZeros(time){
    if(time <=9){
        time = "0" + time;
    }
    return time;
}


// Run a standard minute/second/hundredths timer:
function runTimer(){
    let currentTimer = addLeadingZeros(timer[0]) + ":" + addLeadingZeros(timer[1]) + ":" + addLeadingZeros(timer[2]);
    theTimer.innerHTML = currentTimer;
    timer[3]++;

    timer[0] = Math.floor((timer[3]/100)/60);
    timer[1] = Math.floor((timer[3]/100) - (timer[0] * 60));
    timer[2] = Math.floor(timer[3] - (timer[1] * 100) - (timer[0] * 6000));

    time++; //in seconds
   
}


//This is used to calculate the words per minute 
function calculateWPM(){
    wordsPerMin = Math.round(((countWords(currentPrompt))/ ((time / 100)/60)));
    console.log(wordsPerMin);
}

//This is used to calculate the number of words of the prompt
//src = https://www.codegrepper.com/code-examples/javascript/javascript+count+number+of+words+in+a+string
function countWords(str) {
    str = str.replace(/(^\s*)|(\s*$)/gi,"");
    str = str.replace(/[ ]{2,}/gi," ");
    str = str.replace(/\n /,"\n");
    return str.split(' ').length;
}


// Match the text entered with the provided text on the page:
function processUserInput(){
    let textEntered = testArea.value;
    let matchText = textPrompt.innerHTML.substring(0, textEntered.length);
    if(textEntered == matchText && textEntered != textPrompt.innerHTML){
        testWrapper.style.borderColor = 'green';
    } else if(textEntered!= matchText){
        console.log(errors);
        testWrapper.style.borderColor = 'red';
        errors++;
    } else{
        testWrapper.style.borderColor = 'blue';
        errorCount.innerHTML = " " + errors;
        calculateWPM();
        wpm.innerHTML = " " + wordsPerMin;
        clearInterval(interval);
        interval = null;
    }
}


// Start the timer:
function start(){
    let enteredTextLength = testArea.value.length;
    startTime = new Date().getMilliseconds();
    if(enteredTextLength === 0){
        timeRunning = true;
        interval = setInterval(runTimer, 10);
    }
}


// Reset everything:
function reset(){
    clearInterval(interval);
    interval = null;
    timer = [0,0,0,0]; 
    timeRunning = false;
    testArea.value = "";
    updateQuote();
    theTimer.innerHTML = "00:00:00";
    testWrapper.style.borderColor = 'green';
    errors = 0;
    errorCount.innerHTML = "";
    start = null;
    time = 0;
    wordsPerMin = null;
}


// Event listeners for keyboard input and the reset button:
testArea.addEventListener('keypress', start, false);
testArea.addEventListener('keyup', processUserInput, false);
resetButton.addEventListener('clic', reset, false);

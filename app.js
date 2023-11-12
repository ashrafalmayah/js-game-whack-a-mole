const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const timer = document.querySelector('.timer');
const highscoreElement = document.querySelector('.highscore');
let lastIdx;
let timeUp = false;
let score = 0;
let timerInterval;
let peepTimeout;
let gameTime;
let isRunning = false;

highscoreElement.textContent = localStorage.getItem('highscore') || 0;
timer.textContent = localStorage.getItem('gameTime') || 10;

function randomTime(min, max){
    const time = Math.round(Math.random() * (max - min) + min);
    return time;
}

function randomHole(holes){
    const idx = Math.floor(Math.random() * holes.length );

    if(idx === lastIdx){
        return randomHole(holes);
    }

    lastIdx = idx;
    return holes[idx];
}

function peep(){
    const time = randomTime(200, 1000);
    const hole = randomHole(holes);

    hole.classList.add('up');

    peepTimeout = setTimeout(() => {
        hole.classList.remove('up');
        peep();
    }, time);
}

function stopGame(){
    clearTimeout(peepTimeout);
    clearInterval(timerInterval);
    if(isRunning){
        if(gameTime) timer.textContent = gameTime;
        timeUp = true;
        timer.textContent = gameTime;
        timer.setAttribute('contenteditable', true);
        isRunning = false;
    }
    holes.forEach(hole => hole.classList.remove('up'));
}

function startGame(){
    stopGame();
    isRunning = true;
    scoreBoard.textContent = '0';
    timeUp = false;
    score = 0;
    peep();

    startTimer();
}

function startTimer(){
    timer.removeAttribute('contenteditable');
    gameTime = parseInt(timer.textContent);
    localStorage.setItem('gameTime', gameTime);
    timerTime = gameTime;
    timerInterval = setInterval(() => {
        timerTime--;

        timer.textContent = timerTime;

        if(timerTime <= 0){
            return stopGame();
        }
    }, 1000);
}

function bonk(e){
    if(!e.isTrusted) return; // Cheater!
    this.parentElement.classList.remove('up');
    score++;
    scoreBoard.textContent = score;
    let highscore = parseInt(highscoreElement.textContent);
    if(score > highscore){
        highscore = score;
        localStorage.setItem('highscore', highscore);
        highscoreElement.textContent = highscore;
    }
}

moles.forEach(mole => mole.addEventListener('click', bonk));

//Accept only numbers
timer.addEventListener('keydown', (e) => {
    const key = e.key;
    if(!(/\b[0-9]\b/.test(key) || /\b[a-zA-Z]+\b/.test(key) &&  !/\b[a-zA-Z]\b/.test(key)) || key === 'Enter'){
        e.preventDefault();
    }
});
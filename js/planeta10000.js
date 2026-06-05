const resetButton = document.getElementById('resetBtn');
const startButton = document.getElementById('startBtn');
const introCard = document.querySelector('.intro-card');
const gameArea = document.querySelector('.game-area');
const meteorContainer = document.getElementById('meteorContainer');
const confettiContainer = document.getElementById('confettiContainer');
const correctCountElement = document.getElementById('correctCount');
const wrongCountElement = document.getElementById('wrongCount');
const resultMessage = document.getElementById('resultMessage');

const totalMeteors = 20;
const totalCorrectMeteors = 10;
let correctClicks = 0;
let wrongClicks = 0;
let totalCorrectClicks = 0;
let totalWrongClicks = 0;
let meteorEndCount = 0;
let currentRound = 1;

function getRoundSettings(round) {
    if (round === 1) {
        return {
            correctLow: 0,
            correctHigh: 1000,
            wrongRanges: [
                { low: 1001, high: 10000 }
            ],
            label: 'Primera ronda: meteoros 0-1000 correctos'
        };
    }

    if (round === 2) {
        return {
            correctLow: 1001,
            correctHigh: 3000,
            wrongRanges: [
                { low: 0, high: 1000 },
                { low: 3001, high: 10000 }
            ],
            label: 'Segunda ronda: meteoros 1001-3000 correctos'
        };
    }

    return {
        correctLow: 3001,
        correctHigh: 6000,
        wrongRanges: [
            { low: 0, high: 3000 },
            { low: 6001, high: 10000 }
        ],
        label: 'Tercera ronda: meteoros 3001-6000 correctos'
    };
}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSpanishVoice() {
    const voices = speechSynthesis.getVoices();
    return voices.find(voice => {
        const name = voice.name.toLowerCase();
        return name.includes('spanish') || name.includes('español') || name.includes('maria') || name.includes('lucia') || name.includes('sofia');
    }) || voices[0];
}

function speak(text) {
    return new Promise(resolve => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        const voice = getSpanishVoice();
        if (voice) utterance.voice = voice;
        utterance.onend = resolve;
        speechSynthesis.speak(utterance);
    });
}

function speakRoundInstruction(round) {
    let message = '';
    if (round === 1) {
        message = 'Apretá los meteoritos que tengan un número del 0 al 1000.';
    } else if (round === 2) {
        message = 'Apretá los meteoritos que tengan números del 1001 al 3000.';
    } else {
        message = 'Ahora aprieta los meteoritos que tengan números del 3001 al 6000.';
    }
    return speak(`Ronda ${round}. ${message}`);
}

function launchConfetti() {
    if (!confettiContainer) return;
    const colors = ['#ff3d00', '#ffd600', '#00e676', '#2979ff', '#d500f9'];
    const count = 80;
    confettiContainer.innerHTML = '';

    for (let i = 0; i < count; i += 1) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.opacity = `${0.7 + Math.random() * 0.3}`;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        confetti.style.animationDelay = `${Math.random() * 0.5}s`;
        confetti.style.width = `${6 + Math.random() * 8}px`;
        confetti.style.height = `${12 + Math.random() * 10}px`;
        confettiContainer.appendChild(confetti);
    }

    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, 5000);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function resetGame() {
    correctClicks = 0;
    wrongClicks = 0;
    meteorEndCount = 0;
    correctCountElement.textContent = correctClicks;
    wrongCountElement.textContent = wrongClicks;
    resultMessage.classList.add('hidden');
    resultMessage.textContent = '';
    meteorContainer.innerHTML = '';
}

function showResult() {
    const settings = getRoundSettings(currentRound);
    const messageText = wrongClicks === 0 && correctClicks === totalCorrectMeteors
        ? '¡Ganaste la ronda!'
        : wrongClicks > 0
            ? 'Tocaste meteoritos incorrectos.'
            : 'No apretaste todos los meteoritos correctos.';

    if (currentRound < 3) {
        resultMessage.classList.remove('hidden');
        resultMessage.innerHTML = `
            <div class="result-title">Ronda ${currentRound} completada</div>
            <div class="result-note">${messageText}</div>
        `;

        const nextRound = currentRound + 1;
        currentRound = nextRound;
        setTimeout(() => {
            resetGame();
            startMeteorShower();
        }, 2500);
        return;
    }

    const basePoints = 900;
    const penalty = 30;
    const finalPoints = Math.max(0, basePoints - (totalWrongClicks * penalty));
    let finalVoice = '';

    if (finalPoints >= 700) {
        finalVoice = 'Felicidades, ganaste!!';
        launchConfetti();
    } else if (finalPoints >= 400) {
        finalVoice = 'Eres bueno, sigue practicando y seras mejor.';
    } else {
        finalVoice = 'Suerte para la proxima, sigue esforzandote y llegaras lejos.';
    }

    resultMessage.classList.remove('hidden');
    resultMessage.innerHTML = `
        <div class="result-title">Juego terminado</div>
        <table class="result-table">
            <tr><td>Buenas totales</td><td>${totalCorrectClicks}</td></tr>
            <tr><td>Malas totales</td><td>${totalWrongClicks}</td></tr>
            <tr><td>Puntos</td><td>${finalPoints}</td></tr>
        </table>
        <div class="result-note">${messageText}</div>
    `;

    speak(finalVoice);
}

function createMeteor(number, delay) {
    const meteor = document.createElement('button');
    meteor.className = 'meteor';
    meteor.textContent = number;
    meteor.dataset.correct = number <= getRoundSettings(currentRound).correctHigh && number >= getRoundSettings(currentRound).correctLow ? 'true' : 'false';

    const startLeft = randomRange(0, 60);
    const size = randomRange(50, 80);
    const duration = randomRange(12000, 16000);

    meteor.style.left = `${startLeft}vw`;
    meteor.style.width = `${size}px`;
    meteor.style.height = `${size}px`;
    meteor.style.animationDuration = `${duration}ms`;
    meteor.style.animationDelay = `${delay}ms`;
    meteor.style.opacity = `${0.85 + Math.random() * 0.15}`;

    meteor.addEventListener('click', () => {
        if (meteor.classList.contains('clicked')) return;
        meteor.classList.add('clicked');
        meteor.style.pointerEvents = 'none';

        const isCorrect = meteor.dataset.correct === 'true';
        if (isCorrect) {
            correctClicks += 1;
            totalCorrectClicks += 1;
            meteor.classList.add('correct');
        } else {
            wrongClicks += 1;
            totalWrongClicks += 1;
            meteor.classList.add('wrong');
        }

        correctCountElement.textContent = correctClicks;
        wrongCountElement.textContent = wrongClicks;
    });

    meteor.addEventListener('animationend', () => {
        meteor.remove();
        meteorEndCount += 1;
        if (meteorEndCount === totalMeteors) {
            showResult();
        }
    });

    meteorContainer.appendChild(meteor);
}

async function startMeteorShower() {
    const settings = getRoundSettings(currentRound);
    await speakRoundInstruction(currentRound);
    const correctNumbers = Array.from({ length: totalCorrectMeteors }, () => randomRange(settings.correctLow, settings.correctHigh));
    const wrongNumbers = Array.from({ length: totalMeteors - totalCorrectMeteors }, () => {
        const rangeIndex = randomRange(0, settings.wrongRanges.length - 1);
        const range = settings.wrongRanges[rangeIndex];
        return randomRange(range.low, range.high);
    });
    const meteorNumbers = shuffle([...correctNumbers, ...wrongNumbers]);

    meteorNumbers.forEach((number, index) => {
        const delay = index * 300 + randomRange(0, 400);
        createMeteor(number, delay);
    });
}

startButton.addEventListener('click', () => {
    currentRound = 1;
    totalCorrectClicks = 0;
    totalWrongClicks = 0;
    resetGame();
    introCard.classList.add('hidden');
    gameArea.classList.remove('hidden');
    startMeteorShower();
});

resetButton.addEventListener('click', () => {
    currentRound = 1;
    totalCorrectClicks = 0;
    totalWrongClicks = 0;
    resetGame();
    resultMessage.classList.add('hidden');
    startMeteorShower();
});

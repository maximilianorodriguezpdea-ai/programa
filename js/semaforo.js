const numbersContainer = document.getElementById('numbersContainer');
const dropZones = document.querySelectorAll('.drop-zone');
const checkBtn = document.getElementById('checkBtn');
const resetBtn = document.getElementById('resetBtn');
const resultBox = document.getElementById('result');
const roundInfo = document.getElementById('roundInfo');
const finalResults = document.getElementById('finalResults');
const finalResultsBody = document.getElementById('finalResultsBody');
const finalTotalPoints = document.getElementById('finalTotalPoints');
const confettiContainer = document.getElementById('confettiContainer');

const numberSets = [
    [1800, 3200, 5100, 1230, 4500],
    [7800, 2100, 4999, 1500, 6200],
    [2500, 5500, 3000, 1000, 8000],
    [4200, 2300, 5900, 1200, 3800],
    [2800, 5200, 1900, 6500, 4100]
];

let draggedNumber = null;
let currentRound = 0;
let totalPoints = 0;
let roundResults = [];
let gameFinished = false;
const totalRounds = 5;

function createNumberCards() {
    const numbers = numberSets[currentRound];
    numbersContainer.innerHTML = numbers.map((value) => `
        <div class="number-card" draggable="true" data-value="${value}">
            ${value}
        </div>
    `).join('');
    addDragEvents();
}

function addDragEvents() {
    const cards = document.querySelectorAll('.number-card');
    cards.forEach((card) => {
        card.addEventListener('dragstart', () => {
            draggedNumber = card;
            card.classList.add('dragging');
        });
        card.addEventListener('dragend', () => {
            draggedNumber = null;
            card.classList.remove('dragging');
        });
    });

    dropZones.forEach((zone) => {
        zone.addEventListener('dragover', (event) => {
            event.preventDefault();
            zone.classList.add('drag-over');
        });

        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });

        zone.addEventListener('drop', () => {
            zone.classList.remove('drag-over');
            if (!draggedNumber) return;
            zone.appendChild(draggedNumber);
        });
    });
}

function getExpectedColor(value) {
    if (value > 5000) return 'green';
    if (value >= 2000) return 'yellow';
    return 'red';
}

function checkAnswers() {
    if (gameFinished) return;

    const allCards = document.querySelectorAll('.number-card');
    let correct = 0;
    let total = allCards.length;

    allCards.forEach((card) => {
        const value = Number(card.dataset.value);
        const expected = getExpectedColor(value);
        const parentZone = card.closest('.drop-zone');

        if (parentZone && parentZone.dataset.color === expected) {
            card.style.borderColor = '#16a34a';
            card.style.background = '#ecfdf5';
            correct += 1;
        } else {
            card.style.borderColor = '#dc2626';
            card.style.background = '#fef2f2';
        }
    });

    let pointsAward = 0;
    if (correct === total) {
        pointsAward = 100;
        resultBox.textContent = `¡Excelente! Todos los números están correctos. +100 puntos`;
        resultBox.className = 'result success';
    } else if (correct === total - 1) {
        pointsAward = 80;
        resultBox.textContent = `Buen intento: ${correct} de ${total} correctos. +80 puntos`;
        resultBox.className = 'result';
    } else if (correct === total - 2) {
        pointsAward = 75;
        resultBox.textContent = `Casi listo: ${correct} de ${total} correctos. +75 puntos`;
        resultBox.className = 'result';
    } else if (correct >= Math.ceil(total / 2)) {
        pointsAward = 40;
        resultBox.textContent = `Hay errores: ${correct} de ${total} correctos. +40 puntos`;
        resultBox.className = 'result error';
    } else {
        pointsAward = 0;
        resultBox.textContent = `Necesitas mejorar: ${correct} de ${total} correctos. 0 puntos`;
        resultBox.className = 'result error';
    }

    totalPoints += pointsAward;
    roundResults.push({
        round: currentRound + 1,
        correct: correct,
        total: total,
        points: pointsAward
    });

    if (currentRound + 1 >= totalRounds) {
        gameFinished = true;
        renderFinalResults();
        checkBtn.style.display = 'none';
        playFinalFeedback(totalPoints);
        return;
    }

    currentRound += 1;
    roundInfo.textContent = `Ejercicio ${currentRound + 1} / ${totalRounds}`;
    dropZones.forEach((zone) => {
        zone.querySelectorAll('.number-card').forEach((card) => card.remove());
    });
    createNumberCards();
    resultBox.textContent = '';
    resultBox.className = 'result';
}

function renderFinalResults() {
    finalResultsBody.innerHTML = roundResults.map((entry) => `
        <tr>
            <td>Ejercicio ${entry.round}</td>
            <td>${entry.correct}/${entry.total}</td>
            <td>${entry.points}</td>
        </tr>
    `).join('');
    finalTotalPoints.textContent = totalPoints;
    finalResults.style.display = 'block';
}

function playFinalFeedback(points) {
    let message = '';
    if (points >= 400) {
        message = 'Felicidades, eres muy bueno.';
        launchConfetti();
    } else if (points >= 250) {
        message = 'Buen trabajo, suerte en el próximo intento.';
    } else {
        message = 'Qué mal, intentemos de nuevo.';
    }
    speakMessage(message);
}

function speakMessage(text) {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

function launchConfetti() {
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

function resetGame() {
    if (gameFinished) {
        gameFinished = false;
        currentRound = 0;
        totalPoints = 0;
        roundResults = [];
        roundInfo.textContent = `Ejercicio 1 / ${totalRounds}`;
        finalResults.style.display = 'none';
        confettiContainer.innerHTML = '';
        checkBtn.style.display = 'block';
        resultBox.textContent = '';
        resultBox.className = 'result';
        dropZones.forEach((zone) => {
            zone.querySelectorAll('.number-card').forEach((card) => card.remove());
        });
        createNumberCards();
        return;
    }

    resultBox.textContent = '';
    resultBox.className = 'result';
    dropZones.forEach((zone) => {
        zone.querySelectorAll('.number-card').forEach((card) => {
            card.style.borderColor = '';
            card.style.background = '';
        });
    });
}

checkBtn.addEventListener('click', checkAnswers);
resetBtn.addEventListener('click', resetGame);

document.getElementById('btnVolver').addEventListener('click', () => {
    window.location.href = '4basico.html';
});

createNumberCards();

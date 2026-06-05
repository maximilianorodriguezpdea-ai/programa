let currentProducts = [];
let correctOrder = [];
let selectedProducts = [];
let currentRound = 0;
let correctExercises = 0;
let totalPoints = 0;
let roundPoints = [];
let finished = false;
const totalRounds = 6;

const productsContainer = document.getElementById('productsContainer');
const selectedOrder = document.getElementById('selectedOrder');
const resultBox = document.getElementById('result');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const headerRect = document.querySelector('.header-rect');
const finalResults = document.getElementById('finalResults');
const finalResultsBody = document.getElementById('finalResultsBody');
const finalTotalPoints = document.getElementById('finalTotalPoints');
const confettiContainer = document.getElementById('confettiContainer');

const rounds = [
    {
        name: 'Primera ronda',
        products: [
            { name: 'Caja de tomates', price: 2350, emoji: '🍅' },
            { name: 'Polera', price: 6990, emoji: '👕' },
            { name: 'Mochila', price: 8450, emoji: '🎒' },
            { name: 'Cuaderno', price: 1250, emoji: '📓' }
        ]
    },
    {
        name: 'Segunda ronda',
        generator: () => generateRoundProducts(
            [
                { name: 'Pantalón', emoji: '👖' },
                { name: 'Almuerzo', emoji: '🍱' },
                { name: 'Pelota', emoji: '⚽' },
                { name: 'Paleta', emoji: '🍭' }
            ]
        )
    }
];

const randomItems = [
    { name: 'Zapatos', emoji: '👟' },
    { name: 'Jugo', emoji: '🧃' },
    { name: 'Libro', emoji: '📚' },
    { name: 'Cámara', emoji: '📷' },
    { name: 'Sombrero', emoji: '🎩' },
    { name: 'Helado', emoji: '🍨' },
    { name: 'Guitarra', emoji: '🎸' },
    { name: 'Reloj', emoji: '⌚' }
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUniquePrices(count, min, max) {
    const prices = new Set();
    while (prices.size < count) {
        prices.add(getRandomInt(min, max));
    }
    return Array.from(prices);
}

function generateRoundProducts(items) {
    const prices = generateUniquePrices(items.length, 0, 10000);
    return items.map((item, index) => ({
        name: item.name,
        emoji: item.emoji,
        price: prices[index]
    }));
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function buildCorrectOrder(products) {
    return [...products].sort((a, b) => a.price - b.price).map(({ name, price }) => ({ name, price }));
}

function renderProducts() {
    const shuffledProducts = shuffleArray(currentProducts);
    productsContainer.innerHTML = shuffledProducts.map((product) => `
        <button class="product-btn" data-price="${product.price}" data-name="${product.name}">
            <span class="product-emoji">${product.emoji}</span>
            <span class="product-name">${product.name}</span>
            <span class="product-price">$${product.price.toLocaleString('es-CL')}</span>
        </button>
    `).join('');
    addProductListener();
}

function addProductListener() {
    const buttons = document.querySelectorAll('.product-btn');
    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const price = Number(btn.dataset.price);
            const name = btn.dataset.name;

            const existingIndex = selectedProducts.findIndex((p) => p.price === price && p.name === name);
            if (existingIndex !== -1) {
                selectedProducts.splice(existingIndex, 1);
                btn.classList.remove('selected');
            } else {
                selectedProducts.push({ name, price });
                btn.classList.add('selected');
            }

            updateSelectedOrder();
        });
    });
}

function updateSelectedOrder() {
    if (selectedProducts.length === 0) {
        selectedOrder.innerHTML = '<p class="empty-text">Haz clic en los productos en orden de menor a mayor</p>';
        submitBtn.style.display = 'none';
        resultBox.innerHTML = '';
    } else {
        submitBtn.style.display = 'block';
        selectedOrder.innerHTML = selectedProducts.map((product, index) => `
            <div class="order-item">
                <div>
                    <span class="order-number">${index + 1}</span>
                    <strong>${product.name}</strong> - $${product.price.toLocaleString('es-CL')}
                </div>
                <button class="remove-btn" data-index="${index}">✕</button>
            </div>
        `).join('');

        document.querySelectorAll('.remove-btn').forEach((btn) => {
            btn.addEventListener('click', () => {
                const index = Number(btn.dataset.index);
                const product = selectedProducts[index];
                selectedProducts.splice(index, 1);
                document.querySelectorAll('.product-btn').forEach((prodBtn) => {
                    if (prodBtn.dataset.price === String(product.price) && prodBtn.dataset.name === product.name) {
                        prodBtn.classList.remove('selected');
                    }
                });
                updateSelectedOrder();
            });
        });
    }
}

function verifyOrder() {
    if (selectedProducts.length !== correctOrder.length) {
        resultBox.innerHTML = `<div class="result error">Debes seleccionar todos los ${correctOrder.length} productos.</div>`;
        resultBox.style.display = 'block';
        return;
    }

    const mismatchCount = selectedProducts.reduce((count, product, index) => {
        return count + (product.name !== correctOrder[index].name ? 1 : 0);
    }, 0);

    let pointsAward = 0;
    let message = '';

    if (mismatchCount === 0) {
        pointsAward = 100;
        correctExercises += 1;
        message = '¡Excelente! Ordenaste correctamente de menor a mayor.';
    } else if (mismatchCount === 1) {
        pointsAward = 80;
        message = 'Buen intento: tuviste 1 error en el orden.';
    } else if (mismatchCount === 2) {
        pointsAward = 75;
        message = 'Casi listo: tuviste 2 errores en el orden.';
    } else if (mismatchCount === 3) {
        pointsAward = 40;
        message = 'Hay varios errores: tuviste 3 objetos mal colocados.';
    } else {
        pointsAward = 0;
        message = 'No tuviste la orden correcta en este ejercicio.';
    }

    totalPoints += pointsAward;
    roundPoints.push({
        round: currentRound + 1,
        errors: mismatchCount,
        points: pointsAward
    });

    if (currentRound + 1 >= totalRounds) {
        finished = true;
        renderFinalResults();
        resultBox.innerHTML = `<div class="result success">${message} Obtuviste ${pointsAward} puntos en este ejercicio.<br>¡Has terminado ${totalRounds} ejercicios! Puntaje final: ${totalPoints} de ${totalRounds * 100}.</div>`;
        resultBox.style.display = 'block';
        submitBtn.style.display = 'none';
        playFinalFeedback(totalPoints);
        return;
    }

    resultBox.innerHTML = `<div class="result ${mismatchCount === 0 ? 'success' : 'error'}">${message} Obtuviste ${pointsAward} puntos en este ejercicio. Preparando la siguiente ronda...</div>`;
    resultBox.style.display = 'block';
    setTimeout(() => {
        currentRound += 1;
        loadRound(currentRound);
    }, 1500);
}

function renderFinalResults() {
    finalResultsBody.innerHTML = roundPoints.map((entry) => `
        <tr>
            <td>Ejercicio ${entry.round}</td>
            <td>${entry.errors}</td>
            <td>${entry.points}</td>
        </tr>
    `).join('');
    finalTotalPoints.textContent = totalPoints;
    finalResults.style.display = 'block';
}

function playFinalFeedback(points) {
    let message = '';
    if (points >= 480) {
        message = 'Felicidades, eres muy bueno.';
        launchConfetti();
    } else if (points >= 300) {
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

function restartWholeGame() {
    finished = false;
    currentRound = 0;
    correctExercises = 0;
    totalPoints = 0;
    roundPoints = [];
    finalResults.style.display = 'none';
    submitBtn.style.display = 'block';
    loadRound(currentRound);
    resultBox.innerHTML = '';
}

function resetGame() {
    if (finished) {
        restartWholeGame();
        return;
    }

    selectedProducts = [];
    document.querySelectorAll('.product-btn').forEach((btn) => btn.classList.remove('selected'));
    updateSelectedOrder();
    resultBox.innerHTML = '';
}

function loadRound(roundIndex) {
    selectedProducts = [];
    resultBox.innerHTML = '';

    if (roundIndex < rounds.length) {
        const round = rounds[roundIndex];
        currentProducts = round.generator ? round.generator() : round.products;
        headerRect.textContent = `${round.name} - Ordena los productos de menor a mayor precio`;
    } else {
        const randomSet = shuffleArray(randomItems).slice(0, 4);
        currentProducts = generateRoundProducts(randomSet);
        headerRect.textContent = `Nueva ronda - Ordena los productos de menor a mayor precio`;
    }

    correctOrder = buildCorrectOrder(currentProducts);
    renderProducts();
    updateSelectedOrder();
}

loadRound(currentRound);

submitBtn.addEventListener('click', verifyOrder);
resetBtn.addEventListener('click', resetGame);

document.getElementById('btnVolver').addEventListener('click', () => {
    window.location.href = '4basico.html';
});

const products = [
    { name: 'Caja de tomates', price: 2350, emoji: '🍅' },
    { name: 'Polera', price: 6990, emoji: '👕' },
    { name: 'Mochila', price: 8450, emoji: '🎒' },
    { name: 'Cuaderno', price: 1250, emoji: '📓' }
];

const correctOrder = [
    { name: 'Cuaderno', price: 1250 },
    { name: 'Caja de tomates', price: 2350 },
    { name: 'Polera', price: 6990 },
    { name: 'Mochila', price: 8450 }
];

let selectedProducts = [];
const productsContainer = document.getElementById('productsContainer');
const selectedOrder = document.getElementById('selectedOrder');
const resultBox = document.getElementById('result');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');

// Barajar productos para mostrarlos en desorden
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function addProductListener() {
    const buttons = document.querySelectorAll('.product-btn');
    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const price = Number(btn.dataset.price);
            const name = btn.dataset.name;

            if (selectedProducts.find((p) => p.price === price && p.name === name)) {
                // Remover si ya está seleccionado
                selectedProducts = selectedProducts.filter((p) => !(p.price === price && p.name === name));
                btn.classList.remove('selected');
            } else {
                // Agregar a la selección
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

        // Agregar eventos a botones de remover
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

    const isCorrect = selectedProducts.every((product, index) => product.price === correctOrder[index].price && product.name === correctOrder[index].name);

    if (isCorrect) {
        resultBox.innerHTML = `<div class="result success">¡Excelente! Ordenaste correctamente de menor a mayor. El orden es correcto: Cuaderno ($1.250) → Caja de tomates ($2.350) → Polera ($6.990) → Mochila ($8.450)</div>`;
    } else {
        resultBox.innerHTML = `<div class="result error">El orden no es correcto. Intenta de nuevo. Recuerda: de MENOR a MAYOR.</div>`;
    }
    resultBox.style.display = 'block';
}

function resetGame() {
    selectedProducts = [];
    document.querySelectorAll('.product-btn').forEach((btn) => {
        btn.classList.remove('selected');
    });
    updateSelectedOrder();
    resultBox.innerHTML = '';
}

// Inicializar
addProductListener();
submitBtn.addEventListener('click', verifyOrder);
resetBtn.addEventListener('click', resetGame);

document.getElementById('btnVolver').addEventListener('click', () => {
    window.location.href = '4basico.html';
});

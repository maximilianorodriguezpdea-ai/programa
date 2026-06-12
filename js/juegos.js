function speak(texto, lang = 'es-ES', rate = 1, pitch = 1) {
    if (!('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = lang;
    mensaje.rate = rate;
    mensaje.pitch = pitch;
    speechSynthesis.speak(mensaje);
}

function getScore() {
    return parseInt(sessionStorage.getItem('eduScore') || '0', 10);
}

function setScore(valor) {
    sessionStorage.setItem('eduScore', String(valor));
    const badge = document.getElementById('scoreValue');
    if (badge) badge.textContent = String(valor);
}

function addScore(delta) {
    setScore(getScore() + delta);
}

function renderScore() {
    const badge = document.getElementById('scoreValue');
    if (badge) {
        badge.textContent = String(getScore());
    }
}

function showConfetti(times = 25) {
    const container = document.querySelector('.confetti-container');
    if (!container) return;
    container.innerHTML = '';
    const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'];
    for (let i = 0; i < times; i += 1) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        const size = Math.random() * 12 + 8;
        piece.style.width = `${size}px`;
        piece.style.height = `${size * 0.4}px`;
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = `${Math.random() * 100}%`;
        piece.style.top = `${Math.random() * -20}%`;
        piece.style.opacity = `${0.8 + Math.random() * 0.2}`;
        piece.style.transform = `rotate(${Math.random() * 360}deg)`;
        piece.style.animationDuration = `${2 + Math.random() * 1.5}s`;
        container.appendChild(piece);
    }
    setTimeout(() => { container.innerHTML = ''; }, 3600);
}

function enableDragItems() {
    const items = document.querySelectorAll('.draggable-item');
    items.forEach((item) => {
        item.addEventListener('dragstart', () => {
            item.classList.add('dragging');
        });
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });
        item.addEventListener('click', () => {
            const audio = item.dataset.audio;
            if (audio) speak(audio);
        });
    });
}

function enableDropZones() {
    const zones = document.querySelectorAll('.drop-zone');
    zones.forEach((zone) => {
        zone.addEventListener('dragover', (event) => {
            event.preventDefault();
            zone.classList.add('drag-over');
        });
        zone.addEventListener('dragleave', () => {
            zone.classList.remove('drag-over');
        });
        zone.addEventListener('drop', (event) => {
            event.preventDefault();
            zone.classList.remove('drag-over');
            const item = document.querySelector('.draggable-item.dragging');
            if (!item) return;
            const targetValue = zone.dataset.answer;
            const itemValue = item.dataset.answer;
            if (!targetValue || !itemValue) return;
            if (targetValue === itemValue) {
                zone.appendChild(item);
                zone.classList.add('filled');
                item.setAttribute('draggable', 'false');
                item.classList.add('matched');
                speak('¡Muy bien!');
            } else {
                speak('Intenta otra vez.');
            }
        });
    });
}

function bindResetButton(resetId, initFunction) {
    const resetBtn = document.getElementById(resetId);
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            initFunction();
            const feedback = document.getElementById('feedback');
            if (feedback) feedback.textContent = 'Juego reiniciado. ¡Puedes intentar otra vez!';
            speak('Juego reiniciado.');
        });
    }
}

function startPage() {
    const btnStart = document.getElementById('startBtn');
    if (btnStart) {
        btnStart.addEventListener('click', () => {
            const intro = document.getElementById('instructionText');
            if (intro) speak(intro.textContent);
            addScore(0);
            const buttons = document.querySelectorAll('.draggable-item');
            buttons.forEach((item) => item.setAttribute('draggable', 'true'));
        });
    }
}

function initGame1() {
    const gameItems = [
        { label: '2', answer: 'dos', audio: 'Número dos' },
        { label: '4', answer: 'cuatro', audio: 'Número cuatro' },
        { label: '7', answer: 'siete', audio: 'Número siete' },
        { label: '9', answer: 'nueve', audio: 'Número nueve' },
        { label: '5', answer: 'cinco', audio: 'Número cinco' }
    ];
    const board = document.getElementById('draggableItems');
    const dropBoard = document.getElementById('dropZones');
    const feedback = document.getElementById('feedback');

    function render() {
        if (!board || !dropBoard) return;
        board.innerHTML = '';
        dropBoard.innerHTML = '';
        gameItems.forEach((item) => {
            const button = document.createElement('button');
            button.className = 'draggable-item';
            button.draggable = true;
            button.textContent = item.label;
            button.dataset.answer = item.answer;
            button.dataset.audio = item.audio;
            board.appendChild(button);
        });
        gameItems.slice().sort((a, b) => a.answer.localeCompare(b.answer)).forEach((item) => {
            const zone = document.createElement('div');
            zone.className = 'drop-zone';
            zone.dataset.answer = item.answer;
            zone.innerHTML = `<strong>${item.answer}</strong>`;
            dropBoard.appendChild(zone);
        });
        enableDragItems();
        enableDropZones();
        if (feedback) feedback.textContent = 'Arrastra cada número a la palabra correcta.';
    }

    render();
    bindResetButton('resetBtn', render);
    document.getElementById('checkBtn')?.addEventListener('click', () => {
        const zones = Array.from(document.querySelectorAll('.drop-zone'));
        const correct = zones.filter((zone) => zone.firstElementChild && zone.firstElementChild.dataset.answer === zone.dataset.answer).length;
        if (correct === zones.length) {
            feedback.textContent = '¡Excelente! Todos correctos.';
            showConfetti();
            addScore(100);
            document.getElementById('nextBtn').classList.remove('hidden');
            speak('¡Excelente! Pasemos al siguiente juego.');
        } else {
            feedback.textContent = `Tienes ${correct} de ${zones.length} correctos. Reintenta.`;
            speak('No todos son correctos. Intenta de nuevo.');
        }
    });
    document.getElementById('nextBtn')?.addEventListener('click', () => window.location.href = 'juego2.html');
}

function initGame2() {
    const gameItems = [
        { label: '4 estrellas', answer: 'cuatro', audio: 'Cuatro estrellas', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Emoji_u2b50.svg/120px-Emoji_u2b50.svg.png' },
        { label: '3 manzanas', answer: 'tres', audio: 'Tres manzanas', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/120px-Red_Apple.jpg' },
        { label: '1 sol', answer: 'uno', audio: 'Un sol', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Sun_symbol.svg/120px-Sun_symbol.svg.png' },
        { label: '2 libros', answer: 'dos', audio: 'Dos libros', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Book_icon.svg/120px-Book_icon.svg.png' },
        { label: '5 globos', answer: 'cinco', audio: 'Cinco globos', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Emoji_u1f388.svg/120px-Emoji_u1f388.svg.png' }
    ];
    const board = document.getElementById('draggableItems');
    const dropBoard = document.getElementById('dropZones');
    const feedback = document.getElementById('feedback');

    function render() {
        if (!board || !dropBoard) return;
        board.innerHTML = '';
        dropBoard.innerHTML = '';
        gameItems.forEach((item) => {
            const card = document.createElement('button');
            card.className = 'draggable-item image-card';
            card.draggable = true;
            card.dataset.answer = item.answer;
            card.dataset.audio = item.audio;
            card.innerHTML = `<img src="${item.image}" alt="${item.label}"><span>${item.label}</span>`;
            board.appendChild(card);
        });
        ['uno', 'dos', 'tres', 'cuatro', 'cinco'].forEach((answer) => {
            const zone = document.createElement('div');
            zone.className = 'drop-zone';
            zone.dataset.answer = answer;
            zone.innerHTML = `<strong>${answer}</strong>`;
            dropBoard.appendChild(zone);
        });
        enableDragItems();
        enableDropZones();
        if (feedback) feedback.textContent = 'Relaciona la imagen con la cantidad correcta.';
    }

    render();
    bindResetButton('resetBtn', render);
    document.getElementById('checkBtn')?.addEventListener('click', () => {
        const zones = Array.from(document.querySelectorAll('.drop-zone'));
        const correct = zones.filter((zone) => zone.firstElementChild && zone.firstElementChild.dataset.answer === zone.dataset.answer).length;
        if (correct === zones.length) {
            feedback.textContent = '¡Muy bien! Contaste y emparejaste todo correctamente.';
            showConfetti();
            addScore(100);
            document.getElementById('nextBtn').classList.remove('hidden');
            speak('Muy bien. Avanza al siguiente nivel.');
        } else {
            feedback.textContent = `Correcto: ${correct}/${zones.length}. Sigue intentando.`;
            speak('Revisa tus respuestas y vuelve a intentarlo.');
        }
    });
    document.getElementById('nextBtn')?.addEventListener('click', () => window.location.href = 'juego3.html');
}

function initGame3() {
    const letters = ['C', 'A', 'S', 'A'];
    const slots = ['C', 'A', 'S', 'A'];
    const board = document.getElementById('draggableItems');
    const dropBoard = document.getElementById('dropZones');
    const feedback = document.getElementById('feedback');

    function render() {
        if (!board || !dropBoard) return;
        board.innerHTML = '';
        dropBoard.innerHTML = '';
        letters.forEach((letter, index) => {
            const button = document.createElement('button');
            button.className = 'draggable-item';
            button.draggable = true;
            button.textContent = letter;
            button.dataset.answer = letter;
            button.dataset.audio = `Letra ${letter}`;
            board.appendChild(button);
        });
        slots.forEach((letter, index) => {
            const zone = document.createElement('div');
            zone.className = 'drop-zone';
            zone.dataset.answer = letter;
            zone.innerHTML = `<strong>Letra ${index + 1}</strong>`;
            dropBoard.appendChild(zone);
        });
        enableDragItems();
        enableDropZones();
        if (feedback) feedback.textContent = 'Forma la palabra CASA con las letras correctas.';
    }

    render();
    bindResetButton('resetBtn', render);
    document.getElementById('checkBtn')?.addEventListener('click', () => {
        const zones = Array.from(document.querySelectorAll('.drop-zone'));
        const correct = zones.filter((zone) => zone.firstElementChild && zone.firstElementChild.dataset.answer === zone.dataset.answer).length;
        if (correct === zones.length) {
            feedback.textContent = '¡Exacto! La palabra CASA está completa.';
            showConfetti();
            addScore(100);
            document.getElementById('nextBtn').classList.remove('hidden');
            speak('Perfecto. Sigamos con el siguiente juego.');
        } else {
            feedback.textContent = `Tienes ${correct} letras en el lugar correcto.`;
            speak('Revisa tus letras y reintenta.');
        }
    });
    document.getElementById('nextBtn')?.addEventListener('click', () => window.location.href = 'juego4.html');
}

function initGame4() {
    const numbers = [45, 12, 30, 19, 8];
    const board = document.getElementById('draggableItems');
    const dropBoard = document.getElementById('dropZones');
    const feedback = document.getElementById('feedback');

    function render() {
        if (!board || !dropBoard) return;
        board.innerHTML = '';
        dropBoard.innerHTML = '';
        numbers.forEach((value) => {
            const card = document.createElement('button');
            card.className = 'draggable-item';
            card.draggable = true;
            card.textContent = value;
            card.dataset.answer = String(value);
            card.dataset.audio = `Número ${value}`;
            board.appendChild(card);
        });
        for (let slot = 1; slot <= numbers.length; slot += 1) {
            const zone = document.createElement('div');
            zone.className = 'drop-zone';
            zone.dataset.index = String(slot - 1);
            zone.innerHTML = `<strong>Posición ${slot}</strong>`;
            dropBoard.appendChild(zone);
        }
        enableDragItems();
        enableDropZones();
        if (feedback) feedback.textContent = 'Ordena los números del menor al mayor en las casillas.';
    }

    render();
    bindResetButton('resetBtn', render);
    document.getElementById('checkBtn')?.addEventListener('click', () => {
        const zones = Array.from(document.querySelectorAll('.drop-zone'));
        const order = zones.map((zone) => zone.firstElementChild ? Number(zone.firstElementChild.dataset.answer) : NaN);
        const correctOrder = [...numbers].sort((a, b) => a - b);
        const correct = order.filter((value, index) => value === correctOrder[index]).length;
        if (correct === zones.length) {
            feedback.textContent = '¡Excelente! Los números están en orden correcto.';
            showConfetti();
            addScore(100);
            document.getElementById('nextBtn').classList.remove('hidden');
            speak('Muy bien, has ordenado correctamente. Vamos al siguiente juego.');
        } else {
            feedback.textContent = `${correct} de ${zones.length} están en el lugar correcto. Intenta otra vez.`;
            speak('Aún no es correcto. Reordena y vuelve a comprobar.');
        }
    });
    document.getElementById('nextBtn')?.addEventListener('click', () => window.location.href = 'juego5.html');
}

function initGame5() {
    const items = [
        { word: 'Libro', answer: 'leer', audio: 'Libro' , image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Book_icon.svg/120px-Book_icon.svg.png' },
        { word: 'Sol', answer: 'sol', audio: 'Sol', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Sun_symbol.svg/120px-Sun_symbol.svg.png' },
        { word: 'Pelota', answer: 'jugar', audio: 'Pelota', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Emoji_u26bd.svg/120px-Emoji_u26bd.svg.png' },
        { word: 'Casa', answer: 'hogar', audio: 'Casa', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Emoji_u1f3e0.svg/120px-Emoji_u1f3e0.svg.png' }
    ];
    const promptList = [
        { text: 'El lugar donde vives.', key: 'hogar' },
        { text: 'Lo que usas para leer.', key: 'leer' },
        { text: 'Un objeto redondo para jugar.', key: 'jugar' },
        { text: 'Brilla durante el día.', key: 'sol' }
    ];
    const board = document.getElementById('draggableItems');
    const dropBoard = document.getElementById('dropZones');
    const feedback = document.getElementById('feedback');

    function render() {
        if (!board || !dropBoard) return;
        board.innerHTML = '';
        dropBoard.innerHTML = '';
        items.forEach((item) => {
            const card = document.createElement('button');
            card.className = 'draggable-item image-card';
            card.draggable = true;
            card.dataset.answer = item.answer;
            card.dataset.audio = item.audio;
            card.innerHTML = `<img src="${item.image}" alt="${item.word}"><span>${item.word}</span>`;
            board.appendChild(card);
        });
        promptList.forEach((prompt) => {
            const zone = document.createElement('div');
            zone.className = 'drop-zone';
            zone.dataset.answer = prompt.key;
            zone.innerHTML = `<strong>${prompt.text}</strong>`;
            dropBoard.appendChild(zone);
        });
        enableDragItems();
        enableDropZones();
        if (feedback) feedback.textContent = 'Relaciona cada imagen con la frase correcta.';
    }

    render();
    bindResetButton('resetBtn', render);
    document.getElementById('checkBtn')?.addEventListener('click', () => {
        const zones = Array.from(document.querySelectorAll('.drop-zone'));
        const correct = zones.filter((zone) => zone.firstElementChild && zone.firstElementChild.dataset.answer === zone.dataset.answer).length;
        if (correct === zones.length) {
            feedback.textContent = '¡Perfecto! Todas las imágenes coinciden con las frases.';
            showConfetti();
            addScore(100);
            document.getElementById('nextBtn').classList.remove('hidden');
            speak('Muy bien, has completado el último juego.');
        } else {
            feedback.textContent = `${correct} de ${zones.length} son correctos. Sigue intentando.`;
            speak('Aún no están todas correctas. Revisa y vuelve a intentar.');
        }
    });
    document.getElementById('nextBtn')?.addEventListener('click', () => window.location.href = 'final.html');
}

function initFinalPage() {
    const score = getScore();
    const scoreValue = document.getElementById('finalScore');
    const message = document.getElementById('finalMessage');
    const link = document.getElementById('btnRestart');
    if (scoreValue) scoreValue.textContent = String(score);
    if (message) {
        if (score >= 450) {
            message.textContent = '¡Felicidades! Eres un campeón de los números y las palabras.';
        } else if (score >= 300) {
            message.textContent = 'Muy bien hecho. Sigue practicando para mejorar aún más.';
        } else {
            message.textContent = 'Buen intento. Puedes volver a jugar y obtener más puntos.';
        }
    }
    showConfetti(40);
    speak('Has terminado el recorrido. Felicidades por tu logro.', 'es-ES', 1, 1.1);
    if (link) {
        link.addEventListener('click', () => {
            setScore(0);
            window.location.href = 'basico4.html';
        });
    }
}

function initTodosPage() {
    const buttons = document.querySelectorAll('[data-speak]');
    buttons.forEach((button) => {
        button.addEventListener('click', () => speak(button.dataset.speak));
    });
}

function initBasico4Page() {
    const intro = document.getElementById('lessonIntro');
    if (intro) {
        speak(intro.textContent, 'es-ES', 0.98);
    }
    const audioButtons = document.querySelectorAll('.audio-play');
    audioButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.text;
            if (text) speak(text, 'es-ES', 1, 1.1);
        });
    });
    document.getElementById('btnStartGames')?.addEventListener('click', () => window.location.href = 'juego1.html');
}

function initPage() {
    renderScore();
    const page = document.body.dataset.page;
    startPage();
    if (page === 'basico4') initBasico4Page();
    if (page === 'juego1') initGame1();
    if (page === 'juego2') initGame2();
    if (page === 'juego3') initGame3();
    if (page === 'juego4') initGame4();
    if (page === 'juego5') initGame5();
    if (page === 'final') initFinalPage();
    if (page === 'todos') initTodosPage();
}

window.addEventListener('DOMContentLoaded', initPage);

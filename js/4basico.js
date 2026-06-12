function hablar(texto) {
    if (!window.speechSynthesis) return;
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = 'es-ES';
    speechSynthesis.cancel();
    speechSynthesis.speak(voz);
}

// Bienvenida
hablar('Bienvenido a los juegos de cuarto básico. Elige un juego para empezar.');


// AcciÃ³n del primer botÃ³n: redirige a la nueva actividad de supermercado
const btnNumeros = document.getElementById("btnNumeros");
if (btnNumeros) {
    btnNumeros.addEventListener("click", () => {
        window.location.href = "superM.html";
    });
}

// AcciÃ³n del botÃ³n SemÃ¡foro NumÃ©rico
const btnAct2 = document.getElementById("btnAct2");
if (btnAct2) {
    btnAct2.addEventListener("click", () => {
        window.location.href = "semaforo.html";
    });
}

// AcciÃ³n del botÃ³n Planeta 10.000
const btnAct3 = document.getElementById("btnAct3");
if (btnAct3) {
    btnAct3.addEventListener("click", () => {
        window.location.href = "planeta10000.html";
    });
}

const btnAct4 = document.getElementById("btnAct4");
if (btnAct4) {
    btnAct4.addEventListener("click", () => {
        window.location.href = "bingo-miles.html";
    });
}

const btnAct5 = document.getElementById("btnAct5");
if (btnAct5) {
    btnAct5.addEventListener("click", () => {
        window.location.href = "detective-numeros.html";
    });
}

const btnAct6 = document.getElementById("btnAct6");
if (btnAct6) {
    btnAct6.addEventListener("click", () => {
        window.location.href = "ordenrelampago.html";
    });
}

const btnTodos = document.getElementById("btnTodos");
if (btnTodos) {
    btnTodos.addEventListener("click", () => {
        window.location.href = "todos.html";
    });
}


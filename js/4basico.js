document.getElementById("btnVolver").addEventListener("click", () => {
    window.location.href = "indexbienvenida.html";
});

// Acción del primer botón: redirige a la nueva actividad de supermercado
const btnNumeros = document.getElementById("btnNumeros");
if (btnNumeros) {
    btnNumeros.addEventListener("click", () => {
        window.location.href = "superM.html";
    });
}

// Acción del botón Semáforo Numérico
const btnAct2 = document.getElementById("btnAct2");
if (btnAct2) {
    btnAct2.addEventListener("click", () => {
        window.location.href = "semaforo.html";
    });
}

// Acción del botón Planeta 10.000
const btnAct3 = document.getElementById("btnAct3");
if (btnAct3) {
    btnAct3.addEventListener("click", () => {
        window.location.href = "planeta10000.html";
    });
}


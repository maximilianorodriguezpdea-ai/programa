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

document.getElementById("btnVolver").addEventListener("click", () => {
    window.location.href = "indexbienvenida.html";
});

// Acción del primer botón: redirige a la página de conteo
const btnNumeros = document.getElementById("btnNumeros");
if(btnNumeros){
    btnNumeros.addEventListener("click", () => {
        window.location.href = "conteo0a10000.html";
    });
}

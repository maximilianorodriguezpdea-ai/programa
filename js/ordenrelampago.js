const tarjetas = document.getElementById("tarjetas");
const respuesta = document.getElementById("respuesta");
const ordenCorrecto = document.getElementById("orden-correcto");
const mensaje = document.getElementById("mensaje");
const tiempoTexto = document.getElementById("tiempo");
const totalTarjetasTexto = document.getElementById("total-tarjetas");
const mejorTiempoTexto = document.getElementById("mejor-tiempo");
const cantidadInput = document.getElementById("cantidad");
const minimoInput = document.getElementById("minimo");
const maximoInput = document.getElementById("maximo");
const segundosInput = document.getElementById("segundos");
const btnGenerar = document.getElementById("btn-generar");
const btnIniciar = document.getElementById("btn-iniciar");
const btnIniciarSerie = document.getElementById("btn-iniciar-serie");
const btnDetener = document.getElementById("btn-detener");
const btnRevisar = document.getElementById("btn-revisar");
const btnMezclar = document.getElementById("btn-mezclar");
const btnVolver = document.getElementById("btn-volver");
const confettiContainer = document.getElementById("confetti");

let numeros = [];
let temporizador = null;
let segundosRestantes = Number(segundosInput.value);
let segundosIniciales = Number(segundosInput.value);
let mejorTiempo = null;

const TOTAL_EJERCICIOS = 10;
let ejercicioActual = 0;
let puntuacion = 0;
let resultadosEjercicios = [];
let enSerie = false;

function azar(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatear(numero) {
    return numero.toLocaleString("es-CL");
}

function obtenerAjustes() {
    let cantidad = Math.min(12, Math.max(3, Number(cantidadInput.value) || 6));
    let minimo = Math.min(9999, Math.max(0, Number(minimoInput.value) || 0));
    let maximo = Math.min(10000, Math.max(1, Number(maximoInput.value) || 10000));
    let segundos = Math.min(180, Math.max(10, Number(segundosInput.value) || 45));

    if (minimo >= maximo) {
        minimo = 0;
        maximo = 10000;
    }

    if (maximo - minimo + 1 < cantidad) {
        cantidad = maximo - minimo + 1;
    }

    cantidadInput.value = cantidad;
    minimoInput.value = minimo;
    maximoInput.value = maximo;
    segundosInput.value = segundos;

    return { cantidad, minimo, maximo, segundos };
}

function mezclar(lista) {
    const copia = [...lista];
    for (let i = copia.length - 1; i > 0; i -= 1) {
        const j = azar(0, i);
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}

function generarNumeros() {
    const { cantidad, minimo, maximo, segundos } = obtenerAjustes();
    const usados = new Set();
    const lista = [];

    while (lista.length < cantidad) {
        const candidato = azar(minimo, maximo);
        if (!usados.has(candidato)) {
            usados.add(candidato);
            lista.push(candidato);
        }
    }

    numeros = mezclar(lista);
    segundosIniciales = segundos;
    segundosRestantes = segundos;
    tiempoTexto.textContent = segundosRestantes;
    totalTarjetasTexto.textContent = numeros.length;
    respuesta.classList.add("oculto");
    detenerTiempo();
    dibujarTarjetas();
}

function dibujarTarjetas() {
    tarjetas.innerHTML = "";

    numeros.forEach((numero, indice) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta";
        tarjeta.draggable = true;
        tarjeta.dataset.numero = numero;
        tarjeta.innerHTML = `<span>Tarjeta ${indice + 1}</span><strong>${formatear(numero)}</strong>`;
        tarjeta.addEventListener("dragstart", alArrastrar);
        tarjeta.addEventListener("dragover", alPasarEncima);
        tarjeta.addEventListener("dragleave", () => tarjeta.classList.remove("sobre"));
        tarjeta.addEventListener("drop", alSoltar);
        tarjeta.addEventListener("dragend", limpiarArrastre);
        tarjetas.appendChild(tarjeta);
    });
}

function alArrastrar(evento) {
    evento.currentTarget.classList.add("arrastrando");
    evento.dataTransfer.setData("text/plain", evento.currentTarget.dataset.numero);
}

function alPasarEncima(evento) {
    evento.preventDefault();
    const tarjeta = evento.currentTarget;
    if (!tarjeta.classList.contains("arrastrando")) {
        tarjeta.classList.add("sobre");
    }
}

function alSoltar(evento) {
    evento.preventDefault();
    const destino = evento.currentTarget;
    const origen = document.querySelector(".tarjeta.arrastrando");

    if (!origen || origen === destino) return;

    const origenIndice = Array.from(tarjetas.children).indexOf(origen);
    const destinoIndice = Array.from(tarjetas.children).indexOf(destino);
    [numeros[origenIndice], numeros[destinoIndice]] = [numeros[destinoIndice], numeros[origenIndice]];
    dibujarTarjetas();
    setTimeout(() => {
        if (verificarOrden()) {
            finalizarEjercicio(true);
        }
    }, 120);
}

function limpiarArrastre() {
    document.querySelectorAll(".tarjeta").forEach((tarjeta) => {
        tarjeta.classList.remove("arrastrando", "sobre");
    });
}

function iniciarTiempo() {
    if (temporizador) return;

    respuesta.classList.add("oculto");
    segundosIniciales = Math.min(180, Math.max(10, Number(segundosInput.value) || segundosIniciales));
    if (segundosRestantes <= 0 || segundosRestantes > segundosIniciales) {
        segundosRestantes = segundosIniciales;
    }

    tiempoTexto.textContent = segundosRestantes;
    cambiarMensaje(`Ejercicio ${ejercicioActual} de ${TOTAL_EJERCICIOS}. Ordenense de menor a mayor. Tiempo corriendo.`, "alerta");

    temporizador = setInterval(() => {
        segundosRestantes -= 1;
        tiempoTexto.textContent = segundosRestantes;

        if (segundosRestantes <= 0) {
            detenerTiempo();
            cambiarMensaje("Tiempo terminado. Revisen el orden correcto.", "alerta");
            mostrarOrden();
            const correcto = verificarOrden();
            finalizarEjercicio(correcto);
        }
    }, 1000);
}

function detenerTiempo() {
    if (temporizador) {
        clearInterval(temporizador);
        temporizador = null;
    }
}

function detenerYGuardar() {
    if (!temporizador) return;

    detenerTiempo();
    const usado = segundosIniciales - segundosRestantes;
    if (usado > 0 && (mejorTiempo === null || usado < mejorTiempo)) {
        mejorTiempo = usado;
        mejorTiempoTexto.textContent = `${mejorTiempo}s`;
    }
    cambiarMensaje("Tiempo detenido. Ahora comparen su fila con el orden correcto.", "exito");
}

function mostrarOrden() {
    const ordenados = [...numeros].sort((a, b) => a - b);
    ordenCorrecto.innerHTML = "";

    ordenados.forEach((numero) => {
        const item = document.createElement("span");
        item.textContent = formatear(numero);
        ordenCorrecto.appendChild(item);
    });

    respuesta.classList.remove("oculto");
}

function verificarOrden() {
    for (let i = 0; i < numeros.length - 1; i += 1) {
        if (Number(numeros[i]) > Number(numeros[i + 1])) return false;
    }
    return true;
}

function mezclarTarjetas() {
    numeros = mezclar(numeros);
    respuesta.classList.add("oculto");
    dibujarTarjetas();
    cambiarMensaje("Tarjetas mezcladas. Listos para una nueva ronda.", "");
}

function cambiarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
}

function iniciarEjercicio() {
    if (ejercicioActual >= TOTAL_EJERCICIOS) return;
    ejercicioActual += 1;
    generarNumeros();
    cambiarMensaje(`Ejercicio ${ejercicioActual} de ${TOTAL_EJERCICIOS}. Preparen y presionen Iniciar tiempo.`, "");
}

function iniciarJuego() {
    ejercicioActual = 0;
    puntuacion = 0;
    resultadosEjercicios = [];
    iniciarEjercicio();
}

function finalizarEjercicio(correcto) {
    detenerTiempo();
    mostrarOrden();
    resultadosEjercicios.push(Boolean(correcto));
    if (correcto) {
        puntuacion += 100;
        cambiarMensaje(`¡Correcto! +100 puntos. Total: ${puntuacion}`, "exito");
    } else {
        cambiarMensaje(`No fue correcto. Total: ${puntuacion}`, "alerta");
    }

    if (enSerie) {
        if (ejercicioActual < TOTAL_EJERCICIOS) {
            setTimeout(() => {
                iniciarEjercicio();
            }, 1200);
        } else {
            setTimeout(() => {
                mostrarResultados();
            }, 800);
        }
    }
}

function mostrarResultados() {
    cambiarMensaje(`Serie completada. Total: ${puntuacion} / ${TOTAL_EJERCICIOS * 100}`, "exito");

    // Voz y confeti según puntaje
    if (puntuacion >= 750) {
        hablar('felicidades, eres muy bueno');
        lanzarConfeti();
    } else if (puntuacion >= 400) {
        hablar('eres bueno, pero puede ser mejor, sigue intentando');
    } else {
        hablar('sigue intentando y llegaras lejos');
    }
}

function hablar(texto) {
    try {
        const msg = new SpeechSynthesisUtterance(texto);
        msg.lang = 'es-ES';
        speechSynthesis.cancel();
        speechSynthesis.speak(msg);
    } catch (e) {
        // Silenciar si no disponible
        console.warn('Speech not available', e);
    }
}

function lanzarConfeti() {
    confettiContainer.innerHTML = '';
    const emojis = ['🎉','✨','🎊','🥳','🌟'];
    for (let i = 0; i < 40; i += 1) {
        const s = document.createElement('span');
        s.textContent = emojis[azar(0, emojis.length - 1)];
        s.style.left = `${azar(5, 95)}%`;
        s.style.top = `-10vh`;
        s.style.animationDelay = `${(Math.random() * 1.5).toFixed(2)}s`;
        s.style.fontSize = `${azar(16, 28)}px`;
        confettiContainer.appendChild(s);
    }
    // Remover confeti después de un tiempo
    setTimeout(() => { confettiContainer.innerHTML = ''; }, 8000);
}

btnGenerar.addEventListener("click", generarNumeros);
btnIniciar.addEventListener("click", iniciarTiempo);
btnIniciarSerie.addEventListener("click", () => { enSerie = true; iniciarJuego(); });
btnDetener.addEventListener("click", detenerYGuardar);
btnRevisar.addEventListener("click", mostrarOrden);
btnMezclar.addEventListener("click", mezclarTarjetas);
btnVolver.addEventListener("click", () => {
    window.location.href = "4basico.html";
});

// Inicializar: mostrar tarjetas para un ejercicio, pero no iniciar la serie automáticamente
generarNumeros();

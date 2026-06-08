const carton = document.getElementById("carton");
const pista = document.getElementById("pista");
const respuesta = document.getElementById("respuesta");
const mensaje = document.getElementById("mensaje");
const aciertosTexto = document.getElementById("aciertos");
const rondaTexto = document.getElementById("ronda");
const lineasTexto = document.getElementById("lineas");
const resultadoFinal = document.getElementById("resultado-final");
const tablaAciertos = document.getElementById("tabla-aciertos");
const tablaPuntos = document.getElementById("tabla-puntos");
const tablaMensaje = document.getElementById("tabla-mensaje");
const btnNuevaPista = document.getElementById("btn-nueva-pista");
const btnLeerPista = document.getElementById("btn-leer-pista");
const btnMostrarRespuesta = document.getElementById("btn-mostrar-respuesta");
const btnNuevoCarton = document.getElementById("btn-nuevo-carton");
const btnReiniciar = document.getElementById("btn-reiniciar");
const btnVolver = document.getElementById("btn-volver");

const totalRondas = 12;
let numerosCarton = [];
let objetivo = null;
let ronda = 0;
let aciertos = 0;
let lineas = 0;
let numerosCantados = new Set();
let juegoTerminado = false;

function azar(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function normalizarMiles(numero) {
    return numero.toLocaleString("es-CL");
}

function convertirCentenas(numero) {
    const unidades = ["", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve"];
    const especiales = ["diez", "once", "doce", "trece", "catorce", "quince", "dieciseis", "diecisiete", "dieciocho", "diecinueve"];
    const decenas = ["", "", "veinte", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];
    const centenas = ["", "ciento", "doscientos", "trescientos", "cuatrocientos", "quinientos", "seiscientos", "setecientos", "ochocientos", "novecientos"];

    if (numero === 0) return "";
    if (numero === 100) return "cien";
    if (numero < 10) return unidades[numero];
    if (numero < 20) return especiales[numero - 10];
    if (numero < 30) {
        if (numero === 20) return "veinte";
        return "veinti" + unidades[numero - 20];
    }

    const c = Math.floor(numero / 100);
    const resto = numero % 100;
    const d = Math.floor(resto / 10);
    const u = resto % 10;
    let texto = centenas[c];

    if (resto > 0) {
        if (texto) texto += " ";
        texto += decenas[d];
        if (u > 0) texto += " y " + unidades[u];
    }

    return texto;
}

function numeroEnPalabras(numero) {
    if (numero === 0) return "cero";
    if (numero === 10000) return "diez mil";

    const miles = Math.floor(numero / 1000);
    const resto = numero % 1000;
    let texto = "";

    if (miles === 1) {
        texto = "mil";
    } else if (miles > 1) {
        texto = convertirCentenas(miles) + " mil";
    }

    if (resto > 0) {
        texto += (texto ? " " : "") + convertirCentenas(resto);
    }

    return texto;
}

function formaExpandida(numero) {
    const partes = [];
    const miles = Math.floor(numero / 1000) * 1000;
    const centenas = Math.floor((numero % 1000) / 100) * 100;
    const decenas = Math.floor((numero % 100) / 10) * 10;
    const unidades = numero % 10;

    [miles, centenas, decenas, unidades].forEach((parte) => {
        if (parte > 0) partes.push(normalizarMiles(parte));
    });

    return partes.join(" + ") || "0";
}

function crearPista(numero) {
    const tipo = azar(1, 6);

    if (tipo === 1) {
        return numeroEnPalabras(numero);
    }

    if (tipo === 2 && numero > 0 && numero < 10000) {
        return `El numero que esta entre ${normalizarMiles(numero - 1)} y ${normalizarMiles(numero + 1)}`;
    }

    if (tipo === 3) {
        return `Forma desarrollada: ${formaExpandida(numero)}`;
    }

    if (tipo === 4) {
        const miles = Math.floor(numero / 1000);
        const resto = numero % 1000;
        return `${miles} unidades de mil y ${resto} unidades`;
    }

    if (tipo === 5) {
        return `Tiene ${Math.floor(numero / 1000)} miles, ${Math.floor((numero % 1000) / 100)} centenas, ${Math.floor((numero % 100) / 10)} decenas y ${numero % 10} unidades`;
    }

    return `Numero: ${normalizarMiles(numero)}`;
}

function generarNumeros() {
    const usados = new Set();
    const lista = [];

    while (lista.length < 25) {
        const candidato = azar(0, 10000);
        if (!usados.has(candidato)) {
            usados.add(candidato);
            lista.push(candidato);
        }
    }

    return lista;
}

function dibujarCarton() {
    carton.innerHTML = "";

    numerosCarton.forEach((numero) => {
        const casilla = document.createElement("button");
        casilla.className = "casilla";
        casilla.textContent = normalizarMiles(numero);
        casilla.dataset.numero = numero;
        casilla.addEventListener("click", () => marcarNumero(casilla, numero));
        carton.appendChild(casilla);
    });
}

function nuevaPista() {
    if (juegoTerminado) return;

    const disponibles = numerosCarton.filter((numero) => !numerosCantados.has(numero));

    if (disponibles.length === 0 || ronda >= totalRondas) {
        finalizarJuego();
        return;
    }

    objetivo = disponibles[azar(0, disponibles.length - 1)];
    numerosCantados.add(objetivo);
    ronda += 1;
    pista.textContent = crearPista(objetivo);
    respuesta.textContent = `Respuesta: ${normalizarMiles(objetivo)}`;
    respuesta.classList.add("oculto");
    rondaTexto.textContent = ronda;
    cambiarMensaje("Busca y marca el numero correcto en tu carton.", "");
    hablar(pista.textContent);
}

function marcarNumero(casilla, numero) {
    if (!objetivo || juegoTerminado) {
        cambiarMensaje("Primero pide una pista nueva.", "error");
        return;
    }

    if (numero !== objetivo) {
        cambiarMensaje("Ese numero no corresponde a la pista. Intenta otra vez.", "error");
        return;
    }

    if (!casilla.classList.contains("marcada")) {
        casilla.classList.add("marcada");
        casilla.classList.add("objetivo");
        aciertos += 1;
        aciertosTexto.textContent = aciertos;
        objetivo = null;
        calcularLineas();
        if (lineas > 0) {
            cambiarMensaje("Bingo. Completaste una linea. Sigue hasta terminar las 12 rondas.", "correcto");
        } else {
            cambiarMensaje("Correcto. Puedes pedir otra pista.", "correcto");
        }
    }

    if (ronda >= totalRondas) {
        finalizarJuego();
    }
}

function calcularLineas() {
    const casillas = Array.from(document.querySelectorAll(".casilla"));
    const marcada = (indice) => casillas[indice].classList.contains("marcada");
    const combinaciones = [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20]
    ];

    lineas = combinaciones.filter((grupo) => grupo.every(marcada)).length;
    lineasTexto.textContent = lineas;
}

function cambiarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
}

function hablar(texto) {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "es-CL";
    speechSynthesis.speak(voz);
}

function finalizarJuego() {
    juegoTerminado = true;
    btnNuevaPista.disabled = true;
    objetivo = null;

    const puntos = aciertos * 100;
    let textoResultado = "";
    let mensajeVoz = "";

    if (puntos >= 900) {
        textoResultado = "Excelente resultado";
        mensajeVoz = "felicidades, eres muy bueno";
        cambiarMensaje("Juego terminado. Excelente trabajo.", "correcto");
        lanzarConfeti();
        setTimeout(() => hablar(mensajeVoz), 900);
    } else if (puntos >= 600) {
        textoResultado = "Buen resultado";
        mensajeVoz = "felicidades";
        cambiarMensaje("Juego terminado. Felicidades.", "correcto");
        hablar(mensajeVoz);
    } else {
        textoResultado = "A practicar otra vez";
        mensajeVoz = "uy, intentemos de nuevo";
        cambiarMensaje("Juego terminado. Intentemos de nuevo.", "error");
        hablar(mensajeVoz);
    }

    pista.textContent = "Bingo terminado";
    respuesta.classList.add("oculto");
    tablaAciertos.textContent = `${aciertos} de ${totalRondas}`;
    tablaPuntos.textContent = puntos;
    tablaMensaje.textContent = textoResultado;
    resultadoFinal.classList.remove("oculto");
}

function reiniciarMarcas() {
    document.querySelectorAll(".casilla").forEach((casilla) => {
        casilla.classList.remove("marcada", "objetivo");
    });
    objetivo = null;
    ronda = 0;
    aciertos = 0;
    lineas = 0;
    numerosCantados = new Set();
    juegoTerminado = false;
    btnNuevaPista.disabled = false;
    aciertosTexto.textContent = "0";
    rondaTexto.textContent = "0";
    lineasTexto.textContent = "0";
    pista.textContent = "Presiona Nueva pista para comenzar.";
    respuesta.classList.add("oculto");
    resultadoFinal.classList.add("oculto");
    tablaAciertos.textContent = "0";
    tablaPuntos.textContent = "0";
    tablaMensaje.textContent = "Sigue jugando";
    cambiarMensaje("Completa una linea horizontal, vertical o diagonal.", "");
}

function nuevoCarton() {
    numerosCarton = generarNumeros();
    dibujarCarton();
    reiniciarMarcas();
}

function lanzarConfeti() {
    const canvas = document.getElementById("confeti");
    const ctx = canvas.getContext("2d");
    const piezas = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < 180; i++) {
        piezas.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            tamano: azar(5, 11),
            color: `hsl(${azar(0, 360)}, 85%, 58%)`,
            velocidad: Math.random() * 3 + 2
        });
    }

    let cuadros = 0;

    function animar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        piezas.forEach((pieza) => {
            ctx.fillStyle = pieza.color;
            ctx.fillRect(pieza.x, pieza.y, pieza.tamano, pieza.tamano);
            pieza.y += pieza.velocidad;
            pieza.x += Math.sin(cuadros / 12) * 0.8;
        });
        cuadros += 1;

        if (cuadros < 220) {
            requestAnimationFrame(animar);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animar();
}

btnNuevaPista.addEventListener("click", nuevaPista);
btnLeerPista.addEventListener("click", () => hablar(pista.textContent));
btnMostrarRespuesta.addEventListener("click", () => respuesta.classList.toggle("oculto"));
btnNuevoCarton.addEventListener("click", nuevoCarton);
btnReiniciar.addEventListener("click", reiniciarMarcas);
btnVolver.addEventListener("click", () => {
    window.location.href = "4basico.html";
});

nuevoCarton();

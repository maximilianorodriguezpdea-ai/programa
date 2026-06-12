const estadoCaso = document.getElementById("estado-caso");
const mensaje = document.getElementById("mensaje");
const contadorPreguntas = document.getElementById("contador-preguntas");
const contadorIntentos = document.getElementById("contador-intentos");
const puntosTexto = document.getElementById("puntos");
const historial = document.getElementById("historial");
const inputRespuesta = document.getElementById("input-respuesta");
const tipoPregunta = document.getElementById("tipo-pregunta");
const valorPregunta = document.getElementById("valor-pregunta");
const btnAdivinar = document.getElementById("btn-adivinar");
const btnPreguntar = document.getElementById("btn-preguntar");
const btnNuevoJuego = document.getElementById("btn-nuevo-juego");
const btnPista = document.getElementById("btn-pista");
const btnRendirse = document.getElementById("btn-rendirse");
const btnVolver = document.getElementById("btn-volver");
const botonesPregunta = document.querySelectorAll("[data-pregunta]");

let numeroSecreto = 0;
let preguntas = 0;
let intentos = 0;
let puntos = 1000;
let juegoTerminado = false;
let pistasFaciles = 0;

function azar(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formato(numero) {
    return Number(numero).toLocaleString("es-CL");
}

function hablar(texto) {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "es-CL";
    speechSynthesis.speak(voz);
}

function actualizarMarcadores() {
    contadorPreguntas.textContent = preguntas;
    contadorIntentos.textContent = intentos;
    puntosTexto.textContent = puntos;
}

function agregarHistorial(texto, clase) {
    const item = document.createElement("li");
    item.textContent = texto;
    if (clase) item.classList.add(clase);
    historial.prepend(item);
}

function calcularPuntos() {
    puntos = Math.max(0, 1000 - preguntas * 45 - intentos * 90);
    actualizarMarcadores();
}

function responderPregunta(texto, respuesta) {
    if (juegoTerminado) return;

    preguntas += 1;
    calcularPuntos();
    const pistaClara = interpretarPregunta(texto, respuesta);
    agregarHistorial(pistaClara, respuesta ? "si" : "no");
    mensaje.textContent = pistaClara;
    hablar(pistaClara);
}

function interpretarPregunta(texto, respuesta) {
    const inicio = respuesta ? "SI" : "NO";
    let explicacion = texto
        .replace("¿", "")
        .replace("?", "")
        .replace("Es ", "es ")
        .replace("Tiene ", "tiene ");

    if (!respuesta) {
        explicacion = explicacion
            .replace("es mayor que", "no es mayor que")
            .replace("es menor que", "no es menor que")
            .replace("es multiplo de", "no es multiplo de")
            .replace("tiene", "no tiene");
    }

    return `${inicio}. El numero ${explicacion}.`;
}

function hacerPreguntaRapida(tipo) {
    const preguntasRapidas = {
        "mayor-5000": {
            texto: "¿Es mayor que 5.000?",
            respuesta: numeroSecreto > 5000
        },
        "menor-5000": {
            texto: "¿Es menor que 5.000?",
            respuesta: numeroSecreto < 5000
        },
        "cuatro-cifras": {
            texto: "¿Tiene 4 cifras?",
            respuesta: numeroSecreto >= 1000 && numeroSecreto <= 9999
        },
        "cinco-cifras": {
            texto: "¿Tiene 5 cifras?",
            respuesta: numeroSecreto === 10000
        },
        "multiplo-10": {
            texto: "¿Es multiplo de 10?",
            respuesta: numeroSecreto % 10 === 0
        },
        "multiplo-100": {
            texto: "¿Es multiplo de 100?",
            respuesta: numeroSecreto % 100 === 0
        },
        par: {
            texto: "¿Es par?",
            respuesta: numeroSecreto % 2 === 0
        },
        impar: {
            texto: "¿Es impar?",
            respuesta: numeroSecreto % 2 !== 0
        }
    };

    const pregunta = preguntasRapidas[tipo];
    responderPregunta(pregunta.texto, pregunta.respuesta);
}

function hacerPreguntaPersonalizada() {
    if (juegoTerminado) return;

    const valor = Number(valorPregunta.value);

    if (!Number.isInteger(valor) || valor < 0 || valor > 10000) {
        mensaje.textContent = "Escribe un numero entre 0 y 10.000 para preguntar.";
        return;
    }

    if (tipoPregunta.value === "multiplo" && valor === 0) {
        mensaje.textContent = "Para preguntar por multiplos, usa un numero mayor que 0.";
        return;
    }

    const textos = {
        mayor: `¿Es mayor que ${formato(valor)}?`,
        menor: `¿Es menor que ${formato(valor)}?`,
        igual: `¿Es igual a ${formato(valor)}?`,
        multiplo: `¿Es multiplo de ${formato(valor)}?`
    };

    const respuestas = {
        mayor: numeroSecreto > valor,
        menor: numeroSecreto < valor,
        igual: numeroSecreto === valor,
        multiplo: numeroSecreto % valor === 0
    };

    responderPregunta(textos[tipoPregunta.value], respuestas[tipoPregunta.value]);
    valorPregunta.value = "";
}

function adivinar() {
    if (juegoTerminado) return;

    const sospecha = Number(inputRespuesta.value);

    if (!Number.isInteger(sospecha) || sospecha < 0 || sospecha > 10000) {
        mensaje.textContent = "Tu sospecha debe ser un numero entre 0 y 10.000.";
        return;
    }

    intentos += 1;

    if (sospecha === numeroSecreto) {
        calcularPuntos();
        finalizarVictoria();
        return;
    }

    calcularPuntos();

    if (sospecha < numeroSecreto) {
        mensaje.textContent = "No es ese. Tu sospecha es menor que el numero secreto.";
        agregarHistorial(`${formato(sospecha)} no es. Es mayor.`, "no");
    } else {
        mensaje.textContent = "No es ese. Tu sospecha es mayor que el numero secreto.";
        agregarHistorial(`${formato(sospecha)} no es. Es menor.`, "no");
    }

    hablar(mensaje.textContent);
    inputRespuesta.value = "";
}

function darPistaExtra() {
    if (juegoTerminado) return;

    preguntas += 1;
    calcularPuntos();

    pistasFaciles += 1;
    const pista = obtenerPistaFacil();
    agregarHistorial(pista, "si");
    mensaje.textContent = pista;
    hablar(pista);
}

function obtenerPistaFacil() {
    const tramoMilInicio = Math.floor(numeroSecreto / 1000) * 1000;
    const tramoMilFin = Math.min(10000, tramoMilInicio + 999);
    const tramoCentenaInicio = Math.floor(numeroSecreto / 100) * 100;
    const tramoCentenaFin = Math.min(10000, tramoCentenaInicio + 99);
    const ultimoDigito = numeroSecreto % 10;
    const mitad = numeroSecreto >= 5000 ? "es grande: esta entre 5.000 y 10.000" : "es pequeno: esta entre 0 y 4.999";
    const paridad = numeroSecreto % 2 === 0 ? "par" : "impar";
    const pistas = [
        `Pista facil: el numero ${mitad}.`,
        `Pista facil: busca desde ${formato(tramoMilInicio)} hasta ${formato(tramoMilFin)}.`,
        `Pista facil: esta cerca de ${formato(tramoCentenaInicio)}. Busca hasta ${formato(tramoCentenaFin)}.`,
        `Pista facil: el numero es ${paridad}.`,
        `Pista facil: termina en ${ultimoDigito}.`,
        `Pista facil: un digito visible es ${crearNumeroOculto()}.`
    ];

    return pistas[(pistasFaciles - 1) % pistas.length];
}

function crearNumeroOculto() {
    const texto = String(numeroSecreto);
    const posicionVisible = pistasFaciles % texto.length;

    return texto
        .split("")
        .map((digito, indice) => indice === posicionVisible ? digito : "*")
        .join("");
}

function finalizarVictoria() {
    juegoTerminado = true;
    estadoCaso.textContent = `Resuelto: ${formato(numeroSecreto)}`;
    mensaje.textContent = `Correcto. Ganaste con ${puntos} puntos.`;
    agregarHistorial(`Caso resuelto. El numero era ${formato(numeroSecreto)}. Puntaje: ${puntos}.`, "final");
    desactivarControles(true);
    lanzarConfeti();
    hablar("felicidades, resolviste el caso");
}

function rendirse() {
    if (juegoTerminado) return;

    juegoTerminado = true;
    puntos = 0;
    actualizarMarcadores();
    estadoCaso.textContent = `Era ${formato(numeroSecreto)}`;
    mensaje.textContent = "Caso cerrado. Puedes iniciar un nuevo caso.";
    agregarHistorial(`El numero secreto era ${formato(numeroSecreto)}.`, "final");
    desactivarControles(true);
    hablar("intentemos un nuevo caso");
}

function desactivarControles(desactivar) {
    btnAdivinar.disabled = desactivar;
    btnPreguntar.disabled = desactivar;
    btnPista.disabled = desactivar;
    btnRendirse.disabled = desactivar;
    inputRespuesta.disabled = desactivar;
    valorPregunta.disabled = desactivar;
    tipoPregunta.disabled = desactivar;
    botonesPregunta.forEach((boton) => {
        boton.disabled = desactivar;
    });
}

function nuevoJuego() {
    numeroSecreto = azar(0, 10000);
    preguntas = 0;
    intentos = 0;
    puntos = 1000;
    pistasFaciles = 0;
    juegoTerminado = false;
    estadoCaso.textContent = "Numero secreto listo";
    mensaje.textContent = "Haz una pregunta o escribe tu sospecha.";
    historial.innerHTML = "<li>El numero secreto esta entre 0 y 10.000.</li>";
    inputRespuesta.value = "";
    valorPregunta.value = "";
    actualizarMarcadores();
    desactivarControles(false);
}

function lanzarConfeti() {
    const canvas = document.getElementById("confeti");
    const ctx = canvas.getContext("2d");
    const piezas = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    for (let i = 0; i < 160; i++) {
        piezas.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            tamano: azar(5, 10),
            color: `hsl(${azar(0, 360)}, 82%, 56%)`,
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
            pieza.x += Math.sin(cuadros / 10) * 0.7;
        });

        cuadros += 1;
        if (cuadros < 210) {
            requestAnimationFrame(animar);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animar();
}

botonesPregunta.forEach((boton) => {
    boton.addEventListener("click", () => hacerPreguntaRapida(boton.dataset.pregunta));
});

btnPreguntar.addEventListener("click", hacerPreguntaPersonalizada);
btnAdivinar.addEventListener("click", adivinar);
btnNuevoJuego.addEventListener("click", nuevoJuego);
btnPista.addEventListener("click", darPistaExtra);
btnRendirse.addEventListener("click", rendirse);
btnVolver.addEventListener("click", () => {
    window.location.href = "4basico.html";
});

inputRespuesta.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") adivinar();
});

valorPregunta.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") hacerPreguntaPersonalizada();
});

nuevoJuego();
hablar('Adivina el número secreto entre 0 y 10.000 usando preguntas. Haz preguntas rápidas o escribe una pregunta personalizada para descubrir el número.');

const ejercicioTexto = document.getElementById("ejercicio");
const mensaje = document.getElementById("mensaje");
const numeroEjercicio = document.getElementById("numeroEjercicio");
const manzanasContainer = document.getElementById("manzanasContainer");
const reiniciarBtn = document.getElementById("reiniciarBtn");
const verificarBtn = document.getElementById("verificarBtn");
const manzanasEnCanasta = document.getElementById("manzanasEnCanasta");

let ejercicioActual = 1;
let resultadoCorrecto = 0;
let canastaCount = 0;

/* VOZ */
function hablar(texto) {

    const voz = new SpeechSynthesisUtterance(texto);

    voz.lang = "es-ES";

    speechSynthesis.speak(voz);
}

hablar('Coloca manzanas en la canasta hasta completar el resultado de la suma. Puedes hacer clic o arrastrar manzanas a la canasta.');

/* GENERAR EJERCICIO - SOLO SUMAS */
function generarEjercicio() {

    seleccionadas = 0;

    document.querySelectorAll(".manzana").forEach(m => {
        m.classList.remove("seleccionada");
        m.classList.remove("a-canasta");
        m.style.display = "block";
    });

    let num1 = Math.floor(Math.random() * 9) + 1;
    let num2 = Math.floor(Math.random() * (10 - num1)) + 1;

    resultadoCorrecto = num1 + num2;

    canastaCount = 0;
    manzanasEnCanasta.innerHTML = "";
    mensaje.innerHTML = "Coloca las manzanas en la canasta hasta completar el resultado.";

    ejercicioTexto.innerHTML = `${num1} + ${num2} = ?`;

    numeroEjercicio.innerText = ejercicioActual;
}

/* CREAR MANZANAS */
function crearManzanas() {

    for (let i = 0; i < 90; i++) {

        const manzana = document.createElement("div");

        manzana.classList.add("manzana");

        manzana.draggable = true;

        manzana.addEventListener("click", () => {
            if (canastaCount < resultadoCorrecto && !manzana.classList.contains("a-canasta")) {
                manzana.classList.add("a-canasta");
                manzana.style.display = "none";
                canastaCount++;

                const manzanaCanasta = document.createElement("div");
                manzanaCanasta.classList.add("manzana-canasta");
                manzanasEnCanasta.appendChild(manzanaCanasta);

                if (canastaCount === resultadoCorrecto) {
                    verificarRespuesta();
                } else {
                    mensaje.innerHTML = `Necesitas ${resultadoCorrecto - canastaCount} manzanas más.`;
                }
            }
        });

        // EVENTOS DE DRAG
        manzana.addEventListener("dragstart", (e) => {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text/html", manzana.innerHTML);
            manzana.style.opacity = "0.7";
            manzana.dataset.dragging = "true";
        });

        manzana.addEventListener("dragend", (e) => {
            manzana.style.opacity = "1";
            manzana.dataset.dragging = "false";
        });

        manzanasContainer.appendChild(manzana);
    }
}

/* VERIFICAR */
function verificarRespuesta() {

    if (canastaCount === resultadoCorrecto) {

        mensaje.innerHTML = "✅ Correcto";

        setTimeout(() => {

            mensaje.innerHTML = "";

            ejercicioActual++;

            if (ejercicioActual === 10) {
                hablar("Buen trabajo, sigue así");
            }

            if (ejercicioActual === 20) {
                hablar("Vamos, tú puedes");
            }

            if (ejercicioActual > 30) {
                finalizarJuego();
                return;
            }

            generarEjercicio();

        }, 1000);
    } else if (canastaCount < resultadoCorrecto) {
        mensaje.innerHTML = `Necesitas ${resultadoCorrecto - canastaCount} manzanas más`;
    }
}

/* FINAL */
function finalizarJuego() {

    ejercicioTexto.innerHTML = "🎉 ¡GANASTE! 🎉";

    mensaje.innerHTML =
        "Felicidades, terminaste el juego";

    hablar("Felicidades, terminaste el juego");

    lanzarConfeti();

    reiniciarBtn.style.display = "block";
}

/* REINICIAR */
function reiniciarJuego() {

    ejercicioActual = 1;

    mensaje.innerHTML = "";

    reiniciarBtn.style.display = "none";

    generarEjercicio();
}

verificarBtn.addEventListener("click", function() {
    verificarRespuesta();
});

reiniciarBtn.addEventListener("click", reiniciarJuego);

/* CONFETI */
function lanzarConfeti() {

    const canvas = document.getElementById("confeti");

    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let piezas = [];

    for (let i = 0; i < 200; i++) {

        piezas.push({

            x: Math.random() * canvas.width,

            y: Math.random() * canvas.height,

            r: Math.random() * 6 + 4,

            color: `hsl(${Math.random() * 360},100%,50%)`
        });
    }

    function dibujar() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        piezas.forEach(p => {

            ctx.fillStyle = p.color;

            ctx.fillRect(p.x, p.y, p.r, p.r);

            p.y += 2;

            if (p.y > canvas.height) {
                p.y = -10;
            }
        });

        requestAnimationFrame(dibujar);
    }

    dibujar();
}

/* EVENTOS DE DROP EN LA CANASTA */
const canasta = document.getElementById("canasta");

canasta.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    canasta.style.transform = "scale(1.1)";
    canasta.style.boxShadow = "0 10px 40px rgba(220, 20, 60, 0.6), 0 0 0 4px #8b7355, 0 0 0 5px #6b5844";
});

canasta.addEventListener("dragleave", (e) => {
    canasta.style.transform = "scale(1)";
    canasta.style.boxShadow = "inset -5px -5px 10px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 4px #8b7355, 0 0 0 5px #6b5844";
});

canasta.addEventListener("drop", (e) => {
    e.preventDefault();
    canasta.style.transform = "scale(1)";
    canasta.style.boxShadow = "inset -5px -5px 10px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 4px #8b7355, 0 0 0 5px #6b5844";

    const manzanaArrastrada = document.querySelector(".manzana[data-dragging='true']");
    if (manzanaArrastrada && canastaCount < resultadoCorrecto) {
        manzanaArrastrada.classList.add("a-canasta");
        manzanaArrastrada.style.display = "none";
        manzanaArrastrada.dataset.dragging = "false";
        canastaCount++;

        const manzanaCanasta = document.createElement("div");
        manzanaCanasta.classList.add("manzana-canasta");
        manzanasEnCanasta.appendChild(manzanaCanasta);

        if (canastaCount === resultadoCorrecto) {
            verificarRespuesta();
        } else {
            mensaje.innerHTML = `Necesitas ${resultadoCorrecto - canastaCount} manzanas más.`;
        }
    }
});

/* INICIAR */
crearManzanas();
generarEjercicio();
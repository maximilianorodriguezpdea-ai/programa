// ===== CONFIGURACIÓN =====

// Leer desde localStorage
const nombre = localStorage.getItem("username") || "Usuario";
const avatarSeleccionado = localStorage.getItem("avatarSeleccionado") || "Avatar 1";

// ===== MAPA DE AVATARES =====

const avatarMap = {
    "Avatar 1": "img/OIP (1).png",
    "Avatar 2": "img/OIP.jpg",
    "Avatar 3": "img/omg(3).jpg",
    "Avatar 4": "img/R.jpg"
};

// Avatar por defecto
const avatarURL = avatarMap[avatarSeleccionado] || "https://i.imgur.com/4Z7Dz3F.png";

// ===== MOSTRAR DATOS =====

document.getElementById("nombreUsuario").textContent = nombre;

document.getElementById("avatar").src = avatarURL;

// ===== MENSAJE DE BIENVENIDA =====

const genero = nombre.toLowerCase().endsWith('a')
    ? 'femenino'
    : 'masculino';

const mensaje = genero === 'femenino'
    ? '¡Bienvenida a la plataforma!'
    : '¡Bienvenido a la plataforma!';

document.getElementById("mensajeBienvenida").textContent = mensaje;

// ===== EFECTO CONFETI =====

function lanzarConfeti() {

    const duration = 5000;
    const end = Date.now() + duration;

    (function frame() {

        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
        });

        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }

    })();
}

lanzarConfeti();

// ===== VOZ =====

function hablarBienvenida() {

    const mensajeVoz = new SpeechSynthesisUtterance(mensaje);

    mensajeVoz.lang = "es-ES";
    mensajeVoz.pitch = 1.5;
    mensajeVoz.rate = 1;

    const voces = speechSynthesis.getVoices();

    const vozFemenina = voces.find(v =>
        v.lang.includes("es") &&
        (
            v.name.toLowerCase().includes("female") ||
            v.name.toLowerCase().includes("mujer") ||
            v.name.toLowerCase().includes("helena") ||
            v.name.toLowerCase().includes("paulina")
        )
    );

    if (vozFemenina) {
        mensajeVoz.voice = vozFemenina;
    }

    speechSynthesis.speak(mensajeVoz);
}

// Esperar voces
let hablado = false;

speechSynthesis.onvoiceschanged = () => {

    if (!hablado) {
        hablarBienvenida();
        hablado = true;
    }
};

// ===== BOTÓN CONTINUAR =====

document.getElementById("btnContinuar").addEventListener("click", () => {

    // Página correcta
    window.location.href = "aprendizaje1.html";

});

document.getElementById("btn4basico").addEventListener("click", () => {

    window.location.href = "4basico.html";

});
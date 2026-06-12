document.addEventListener('DOMContentLoaded', function() {
    function hablar(texto) {
        if (!window.speechSynthesis) return;
        const voz = new SpeechSynthesisUtterance(texto);
        voz.lang = 'es-ES';
        speechSynthesis.cancel();
        speechSynthesis.speak(voz);
    }
    
    hablar('Escribe el nombre del número que aparece. Por ejemplo, cinco para el número 5.');
    
    const numeroDisplay = document.getElementById('numero-aleatorio');
    const inputNombre = document.getElementById('input-nombre');
    const btnVerificar = document.getElementById('btn-verificar');
    const btnIrJuego = document.getElementById('btn-ir-juego');
    const rondaActual = document.getElementById('ronda-actual');
    const instruccion = document.getElementById('instruccion');

    const nombres = ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
    const totalRondas = 6;
    let ronda = 1;
    let numeroActual = 0;

    function obtenerNumeroAleatorio() {
        return Math.floor(Math.random() * 10) + 1;
    }

    function mostrarNumero() {
        numeroActual = obtenerNumeroAleatorio();
        numeroDisplay.textContent = numeroActual;
        inputNombre.value = '';
        btnVerificar.disabled = true;
        inputNombre.disabled = false;
        inputNombre.focus();
    }

    function actualizarRonda() {
        rondaActual.textContent = ronda;
    }

    inputNombre.addEventListener('input', function() {
        btnVerificar.disabled = inputNombre.value.trim() === '';
    });

    btnVerificar.addEventListener('click', function() {
        const respuesta = inputNombre.value.trim().toLowerCase();
        const nombreCorrecto = nombres[numeroActual - 1];

        if (respuesta === nombreCorrecto) {
            if (ronda < totalRondas) {
                ronda += 1;
                actualizarRonda();
                mostrarNumero();
                instruccion.textContent = '¡Correcto! Ahora escribe el nombre del siguiente número.';
            } else {
                instruccion.textContent = '¡Muy bien! Ahora puedes ir al juego.';
                btnIrJuego.disabled = false;
                btnVerificar.disabled = true;
                inputNombre.disabled = true;
        
            }
        } else {
            alert('Respuesta incorrecta. Intenta con el nombre correcto del número.');
            inputNombre.focus();
        }
    });

    btnIrJuego.addEventListener('click', function() {
        if (!btnIrJuego.disabled) {
            window.location.href = 'juegoprincipal.html';
        }
    });

    actualizarRonda();
    mostrarNumero();
});
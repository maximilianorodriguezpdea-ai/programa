document.addEventListener('DOMContentLoaded', function() {
    const contenedor = document.getElementById('contenedor-manzanas');
    const numeroDisplay = document.getElementById('numero-manzanas');
    const ayudaDisplay = document.getElementById('ayuda-contar');

    const totalManzanas = 5;
    let manzanasContadas = 0;
    let vozSeleccionada = null;
    let contadoInicial = false;
    const nextButton = document.getElementById('btn-siguiente');
    const ejercicioTexto = document.getElementById('ejercicio-texto');

    function obtenerVozMasculina() {
        const voces = speechSynthesis.getVoices();
        return voces.find(v => v.lang.startsWith('es') && (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('hombre') || v.name.toLowerCase().includes('juan') || v.name.toLowerCase().includes('javier') || v.gender === 'male')) || voces.find(v => v.lang.startsWith('es')) || null;
    }

    function hablarTexto(texto) {
        if (!window.speechSynthesis) {
            return;
        }
        const mensajeVoz = new SpeechSynthesisUtterance(texto);
        mensajeVoz.lang = 'es-ES';
        if (!vozSeleccionada) {
            vozSeleccionada = obtenerVozMasculina();
        }
        if (vozSeleccionada) {
            mensajeVoz.voice = vozSeleccionada;
        }
        mensajeVoz.rate = 1;
        mensajeVoz.pitch = 1.2;
        speechSynthesis.speak(mensajeVoz);
    }

    speechSynthesis.onvoiceschanged = () => {
        if (!vozSeleccionada) {
            vozSeleccionada = obtenerVozMasculina();
        }
        if (!contadoInicial) {
            contadoInicial = true;
            hablarTexto('Contemos manzanas, cuántas manzanas hay.');
        }
    };

    function actualizarDisplay() {
        numeroDisplay.textContent = manzanasContadas;
        if (manzanasContadas === totalManzanas) {
            ayudaDisplay.textContent = '¡Muy bien! Has seleccionado todas las manzanas. Ahora puedes ir a Aprendizaje 3.';
            nextButton.disabled = false;
        } else {
            ayudaDisplay.textContent = '¿Cuántas manzanas hay? Selecciona todas las manzanas para continuar.';
            nextButton.disabled = true;
        }
        ejercicioTexto.textContent = 'Ejercicio 1.';
    }

    function limpiarManzanas() {
        contenedor.innerHTML = '';
    }

    function crearManzana(index) {
        const numeros = ['uno', 'dos', 'tres', 'cuatro', 'cinco'];
        const img = document.createElement('img');
        img.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/120px-Red_Apple.jpg';
        img.alt = `Manzana ${index + 1}`;
        img.className = 'manzana';
        img.dataset.contada = 'false';

        img.addEventListener('click', function() {
            if (img.dataset.contada === 'false') {
                hablarTexto(numeros[index]);
                img.dataset.contada = 'true';
                img.classList.add('seleccionada');
                manzanasContadas++;
            } else {
                img.dataset.contada = 'false';
                img.classList.remove('seleccionada');
                manzanasContadas--;
            }
            actualizarDisplay();
        });

        contenedor.appendChild(img);
    }

    function iniciarRonda() {
        limpiarManzanas();
        manzanasContadas = 0;
        nextButton.disabled = true;
        for (let i = 0; i < totalManzanas; i++) {
            crearManzana(i);
        }
        actualizarDisplay();
    }

    nextButton.addEventListener('click', function() {
        if (manzanasContadas === totalManzanas) {
            window.location.href = 'aprendizaje3.html';
        } else {
            alert('Selecciona todas las manzanas primero para poder ir a Aprendizaje 3.');
        }
    });

    iniciarRonda();
});

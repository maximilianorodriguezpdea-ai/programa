document.addEventListener('DOMContentLoaded', function () {

    const contenedor = document.getElementById('contenedor-manzanas');
    const numeroDisplay = document.getElementById('numero-manzanas');
    const btnContar = document.getElementById('btn-contar');
    const ayudaDisplay = document.getElementById('ayuda-contar');
    const btnSiguiente = document.getElementById('btn-siguiente');

    const totalManzanas = 10;
    let manzanasContadas = 0;

    let vozFemenina = null;

    function obtenerVozFemenina() {

        const voces = speechSynthesis.getVoices();

        return voces.find(v =>
            v.lang.startsWith('es') &&
            (
                v.name.toLowerCase().includes('female') ||
                v.name.toLowerCase().includes('mujer') ||
                v.name.toLowerCase().includes('helena') ||
                v.name.toLowerCase().includes('paulina')
            )
        ) || voces.find(v => v.lang.startsWith('es')) || null;
    }

    const palabrasNumeros = [
        'uno',
        'dos',
        'tres',
        'cuatro',
        'cinco',
        'seis',
        'siete',
        'ocho',
        'nueve',
        'diez'
    ];

    function hablarTexto(texto) {

        if (!window.speechSynthesis) return;

        speechSynthesis.cancel();

        const mensaje = new SpeechSynthesisUtterance(texto);

        mensaje.lang = 'es-ES';

        if (!vozFemenina) {
            vozFemenina = obtenerVozFemenina();
        }

        if (vozFemenina) {
            mensaje.voice = vozFemenina;
        }

        mensaje.rate = 1;
        mensaje.pitch = 1.2;

        speechSynthesis.speak(mensaje);
    }

    speechSynthesis.onvoiceschanged = () => {

        if (!vozFemenina) {
            vozFemenina = obtenerVozFemenina();
        }
    };

    function actualizarDisplay() {

        numeroDisplay.textContent = manzanasContadas;

        ayudaDisplay.textContent =
            `Has contado ${manzanasContadas} de ${totalManzanas} manzanas.`;
    }

    function crearManzana(index) {

        const contenedorManzana = document.createElement('div');

        contenedorManzana.className =
            'contenedor-manzana-individual';

        const numeroPosicion = document.createElement('span');

        numeroPosicion.className = 'numero-posicion';

        numeroPosicion.textContent = index + 1;

        const img = document.createElement('img');

        img.src =
            'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Red_Apple.jpg/120px-Red_Apple.jpg';

        img.alt = `Manzana ${index + 1}`;

        img.className = 'manzana';

        img.dataset.contada = 'false';

        img.addEventListener('click', function () {

            if (img.dataset.contada === 'false') {

                img.dataset.contada = 'true';

                img.classList.add('seleccionada');

                manzanasContadas++;

            } else {

                img.dataset.contada = 'false';

                img.classList.remove('seleccionada');

                manzanasContadas--;
            }

            actualizarDisplay();

            hablarTexto(palabrasNumeros[index]);
        });

        contenedorManzana.appendChild(numeroPosicion);

        contenedorManzana.appendChild(img);

        contenedor.appendChild(contenedorManzana);
    }

    for (let i = 0; i < totalManzanas; i++) {

        crearManzana(i);
    }

    actualizarDisplay();

    btnContar.addEventListener('click', function () {

        if (manzanasContadas === totalManzanas) {

            alert('¡Muy bien! Has contado las 10 manzanas.');

        } else {

            const faltantes =
                totalManzanas - manzanasContadas;

            alert(
                `Has contado ${manzanasContadas} manzanas. Te faltan ${faltantes}.`
            );
        }
    });

    btnSiguiente.addEventListener('click', function () {

        if (manzanasContadas === totalManzanas) {

            window.location.href = 'aprendizaje2.html';

        } else {

            alert(
                'Debes contar todas las manzanas antes de continuar.'
            );
        }
    });

});
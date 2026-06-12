function hablar(texto) {
    if (!window.speechSynthesis) return;
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = 'es-ES';
    speechSynthesis.cancel();
    speechSynthesis.speak(voz);
}

document.addEventListener('DOMContentLoaded', function() {
    hablar('Aprende los números del 1 al 10 y sus nombres en español.');
    
    
    if (btnIrSuma) {
        btnIrSuma.addEventListener('click', function() {
            window.location.href = 'suma.html';
        });
    }

    if (btnIrAprendizaje4) {
        btnIrAprendizaje4.addEventListener('click', function() {
            window.location.href = 'aprendizaje4.html';
        });
    }
});

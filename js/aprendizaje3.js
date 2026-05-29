document.addEventListener('DOMContentLoaded', function() {
    const btnIrSuma = document.getElementById('btn-ir-suma');
    const btnIrAprendizaje4 = document.getElementById('btn-ir-aprendizaje4');

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

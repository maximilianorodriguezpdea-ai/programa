function hablar(texto) {
    if (!window.speechSynthesis) return;
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = 'es-ES';
    speechSynthesis.cancel();
    speechSynthesis.speak(voz);
}

// Bienvenida explicativa
hablar('Aprende a leer, escribir y representar números del 0 al 10 mil.');

    const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const dieces = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const decenas = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

    if (num === 0) return 'cero';
    if (num === 10000) return 'diez mil';

    let resultado = '';

    // Miles
    if (num >= 1000) {
        const miles = Math.floor(num / 1000);
        if (miles === 1) {
            resultado += 'mil';
        } else {
            resultado += numeroALetras(miles) + ' mil';
        }
        num %= 1000;
        if (num > 0) resultado += ' ';
    }

    // Centenas
    if (num >= 100) {
        const cent = Math.floor(num / 100);
        resultado += centenas[cent];
        num %= 100;
        if (num > 0) resultado += ' ';
    }

    // Decenas y unidades
    if (num >= 20) {
        const dec = Math.floor(num / 10);
        resultado += decenas[dec];
        num %= 10;
        if (num > 0) resultado += ' y ' + unidades[num];
    } else if (num >= 10) {
        resultado += dieces[num - 10];
    } else if (num > 0) {
        resultado += unidades[num];
    }

    return resultado.charAt(0).toUpperCase() + resultado.slice(1);
}

// Mostrar nombres de números al lado de los precios
document.getElementById('text-3045').textContent = numeroALetras(3045);
document.getElementById('text-2990').textContent = numeroALetras(2990);
document.getElementById('text-7030').textContent = numeroALetras(7030);
document.getElementById('text-9060').textContent = numeroALetras(9060);
document.getElementById('text-5087').textContent = numeroALetras(5087);
document.getElementById('text-10000').textContent = numeroALetras(10000);

document.getElementById("btnVolver").addEventListener("click", () => {
    window.location.href = "4basico.html";
});

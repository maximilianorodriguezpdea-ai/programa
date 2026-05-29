const avatars = document.querySelectorAll(".avatar");

let avatarSeleccionado = null;

avatars.forEach(avatar => {

    avatar.addEventListener("click", () => {

        // Quitar selección anterior
        avatars.forEach(a => {
            a.classList.remove("seleccionado");
        });

        // Seleccionar actual
        avatar.classList.add("seleccionado");

        // Guardar nombre
        avatarSeleccionado = avatar.dataset.nombre;

        // Crear voz
        const mensaje = new SpeechSynthesisUtterance("Avatar seleccionado");

        // Buscar voz femenina
        const voces = speechSynthesis.getVoices();

        const vozFemenina = voces.find(voz =>
            voz.name.toLowerCase().includes("female") ||
            voz.name.toLowerCase().includes("google español") ||
            voz.name.toLowerCase().includes("helena") ||
            voz.name.toLowerCase().includes("sabina")
        );

        if (vozFemenina) {
            mensaje.voice = vozFemenina;
        }

        mensaje.lang = "es-ES";
        mensaje.pitch = 1.2;
        mensaje.rate = 1;

        // Hablar
        speechSynthesis.speak(mensaje);
    });
});

// Botón entrar
document.getElementById("btnEntrar").addEventListener("click", () => {

    const username = document.getElementById("username").value;
    const mensajeError = document.getElementById("mensajeError");

    if (username.trim() === "") {
        mensajeError.textContent = "Debes escribir un nombre";
        return;
    }

    if (!avatarSeleccionado) {
        mensajeError.textContent = "Debes seleccionar un avatar";
        return;
    }

    mensajeError.textContent = "";
    localStorage.setItem('username', username);
    localStorage.setItem('avatarSeleccionado', avatarSeleccionado);
    window.location.href = 'indexbienvenida.html';
});
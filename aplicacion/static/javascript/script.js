document.addEventListener("DOMContentLoaded", function () {
  const backButton = document.querySelector(".back-button");
  const sidebar = document.querySelector(".sidebar");
  const multimediaButton = document.querySelector(".multimedia-button");
  const multimediaOptions = document.querySelector(".multimedia-options");

  backButton.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  multimediaButton.addEventListener("click", () => {
    multimediaOptions.classList.toggle("active");
  });

  document.addEventListener("click", (event) => {
    if (
      !multimediaButton.contains(event.target) &&
      !multimediaOptions.contains(event.target)
    ) {
      multimediaOptions.classList.remove("active");
    }
  });

  const multimediaOptionElements =
    document.querySelectorAll(".multimedia-option");
  multimediaOptionElements.forEach((option) => {
    option.addEventListener("click", () => {
      const type = option.getAttribute("data-type");
      alert(`Seleccionaste: ${type}`);
      multimediaOptions.classList.remove("active");
    });
  });

  // Funciones propias para implementar el sitema de Websockets
  const paths = window.location.pathname.split('/');
  const url = window.location.protocol === 'https:' ? 'wss://' : 'ws://' + window.location.host + '/ws/chat/' + paths[paths.length - 2] + '/';
  console.log(url);
  const ws = new WebSocket(url);

  ws.onopen = () => {
    console.log("Conexión establecida");
  };

  ws.onclose = () => {
    console.log("Conexión cerrada");
  };

  ws.onmessage = (text_data) => {
    const data = JSON.parse(text_data.data);
    console.log(data);
    if (data.type === 'mensaje') {
      mostrar_mensaje(data);
    }
    else if (data.type === 'escribiendo') {
      mostrar_escribiendo(data);
    }
  };

  const input = document.querySelector("#entrada");
  const boton = document.querySelector("#boton");
  const contenedor = document.querySelector("#contenedor");

  function escribiendo() {
    const data = JSON.stringify({
      type: 'escribiendo',
    });
    ws.send(data);
  }

  const mensaje_escribiendo = document.querySelector("#escribiendo");

  function mostrar_escribiendo(data) {
    mensaje_escribiendo.textContent = "Alguien está escribiendo...";
    setTimeout(() => {
        mensaje_escribiendo.textContent = "";
    }, 1000);
  }

  input.addEventListener('keydown', escribiendo);

  function enviar_mensaje() {
    const mensaje = input.value;
    const data = JSON.stringify({
      type: "mensaje",
      mensaje: mensaje,
    });
    ws.send(data);
    input.value = "";
  }

  boton.addEventListener("click", enviar_mensaje);

  function mostrar_mensaje(data) {

    if (data.sender) {
      contenedor.innerHTML += `
      <article class="message sender">
          <div class="message-content">
              <div class="message-header">
                  <span class="username">${data.username}</span>
                  <span class="timestamp">14:32</span>
              </div>
              <p class="text">${data.mensaje}</p>
          </div>
      </article>
      `;
    } else {
      contenedor.innerHTML += `
      <article class="message receiver">
          <img src="/placeholder.svg?height=40&width=40" alt="Avatar de Ana" class="avatar">
          <div class="message-content">
              <div class="message-header">
                  <span class="username">${data.username}</span>
                  <span class="timestamp">14:30</span>
              </div>
              <p class="text">${data.mensaje}</p>
          </div>
      </article>
      `;
    }

  }
});

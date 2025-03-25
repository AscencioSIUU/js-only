const API = 'https://chat.nrywhite.lat/chats';

function createDom() {
     // Contenedor principal
     const bodyDiv = document.createElement("div");
     bodyDiv.id = "body";

     // Contenedor del chat
     const chatBody = document.createElement("div");
     chatBody.id = "chatBody";

     // Sección de mensajes
     const messageSection = document.createElement('div');
     messageSection.id = "messageSection";

     // Sección de input y botones
     const inputSection = document.createElement('div');
     inputSection.id = "inputSection";

     // Input para el mensaje
     const inputMessage = document.createElement('input');
     inputMessage.id = "input";
     inputMessage.type = "text";
     inputMessage.maxLength = 140;
     inputMessage.placeholder = "Ingrese su mensaje";

     // ENVIAR MENSAJE
     const btnMessage = document.createElement('button');
     btnMessage.id = "btnMessage";
     btnMessage.innerText = "Enviar Mensaje";

     // ACTIVAR DARKMODE
     const btnDarkMode = document.createElement('button');
     btnDarkMode.id = "btnDarkMode";
     btnDarkMode.innerText = "Dark Mode";

     document.body.appendChild(bodyDiv);
     bodyDiv.appendChild(chatBody);
     chatBody.appendChild(messageSection);
     chatBody.appendChild(inputSection);
     inputSection.appendChild(inputMessage);
     inputSection.appendChild(btnMessage);
     inputSection.appendChild(btnDarkMode);

     // ESCUCHAR DARKMODE
     btnDarkMode.addEventListener("click", () => {
          document.body.classList.toggle("dark-theme");
     });
}

createDom();

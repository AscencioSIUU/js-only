const API = 'https://chat.nrywhite.lat/chats';
const superuser = 'Ernesto';
let isLoadingSendingMessage = false;
let currentTheme = localStorage.getItem("theme") || "light";

// Definición de temas
const themes = {
     light: {
          bodyBg: "#ffffff",
          chatBg: "rgb(255, 255, 255)",
          messageBg: "rgb(217, 217, 217)",
          inputSectionBg: "rgb(207, 207, 207)",
          inputBorder: "#ccc",
          inputText: "#333",
          inputPlaceholder: "#aaa",
          btnBg: "#3498db",
          btnText: "#fff",
          btnHoverBg: "#2980b9",
          btnActiveBg: "#1f618d",
          inputFocusBorder: "#66afe9",
          btnDarkBg: "#000000",
          btnDarkText: "#fff"
     },
     dark: {
          bodyBg: "#333",
          chatBg: "#444",
          messageBg: "#555",
          inputSectionBg: "#666",
          inputBorder: "#777",
          inputText: "#333",
          inputPlaceholder: "#ccc",
          btnBg: "#555",
          btnText: "#fff",
          btnHoverBg: "#666",
          btnActiveBg: "#777",
          inputFocusBorder: "#888",
          btnDarkBg: "#edd33d",
          btnDarkText: "#000000"
     }
};

// Función auxiliar para asignar estilos
function setStyles(element, styles) {
     Object.assign(element.style, styles);
}

async function fetchMessages() {
     try {
          const response = await fetch(API, {
               headers: {
                    'Accept': 'application/json'
               }
          });
          const data = await response.json();
          return data;
     } catch (error) {
          console.error("Error al obtener mensajes:", error);
          return [];
     }
}

async function sendMessage(inputMessage, messageSection) {
     const username = superuser;
     const message = inputMessage.value.trim();
     if (!message || isLoadingSendingMessage) return;
     try {
          isLoadingSendingMessage = true;
          const response = await fetch(API, {
               method: "POST",
               body: JSON.stringify({ username, message }),
               headers: {
                    'Content-type': 'application/json'
               }
          });
          console.log(response);
     } catch (error) {
          console.log("NO SE HIZO POST", error);
     } finally {
          updateMessages(messageSection);
          isLoadingSendingMessage = false;
          inputMessage.value = '';
     }
}

async function updateMessages(messageSection) {
     const messages = await fetchMessages();
     messageSection.innerHTML = '';
     messages.forEach(msg => createChatMessages(msg, messageSection));
     console.log("Mensajes actualizados");
}

function createChatMessages({ id, username, message }, parent) {
     const container = document.createElement('div');
     const userSpan = document.createElement('span');
     userSpan.className = 'username';
     const messageSpan = document.createElement('span');
     messageSpan.className = 'message-text';

     if (username === superuser) {
          container.id = 'superUserMessage';
          userSpan.innerText = '@' + superuser.trim();
          // Estilos inline para mensaje del superusuario
          setStyles(container, {
               margin: "10px 0",
               padding: "10px",
               marginRight: "8px",
               backgroundColor: "#f1f1f1",
               borderRadius: "5px",
               maxWidth: "90%",
               wordWrap: "break-word",
               marginLeft: "auto" // Alinea a la derecha
          });
          setStyles(userSpan, {
               fontWeight: "bold",
               color: "#3498db",
               display: "block",
               textAlign: "right"
          });
          setStyles(messageSpan, {
               display: "block",
               color: "#333",
               marginTop: "5px",
               lineHeight: "1.4",
               textAlign: "right"
          });
     } else {
          container.id = 'userMessage';
          userSpan.innerText = '@' + username.trim();
          // Estilos inline para mensaje de usuario
          setStyles(container, {
               margin: "10px 0",
               width: "80%",
               padding: "10px",
               marginLeft: "8px",
               backgroundColor: "#f1f1f1",
               borderRadius: "5px",
               maxWidth: "90%",
               wordWrap: "break-word",
               marginRight: "auto" // Alinea a la izquierda
          });
          setStyles(userSpan, {
               fontWeight: "bold",
               color: "#3498db",
               display: "block",
               textAlign: "left"
          });
          setStyles(messageSpan, {
               display: "block",
               color: "#333",
               marginTop: "5px",
               lineHeight: "1.4",
               textAlign: "left"
          });
     }
     messageSpan.innerText = message;
     container.appendChild(userSpan);
     container.appendChild(messageSpan);
     parent.appendChild(container);
}

// Variables globales para guardar referencias a elementos
let globalElements = {};

async function createDom() {
     // Crear y guardar elementos principales
     const bodyDiv = document.createElement("div");
     bodyDiv.id = "body";
     globalElements.bodyDiv = bodyDiv;

     const chatBody = document.createElement("div");
     chatBody.id = "chatBody";
     globalElements.chatBody = chatBody;

     const messageSection = document.createElement("div");
     messageSection.id = "messageSection";
     globalElements.messageSection = messageSection;

     const inputSection = document.createElement("div");
     inputSection.id = "inputSection";
     globalElements.inputSection = inputSection;

     const inputMessage = document.createElement("input");
     inputMessage.id = "input";
     inputMessage.type = "text";
     inputMessage.maxLength = 140;
     inputMessage.placeholder = "Ingrese su mensaje";
     globalElements.inputMessage = inputMessage;

     const btnMessage = document.createElement("button");
     btnMessage.id = "btnMessage";
     btnMessage.innerText = "Enviar Mensaje";
     globalElements.btnMessage = btnMessage;

     const btnDarkMode = document.createElement("button");
     btnDarkMode.id = "btnDarkMode";
     btnDarkMode.innerText = "Dark Mode";
     globalElements.btnDarkMode = btnDarkMode;

     // Agregar elementos al DOM
     document.body.appendChild(bodyDiv);
     bodyDiv.appendChild(chatBody);
     chatBody.appendChild(globalElements.messageSection);
     chatBody.appendChild(inputSection);
     inputSection.appendChild(inputMessage);
     inputSection.appendChild(btnMessage);
     inputSection.appendChild(btnDarkMode);

     // Cargar mensajes iniciales
     const messages = await fetchMessages();
     messages.forEach(element => {
          createChatMessages(element, globalElements.messageSection);
     });

     // Aplicar el tema actual (inline)
     applyTheme();

     // Eventos para dark mode y envío de mensaje
     btnDarkMode.addEventListener("click", () => {
          // Alterna el tema
          currentTheme = currentTheme === "light" ? "dark" : "light";
          localStorage.setItem("theme", currentTheme);
          applyTheme();
     });

     btnMessage.addEventListener("click", (e) => {
          e.preventDefault();
          sendMessage(inputMessage, globalElements.messageSection);
     });

     inputMessage.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
               e.preventDefault();
               sendMessage(inputMessage, globalElements.messageSection);
          }
     });

     // Actualiza mensajes cada 5 segundos
     setInterval(() => {
          updateMessages(globalElements.messageSection);
     }, 5000);
}

function applyTheme() {
     const theme = themes[currentTheme];
     // Aplicar estilos a cada elemento usando .style y asignando los valores del tema
     setStyles(globalElements.bodyDiv, {
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
          height: "100vh",
          backgroundColor: theme.bodyBg
     });
     setStyles(globalElements.chatBody, {
          display: "flex",
          flexDirection: "column",
          width: "50%",
          height: "100vh",
          backgroundColor: theme.chatBg
     });
     setStyles(globalElements.messageSection, {
          flex: "1",
          overflowY: "auto",
          backgroundColor: theme.messageBg
     });
     setStyles(globalElements.inputSection, {
          display: "flex",
          alignItems: "center",
          backgroundColor: theme.inputSectionBg,
          padding: "10px",
          gap: "10px"
     });
     setStyles(globalElements.inputMessage, {
          width: "70%",
          height: "40px",
          border: `1px solid ${theme.inputBorder}`,
          borderRadius: "4px",
          fontSize: "16px",
          color: theme.inputText,
          padding: "8px",
          margin: "8px 0",
          backgroundColor: "#fff",
          outline: "none"
     });
     setStyles(globalElements.btnMessage, {
          backgroundColor: theme.btnBg,
          color: theme.btnText,
          border: "none",
          borderRadius: "4px",
          padding: "10px 20px",
          cursor: "pointer",
          fontSize: "16px",
          transition: "background-color 0.3s ease"
     });
     setStyles(globalElements.btnDarkMode, {
          backgroundColor: theme.btnDarkBg,
          color: theme.btnDarkText,
          border: "none",
          borderRadius: "4px",
          padding: "10px 20px",
          cursor: "pointer",
          fontSize: "16px",
          transition: "background-color 0.3s ease"
     });
}

// Ejecutar createDom cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
     createDom();
});

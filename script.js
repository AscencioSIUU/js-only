const API = 'https://chat.nrywhite.lat/chats';
const superuser = 'Ernesto';
const isLoadingSendingMessage = false
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
               body: JSON.stringify({
                    username, message
               }),
               headers: {
                    'Content-type': 'application/json'
               }
          });
          console.log(response)
     } catch (error) {
          console.log("NO SE HIZO POST")
     } finally {
          updateMessages(messageSection)
          isLoadingSendingMessage = false;
          inputMessage.value = '';
     }
}
async function updateMessages(messageSection) {
     const messages = await fetchMessages();
     messageSection.innerHTML = '';
     messages.forEach(msg => createChatMessages(msg, messageSection));
     console.log("pasaron 5")
}
function createChatMessages({ id, username, message }, parent) {
     if (username === superuser) {
          const superUserMessage = document.createElement('div');
          superUserMessage.id = 'superUserMessage';
          const userSpan = document.createElement('span');
          userSpan.className = 'username';
          userSpan.innerText = '@' + superuser.trim();
          const messageSpan = document.createElement('span');
          messageSpan.className = 'message-text';
          messageSpan.innerText = message;

          superUserMessage.appendChild(userSpan);
          superUserMessage.appendChild(messageSpan);
          parent.appendChild(superUserMessage);
     } else {
          const userMessage = document.createElement('div');
          userMessage.id = 'userMessage';
          const userSpan = document.createElement('span');
          userSpan.className = 'username';
          userSpan.innerText = '@' + username.trim();
          const messageSpan = document.createElement('span');
          messageSpan.className = 'message-text';
          messageSpan.innerText = message;

          userMessage.appendChild(userSpan);
          userMessage.appendChild(messageSpan);
          parent.appendChild(userMessage);
     }
}
if (localStorage.getItem("theme") === "dark") {
     document.body.classList.add("dark-theme");
};
async function createDom() {
     const bodyDiv = document.createElement("div");
     bodyDiv.id = "body";
     const chatBody = document.createElement("div");
     chatBody.id = "chatBody";
     const messageSection = document.createElement('div');
     messageSection.id = "messageSection";
     const inputSection = document.createElement('div');
     inputSection.id = "inputSection";
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


     const messages = await fetchMessages()
     messages.forEach(element => {
          createChatMessages(element, messageSection);
     });

     // ESCUCHAR DARKMODE
     btnDarkMode.addEventListener("click", () => {
          document.body.classList.toggle("dark-theme");
     });
     // ESCUCHAR ENVIAR MENSAJE
     btnMessage.addEventListener("click", (e) => {
          sendMessage(inputMessage, messageSection);
     });
     inputMessage.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
               sendMessage(inputMessage, messageSection);
          }
     });

     setInterval(() => {
          updateMessages(messageSection);
     }, 5000);
}
createDom();

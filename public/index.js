function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const userName = uuidv4();

if (window.location.protocol === 'http:') {

     //location.href = window.location.href.replace('http://', 'https://');
}else{
if (password) {
  if (window.prompt("Password") !== password) {
    location.reload();
  }
}
}

let sendMessage = document.getElementById("sendMessage");
let sendMessageArea = document.querySelector("#sendMessageArea"); //Textarea for input
const socket = io("/"); //getting dependency

setTimeout(() => {
  
  socket.emit("initialize", url); //called every time new user joins the room to initialze the notepad
  //If somebody in the room has updated the notepad, new user joining gets the notepad initialized
  socket.on("message-initialize", (data) => {
    var oldModel = editor.getModel().getValue();

    if (oldModel.length !== 0) {
      socket.emit("message-initialized", oldModel);
    }
  });
  socket.on("user-count", (data) => {
    let textInput = document.getElementById("userCount");
    textInput.innerText = data;
  });

  editor.onDidChangeModelContent((e) => {
    socket.emit("message", editor.getModel().getValue());
  });
  //Receive updated text from server
  socket.on("message-updated", (data) => {
    var oldModel = editor.getModel();
    var newModel = monaco.editor.createModel(data, oldModel.getModeId());
    editor.setModel(newModel);
    if (oldModel) {
      oldModel.dispose();
    }
  });
  // code...
  //Initialize notepad of new user to display text if it has been edited
  socket.on("update", (data) => {
    var oldModel = editor.getModel();
    var newModel = monaco.editor.createModel(data, oldModel.getModeId());
    editor.setModel(newModel);
    if (oldModel) {
      oldModel.dispose();
    }
  });
  socket.on("chat", (data) => {
    let id = data.user;
    let message = data.message;
    const chat = document.getElementById("chat");
    if (id === userName) {
      chat.innerHTML += `
        <li class="me">
            <div class="entete">
                <h3>${new Date().toLocaleTimeString()}</h3>
                <h2>Siz</h2>
                <span class="status blue"></span>
            </div>
            <div class="triangle"></div>
            <div class="message">
                ${message}
            </div>
        </li>
        `;
    } else {
      chat.innerHTML += `
        <li class="you">
            <div class="entete">
                <span class="status green"></span>
                <h3>${new Date().toLocaleTimeString()}</h3>
                <h2>${id}</h2>
            </div>
            <div class="triangle"></div>
            <div class="message">
                ${message}
            </div>
        </li>
        `;
    }
    chat.scrollTop = chat.scrollHeight;
  });
  //Change character count when users checks or unchecks checkbox
  
  var oldModel = editor.getModel();
  var newModel = monaco.editor.createModel(yaziicerigi, oldModel.getModeId());
  editor.setModel(newModel);
  if (oldModel) {
    oldModel.dispose();
  }
  
  document.getElementById("chatName").innerText = url;
  hide();

}, 5000);

/* Only register a service worker if it's supported */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}
function changePassword(){
  const value = window.prompt("Şifrenizi belirleyiniz:","şifreniz");
  socket.emit("password", value);

}
function showChat() {
  document.getElementsByTagName("main")[0].style.display = "none";
  document.getElementsByClassName("chat-panel")[0].style.display = "block";
}
function hiddenChat() {
  document.getElementsByTagName("main")[0].style.display = "flex";
  document.getElementsByClassName("chat-panel")[0].style.display = "none";
}
function passwordChange() {
  const pass = document.getElementById("passwordInput").value;
  socket.emit("password", pass);
}

function messageSender() {
  let text = sendMessageArea.value; // gets text area text
  const data = {
    user: userName,
    message: text,
  };
  if (text.length > 0) {
    const chat = document.getElementById("chat");
    chat.innerHTML += `
        <li class="me">
            <div class="entete">
                <h3>${new Date().toLocaleTimeString()}</h3>
                <h2>Siz</h2>
                <span class="status blue"></span>
            </div>
            <div class="triangle"></div>
            <div class="message">
                ${data.message}
            </div>
        </li>
        `;
    chat.scrollTop = chat.scrollHeight;
    socket.emit("chat-message", data);
    sendMessageArea.value = "";
  } // send updated text to server
}
/* Only register a service worker if it's supported */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js");
}
window.document.onload = function(e){window.navigator.vibrate(1000);}


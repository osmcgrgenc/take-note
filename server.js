// -----Setting up packages-------
const express = require("express");
const app = express();
app.use(express.static("public")); // setting default directory
app.set("view engine", "ejs"); // setting default view engine
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const setupDb = require("./db/init");
setupDb();
const notes = require("./db/model");
// home route which redirects to a route with unique id
app.get("/", (req, res) => {
  res.redirect("/" + getUniqueId());
});
app.get("/totalnotecount", async(req, res) => {
  const data = await notes.query().select().orderBy("id");
  res.json({result:data});
});
// route which renders the note html page with the unique url
app.get("/:url", async (req, res) => {
  const url = req.params.url;
  const data = await notes.query().select().where("_link", "=", url);
  if (data.length == 0) {
    await notes.query().insert({ _link: url });
  }
  const val = data.length == 0 ? { _Link: url, _Data: "" } : data[0];
  res.render("index", { url: url, yaziicerigi: val._Data });
});

// route which handles the url change upon clicking title
app.post("/", (req, res) => {
  res.redirect("/");
});
const connections = [];
// basic io connection
io.on("connection", (socket) => {
  let url;
  socket.on("disconnect", function () {
    connections[url]--;
    saveHistory(url);
    socket.to(url).emit("user-count", connections[url]); //sends event to update the users notepad
  });
  socket.on('chat-message', msg => {
    socket.to(url).emit('chat', msg);
  });
  socket.on("initialize", (data) => {
    // called when a user joins a room
    url = data;
    if (connections[url] || connections[url] >= 0) {
      connections[url] = connections[url] + 1;
    } else {
      connections[url] = 1;
    }
    socket.join(data); // adds the socket to the room
    socket.to(url).emit("message-initialize", url); //sends event to update the users notepad
    socket.to(url).emit("user-count", connections[url]); //sends event to update the users notepad
  });

  socket.on("message-initialized", (data) => {
    // New user initial notepad is filled if somebody has edited it
    socket.to(url).emit("update", data);
  });

  //Called every time key is pressed
  socket.on("message", (data) => {
    saveData(url, data);
    socket.to(url).emit("message-updated", data);
  });
});
const saveData = async (url, data) => {
  const result = await notes.query().where("_link", "=", url).patch({
    _data: data,
  });
  console.log(url, result);
};
const saveHistory = async (url) => {
  const result = await notes.query().where("_link", "=", url).select();
  result.forEach(element => {
    const hist = element;
    delete hist.id;
    delete hist.created_at;
    await history.query().insert(element);
  });
};
//Function for generating unique 5 character code for url
const getUniqueId = () => {
  const variables = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "-",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];
  let url = "";
  for (let i = 0; i < 5; i++) {
    let temp = Math.floor(Math.random() * 63);
    url += variables[temp];
  }
  return url;
};
setInterval(async() => {
  await notes.query().whereNull("_data").delete();
}, 1000*60*60);
http.listen(process.env.PORT || 4000, () => {
  console.log("Listening...");
});

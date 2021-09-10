const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

const setupDb = require("./db/init");
setupDb();
const notes = require("./db/models/notes");
const history = require("./db/models/history");
const password = require("./db/models/passwords");

// fake DB
const messages = [];

// socket.io server
const connections = [];
// basic io connection
io.on("connection", (socket) => {
  let url;
  socket.on("disconnect", function () {
    connections[url]--;
    saveHistory(url);
    socket.to(url).emit("user-count", connections[url]); //sends event to update the users notepad
  });
  socket.on("chat-message", (msg) => {
    socket.to(url).emit("chat", msg);
  });
  socket.on("password", (msg) => {
    console.log("password", msg);
    savePassword(url, msg);
    socket.to(url).emit("password-saved", msg);
  });
  socket.on("initialize", (data) => {
    // called when a user joins a room
    console.log("ACAYIP", data);
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
  console.log("saveData", url, data);
  return;
  const result = await notes.query().where("_link", "=", url).patch({
    _data: data,
  });
  console.log("saveData", url, result);
};
const savePassword = async (url, data) => {
  console.log("savePassword", url, data);
  return;
  const result = await password.query().where("note_id", "=", url).patch({
    password: data,
    password_confirmation: data,
  });
  if (result == 0) {
    await password.query().insert({
      note_id: url,
      password: data,
      password_confirmation: data,
    });
  }
  console.log("savePassword", url, result);
};
const saveHistory = async (url) => {
  console.log("saveHistory", url);
  return;
  if (url) {
    const result = await notes.query().where("_link", "=", url).select();
    result.forEach(async (element) => {
      const hist = {
        _data: element._Data,
        _link: element._Link,
      };
      if (
        (await history.query().where("_data", element._Data).select()).length ==
        0
      )
        await history.query().insert(hist);
    });
  }
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

nextApp.prepare().then(() => {
  app.get("/notes/:id", async (req, res) => {
    const data = await notes
      .query()
      .withGraphFetched("passwords")
      .where("_link", "=", req.params.id);
    if (data.length == 0) {
      await notes.query().insert({ _link: req.params.id });
    }
    console.log(data);
    const result= data.length == 0 ? { _Link: req.params.id, _Data: "" } : data[0];

    res.json({ result });
  });
  app.get("/totalnotecount", async (req, res) => {
    const data = await notes.query().select().orderBy("id");
    res.json({ result: data });
  });
  app.get("/history", async (req, res) => {
    const data = await history.query().select().orderBy("id");
    res.json({ result: data });
  });
  app.get("/passwords", async (req, res) => {
    const data = await password.query().select().orderBy("id");
    res.json({ result: data });
  });
  app.get("*", (req, res) => {
    return nextHandler(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

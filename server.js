// -----Setting up packages-------
const express = require("express");
const app = express();
app.use(express.static("public")); // setting default directory
app.set("view engine", "ejs"); // setting default view engine
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// home route which redirects to a route with unique id
app.get("/",(req,res)=>{
    res.redirect("/"+getUniqueId());
})

// route which renders the note html page with the unique url
app.get("/:url",(req,res)=>{
    const url = req.params.url;    
    res.render("index",{url:url});
})

// route which handles the url change upon clicking title
app.post("/",(req,res)=>{
    res.redirect("/");
})

// basic io connection
io.on("connection",socket=>{
    let url;
    socket.on("initialize",data=>{ // called when a user joins a room
        url = data;
        socket.join(data); // adds the socket to the room
        socket.to(url).emit("message-initialize",url); //sends event to update the users notepad
    })

    socket.on("message-initialized",data=>{ // New user initial notepad is filled if somebody has edited it
        socket.to(url).emit("update",data);
        
    })

    //Called every time key is pressed
    socket.on("message",data=>{
        socket.to(url).emit("message-updated",data);
    })
})

//Function for generating unique 5 character code for url
const getUniqueId = ()=>{
    const variables = ["a","b","c","d","e",
    "f","g","h","i","j",
    "k","l","m","n","o",
    "p","q","r","s","t",
    "u","v","w","x","y",
    "z","1","2","3","4",
    "5","6","7","8","9",
    "0","-","A","B","C",
    "D","E","F","G","H",
    "I","J","K","L","M",
    "N","O","P","Q","R",
    "S","T","U","V","W",
    "X","Y","Z"];
    let url = "";
    for(let i = 0;i<5;i++){
        let temp = Math.floor(Math.random()*63);
        url+=variables[temp];
    }
    return url;
}

//Setting up server
http.listen(process.env.PORT||4000,()=>{console.log("Listening...")})
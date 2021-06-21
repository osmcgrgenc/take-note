const socket = io("/"); //getting dependency
socket.emit("initialize",url); //called every time new user joins the room to initialze the notepad

//If somebody in the room has updated the notepad, new user joining gets the notepad initialized
socket.on("message-initialize",data=>{
    let textInput = document.querySelector("#textInput");
    if(textInput.value.length!==0){
        socket.emit("message-initialized",textInput.value);
    }
})


let textInput = document.querySelector("#textInput"); //Textarea for input
let words = document.querySelector("#words"); //word counter
let characters = document.querySelector("#characters"); //character counter
let intro = document.querySelector(".intro"); //Title for changing url
let countWhitespace = document.getElementById("whitespace"); // checkbox for counting whitespace;
//Put request sent to server to redirect to new url
intro.addEventListener("click",()=>{
    document.forms["refresh-form"].submit(); // since form is submitted using div this step is required
})

//Called every time user types in the text area
textInput.addEventListener("keyup",()=>{
    let text = textInput.value; // gets text area text
    if(text.length === 0){ // if empty set word count to 0
        words.textContent="Words: 0"
    }
    else{
    let wordCount = 1;
    text.replace(/\s+/g,(a)=>{wordCount++;}); // regex checks for all whitespaces and everytime it is found 
                                              // increment the word count 
    words.textContent="Words: "+wordCount; // set the word count
}
    if(countWhitespace.checked){    //If count whitespace is checked then the length is the character count
        characters.textContent = "Characters: " + text.length;
    }
    else{
        characters.textContent = "Characters: " + text.replace(/\s+/g,"").length; // replace all 
                                                                                  //white spaces to count characters
    }
    
    socket.emit("message",text); // send updated text to server
})

//Receive updated text from server
socket.on("message-updated",data=>{
    let textInput = document.querySelector("#textInput");
    textInput.value = data;
    if(countWhitespace.checked){
        characters.textContent = "Characters: "+data.length;
    }
    else{
        characters.textContent = "Characters: " + data.replace(/\s+/g,"").length;
    }
    if(data.length === 0){
        words.textContent="Words: 0"
    }
    else{
    let wordCount = 1;
    data.replace(/\s+/g,(a)=>{wordCount++;});
    words.textContent="Words: "+wordCount;
    }
})

//Initialize notepad of new user to display text if it has been edited
socket.on("update",data=>{
    let textInput = document.querySelector("#textInput");
    textInput.value = data;
    if(countWhitespace.checked){
        characters.textContent = "Characters: "+data.length;
    }
    else{
        characters.textContent = "Characters: " + data.replace(/\s+/g,"").length;
    }
    if(data.length === 0){
        words.textContent="Words: 0"
    }
    else{
    let wordCount = 1;
    data.replace(/\s+/g,(a)=>{wordCount++;});
    words.textContent="Words: "+wordCount;
}
})

//Change character count when users checks or unchecks checkbox
countWhitespace.addEventListener("change",()=>{
    let text = document.querySelector("#textInput").value;
    if(countWhitespace.checked){    //If count whitespace is checked then the length is the character count
        characters.textContent = "Characters: " + text.length;
    }
    else{
        characters.textContent = "Characters: " + text.replace(/\s+/g,"").length; // replace all 
                                                                                  //white spaces to count characters
    }
})
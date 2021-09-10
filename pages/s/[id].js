import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";

import Editor from "@monaco-editor/react";



export default function App() {
  const router = useRouter();
  const url = router.query.id;
  const socket = io();

  const editorRef = useRef();
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("javascript");
  const [isEditorReady, setIsEditorReady] = useState(false);
  // Send chunks of code on change
  const [message, setMessage] = useState("");
  // Set value of editor
  const [value, setValue] = useState("");
  const [valid, setValid] = useState(false);
  const [sendInitialData, setSendInitialData] = useState(false);
  const [users, setUsers] = useState(0);
  const [title, setTitle] = useState("Untitled");
  const [titleInfo, setTitleInfo] = useState("Untitled");
  const [titleChange, setTitleChange] = useState(false);
  const uuidv4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };
  const getValue =  () => {
    if(url)
    fetch("/notes/"+url).then((response)=>response.json()).then((data)=>setValue(data._Data));
    
  };
  socket.on("message-updated", (data) => {
    setValue(data);
    console.log(data);
  });
  socket.on("message-initialize", (data) => {
    var oldModel = message;

    if (oldModel.length !== 0) {
      socket.emit("message-initialized", oldModel);
    }
  });
  socket.on("user-count", (data) => {
    setUsers(data);
  });
  useEffect(() => {
    socket.emit("initialize", url);
    setValid(true);
    getValue();
  }, []);
  useEffect(() => {
    socket.emit("message", message);
    console.log("CODE-CHANGE: " + value);
  }, [message]);
  useEffect(() => {
    console.log("CODE-CHANGE: " + value);
  }, [value]);
  const handleEditorDidMount = (_, editor) => {
    setIsEditorReady(true);
    editorRef.current = editor;
  };
  const handleEditorChange = (ev, value) => {
    // Set value to send over to other sockets
    setMessage(value);
  };

  return (
    <div>
      <Editor
        height="100vh"
        theme={theme}
        language={language}
        value={value}
        editorDidMount={handleEditorDidMount}
        onChange={handleEditorChange}
        loading={"Loading..."}
      />
    </div>
  );
}

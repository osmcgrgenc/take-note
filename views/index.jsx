var React = require("react");
var { useState, useEffect, useRef } = require('react');
var ReactDOM = require('react-dom');
// const { ControlledEditor } = require( "@monaco-editor/react");
import { ControlledEditor } from "@monaco-editor/react";

function Index(props) {
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("javascript");
  const [isEditorReady, setIsEditorReady] = useState(false)
  const [value, setValue] = useState(props.yaziicerigi);
  const [message, setMessage] = useState("")

  const editorRef = useRef()
  // Called on initialization, adds ref
  const handleEditorDidMount = (_, editor) => {
    setIsEditorReady(true);
    editorRef.current = editor
  }
  // Called whenever there is a change in the editor
  const handleEditorChange = (ev, value) => {
    // Set value to send over to other sockets
    setMessage(value)
  };
  return (
    ReactDOM.render(
      <ControlledEditor
        height="100vh"
        theme={theme}
        language={language}
        value={value}
        editorDidMount={handleEditorDidMount}
        onChange={handleEditorChange}
        loading={"Loading..."}
      />
      )
  );
}

module.exports = Index;

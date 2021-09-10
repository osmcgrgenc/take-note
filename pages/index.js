import { useEffect, useState } from "react";
import useSocket from "../hooks/useSocket";
import Editor from "./s/[id]";
export default function Blah() {
	const [messages, setMessages] = useState([]);
	const [message, setMessage] = useState([]);
	const socket = useSocket();

	useEffect(() => {
		if (socket) {
			socket.on("message.chat1", message => {
				setMessages(messages => [...messages, message]);
			});
		}
	}, [socket]);

	function submit(e) {
		e.preventDefault();

		socket &&
			socket.emit("message.chat1", {
				id: new Date().getTime(),
				value: message
			});
	}

	return (
		<div>
		</div>
	);
}

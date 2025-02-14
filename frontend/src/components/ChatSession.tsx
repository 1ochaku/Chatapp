import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const ChatSession = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("session") === "true") {
      const storedMessages = JSON.parse(localStorage.getItem("chatSession") || "[]");
      setMessages(storedMessages);
    }
  }, [searchParams]);

  return (
    <div>
      <h2>Stored Chat Messages</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
      <p>
        <a href="/">Back to Chat</a>
      </p>
    </div>
  );
};

export default ChatSession;

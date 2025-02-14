import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ChatWindow = () => {
    const [sessions, setSessions] = useState<string[]>([]);
    const [currentSession, setCurrentSession] = useState<string | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = location.state?.email || null;

    useEffect(() => {
        if (currentUser) {
            const savedSessions = getAllSessions();
            setSessions(savedSessions);
            const lastSession = localStorage.getItem(`${currentUser}_lastSession`);
            if (lastSession) loadSession(lastSession);
        }
    }, [currentUser]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const createNewSession = () => {
        if (!currentUser) return;

        let sessionCount = parseInt(localStorage.getItem(`${currentUser}_sessionCount`) || "0", 10);
        sessionCount++;
        
        const newSessionId = `${currentUser}_session_${sessionCount}`;
        const updatedSessions = [newSessionId, ...sessions];
        
        localStorage.setItem(`${currentUser}_sessions`, JSON.stringify(updatedSessions));
        localStorage.setItem(`${currentUser}_sessionCount`, sessionCount.toString());
        localStorage.setItem(newSessionId, JSON.stringify([]));
        
        setSessions(updatedSessions);
        loadSession(newSessionId);
    };

    const getAllSessions = (): string[] => {
        return JSON.parse(localStorage.getItem(`${currentUser}_sessions`) || "[]");
    };

    const loadSession = (sessionId: string) => {
        if (!currentUser) return;
        setCurrentSession(sessionId);
        localStorage.setItem(`${currentUser}_lastSession`, sessionId);
        const storedMessages = JSON.parse(localStorage.getItem(sessionId) || "[]");
        setMessages(storedMessages.reverse());
    };

    const sendMessage = () => {
        if (!input.trim() || !currentSession) return;

        // Update messages
        const newMessages = [...messages, `User: ${input}`, `Server: ${input}`];
        setMessages(newMessages);
        localStorage.setItem(currentSession, JSON.stringify(newMessages));

        // Bring the active session to the front
        const updatedSessions = [currentSession, ...sessions.filter(session => session !== currentSession)];
        setSessions(updatedSessions);
        localStorage.setItem(`${currentUser}_sessions`, JSON.stringify(updatedSessions));

        setInput("");
    };

    const handleLogout = () => {
        setCurrentSession(null);
        setMessages([]);
        setSessions([]);
        navigate("/");
    };

    return (
        <div className="flex h-full">
            <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col">
                <h3 className="text-lg font-semibold mb-4">Sessions</h3>
                <button
                    onClick={createNewSession}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mb-4"
                >
                    ➕ New Chat
                </button>
                <div className="flex-1 overflow-y-auto space-y-2">
                    {sessions.map((session) => {
                        const sessionNumber = session.split("_session_")[1];
                        return (
                            <div
                                key={session}
                                onClick={() => loadSession(session)}
                                className={`p-2 cursor-pointer rounded ${session === currentSession ? "bg-blue-500" : "hover:bg-gray-700"}`}
                            >
                                Session {sessionNumber} {session === currentSession && "(Active)"}
                            </div>
                        );
                    })}
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded mt-4"
                >
                    🚪 Logout
                </button>
            </div>

            <div className="flex flex-col flex-1 bg-gray-100 p-6">
                <h2 className="text-2xl font-semibold mb-4">
                    {currentSession ? `Chat: Session ${currentSession.split("_session_")[1]}` : "Select a Session"}
                </h2>
                <div className={`flex-1 overflow-y-auto bg-white shadow-md p-4 rounded mb-4 h-[70vh] ${messages.length === 0 ? "flex items-center justify-center" : ""
                    }`}>
                    {sessions.length === 0 ? (
                        <p className="text-gray-500 flex items-center justify-center">
                            Tap on New Chat to start a conversation
                        </p>

                    ) : (
                        <div className="w-full">
                            {messages.map((msg, index) => (
                                <p key={index} className="mb-2">{msg}</p>
                            ))}
                            <div ref={chatEndRef} />
                        </div>
                    )}
                </div>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 p-2 border rounded"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;

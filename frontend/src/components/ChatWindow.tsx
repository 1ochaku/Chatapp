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
            if (lastSession && savedSessions.includes(lastSession)) {
                loadSession(lastSession);
            }
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

    const deleteSession = (sessionId: string) => {
        if (!currentUser) return;

        // Remove the session from the list
        let updatedSessions = sessions.filter(session => session !== sessionId);

        // Update localStorage immediately
        localStorage.setItem(`${currentUser}_sessions`, JSON.stringify(updatedSessions));
        localStorage.removeItem(sessionId);

        // Adjust session count correctly (only if the deleted session was the highest-numbered one)
        if (sessions.length > 0) {
            const sessionNumbers = updatedSessions.map(session => parseInt(session.split("_session_")[1], 10));
            const maxSessionNum = sessionNumbers.length > 0 ? Math.max(...sessionNumbers) : 0;
            localStorage.setItem(`${currentUser}_sessionCount`, maxSessionNum.toString());
        } else {
            localStorage.setItem(`${currentUser}_sessionCount`, "0");
        }

        // If the deleted session was the active one, load the next available session
        if (sessionId === currentSession) {
            if (updatedSessions.length > 0) {
                loadSession(updatedSessions[0]); // Load the next session in the list
            } else {
                setCurrentSession(null);
                setMessages([]);
                localStorage.removeItem(`${currentUser}_lastSession`);
            }
        }

        // Finally, update state to trigger re-render
        setSessions([...updatedSessions]);
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

        // Move the session to the top only if a message is sent
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
                    {sessions.length === 0 ? (
                        <p className="text-gray-500 text-center">Tap on New Chat to start a conversation</p>
                    ) : (
                        sessions.map((session) => {
                            const sessionNumber = session.split("_session_")[1];
                            return (
                                <div
                                    key={session}
                                    className={`flex justify-between items-center p-2 cursor-pointer rounded ${
                                        session === currentSession ? "bg-blue-500" : "hover:bg-gray-700"
                                    }`}
                                    onClick={() => loadSession(session)}
                                >
                                    <span>
                                        Session {sessionNumber} {session === currentSession && "(Active)"}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteSession(session);
                                        }}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        ❌
                                    </button>
                                </div>
                            );
                        })
                    )}
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
                <div className={`flex-1 overflow-y-auto bg-white shadow-md p-4 rounded mb-4 h-[70vh] ${messages.length === 0 ? "flex items-center justify-center" : ""}`}>
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

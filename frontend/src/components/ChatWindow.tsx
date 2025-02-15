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
    const currentUser = location.state?.email || localStorage.getItem("lastUser");
    const [ws, setWs] = useState<WebSocket | null>(null);

    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        if (!currentUser) return;

        // Store current user in local storage to maintain login after refresh
        localStorage.setItem("lastUser", currentUser);

        const savedSessions = getAllSessions();
        setSessions(savedSessions);

        const lastSession = localStorage.getItem(`${currentUser}_lastSession`);
        if (lastSession && savedSessions.includes(lastSession)) {
            loadSession(lastSession);
        }

        if (wsRef.current) return;

        const websocket = new WebSocket(import.meta.env.VITE_WS_SERVER);
        wsRef.current = websocket;
        setWs(websocket);

        websocket.onopen = () => console.log("Connected to WebSocket server");

        websocket.onmessage = (event) => {
            try {
                const { session, reply } = JSON.parse(event.data);
                if (!session || !reply) return;

                setMessages((prevMessages) => {
                    const newMessages = [...prevMessages, `Server: ${reply}`];

                    // Store updated messages
                    localStorage.setItem(session, JSON.stringify(newMessages));
                    return newMessages;
                });

                setSessions((prevSessions) => {
                    const updatedSessions = [session, ...prevSessions.filter(s => s !== session)];
                    localStorage.setItem(`${currentUser}_sessions`, JSON.stringify(updatedSessions));
                    return updatedSessions;
                });
            } catch (error) {
                console.error("Error parsing server message:", error);
            }
        };

        websocket.onerror = (error) => console.error("WebSocket error:", error);
        websocket.onclose = () => {
            console.log("WebSocket connection closed");
            wsRef.current = null;
        };

        return () => {
            websocket.close();
            wsRef.current = null;
        };
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

        let updatedSessions = sessions.filter(session => session !== sessionId);
        localStorage.setItem(`${currentUser}_sessions`, JSON.stringify(updatedSessions));
        localStorage.removeItem(sessionId);

        if (sessions.length > 0) {
            const sessionNumbers = updatedSessions.map(session => parseInt(session.split("_session_")[1], 10));
            const maxSessionNum = sessionNumbers.length > 0 ? Math.max(...sessionNumbers) : 0;
            localStorage.setItem(`${currentUser}_sessionCount`, maxSessionNum.toString());
        } else {
            localStorage.setItem(`${currentUser}_sessionCount`, "0");
        }

        if (sessionId === currentSession) {
            if (updatedSessions.length > 0) {
                loadSession(updatedSessions[0]);
            } else {
                setCurrentSession(null);
                setMessages([]);
                localStorage.removeItem(`${currentUser}_lastSession`);
            }
        }

        setSessions([...updatedSessions]);
    };

    const loadSession = (sessionId: string) => {
        if (!currentUser) return;

        setCurrentSession(sessionId);
        localStorage.setItem(`${currentUser}_lastSession`, sessionId);

        const storedMessages = JSON.parse(localStorage.getItem(sessionId) || "[]");
        setMessages(storedMessages);
    };

    const sendMessage = () => {
        if (!input.trim() || !currentSession || !ws) return;

        const newMessages = [...messages, `User: ${input}`];
        setMessages(newMessages);
        localStorage.setItem(currentSession, JSON.stringify(newMessages));

        const updatedSessions = [currentSession, ...sessions.filter(session => session !== currentSession)];
        setSessions(updatedSessions);
        localStorage.setItem(`${currentUser}_sessions`, JSON.stringify(updatedSessions));

        ws.send(JSON.stringify({ session: currentSession, message: input }));

        setInput("");
    };

    const handleLogout = () => {
        setCurrentSession(null);
        setMessages([]);
        setSessions([]);
        localStorage.removeItem("lastUser");
        navigate("/");
    };

    return (
        <div className="flex h-full">
            <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col">
                <h3 className="text-lg font-semibold mb-4">Sessions</h3>
                <button onClick={createNewSession} className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mb-4 cursor-pointer">➕ New Chat</button>
                <div className="flex-1 overflow-y-auto space-y-2">
                    {sessions.length === 0 ? (
                        <p className="text-gray-500 text-center">Tap on New Chat to start a conversation</p>
                    ) : (
                        sessions.map((session) => (
                            <div key={session} className={`flex justify-between items-center p-2 cursor-pointer rounded ${session === currentSession ? "bg-blue-500" : "hover:bg-gray-700"}`} onClick={() => loadSession(session)}>
                                <span>Session {session.split("_session_")[1]} {session === currentSession && "(Active)"}</span>
                                <button onClick={(e) => { e.stopPropagation(); deleteSession(session); }} className="text-red-500 hover:text-red-700 cursor-pointer">❌</button>
                            </div>
                        ))
                    )}
                </div>
                <button onClick={handleLogout} className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded mt-4 cursor-pointer">🚪 Logout</button>
            </div>
            <div className="flex flex-col flex-1 bg-gray-100 p-6">
                <h2 className="text-2xl font-semibold mb-4">{currentSession ? `Chat: Session ${currentSession.split("_session_")[1]}` : "Select a Session"}</h2>
                <div className="flex-1 overflow-y-auto bg-white shadow-md p-4 rounded mb-4 h-[70vh]">
                    {messages.map((msg, index) => <p key={index} className="mb-2">{msg}</p>)}
                    <div ref={chatEndRef} />
                </div>
                <div className="flex space-x-2">
                    <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 p-2 border rounded" />
                    <button onClick={sendMessage} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded cursor-pointer">Send</button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;

import ChatWindow from "../components/ChatWindow";

const ChatPage: React.FC = () => {
    return (
        <div className="flex h-screen">
            {/* Chat Window */}
            <div className="flex-1 bg-gray-100 p-4">
                <ChatWindow />
            </div>
        </div>
    );
};

export default ChatPage;

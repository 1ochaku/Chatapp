import React, { useState } from "react";

const ChatWindow: React.FC = () => {
    const [inputValue, setInputValue] = useState("");
    const handleSend = () => {
        console.log("Sending:", inputValue);
        setInputValue(""); // Clear input after sending
    };
    
    return (
        <div className="h-full flex flex-col">
            {/* Chat Header */}
            <div className="p-4 bg-blue-500 text-white">Your Chat</div>
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-2">
                <p className="mb-2">Item 1</p>
                <p className="mb-2">Item 2</p>
                <p className="mb-2">Item 3</p>
                <p className="mb-2">Item 4</p>
                <p className="mb-2">Item 5</p>
                <p className="mb-2">Item 6</p>
                <p className="mb-2">Item 7</p>
                <p className="mb-2">Item 1</p>
                <p className="mb-2">Item 2</p>
                <p className="mb-2">Item 3</p>
                <p className="mb-2">Item 4</p>
                <p className="mb-2">Item 5</p>
                <p className="mb-2">Item 6</p>
                <p className="mb-2">Item 7</p>
                <p className="mb-2">Item 1</p>
                <p className="mb-2">Item 2</p>
                <p className="mb-2">Item 3</p>
                <p className="mb-2">Item 4</p>
                <p className="mb-2">Item 5</p>
                <p className="mb-2">Item 6</p>
                <p className="mb-2">Item 7</p>
            </div>
            {/* Text box */}
            <div className="p-4 bg-white text-black flex items-center gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter your message"
                    className="flex-1 p-2"
                />
                <button 
                    className="px-4 py-2 bg-white text-blue-500 rounded hover:bg-gray-200 ml-auto"
                    onClick={handleSend}
                >
                    Set
                </button>
            </div>
        </div>
    );
};

export default ChatWindow;
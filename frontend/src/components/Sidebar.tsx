import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();
    const handleLogout = () => {
        navigate("/");
    }
    return (
        <div className={`h-screen flex flex-col bg-gray-800 text-white ${isOpen ? "w-64" : "w-16"} transition-width duration-300`}>
            {/* Toggle Button */}
            <button
                className="p-2 bg-gray-700 hover:bg-gray-600"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? "Close" : "Open"}
            </button>

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

            {/* Logout Button */}
            <button
                className="w-full p-2 bg-red-500 hover:bg-red-400"
                onClick = {handleLogout}
            >Logout</button>
        </div>
    );
};

export default Sidebar;

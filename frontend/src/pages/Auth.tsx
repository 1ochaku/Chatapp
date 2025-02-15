import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/background.jpg";

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(""); 
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);  // New loading state

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const loginUrl = `${API_BASE_URL}/auth/local`;
    const registerUrl = `${API_BASE_URL}/auth/local/register`;

    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password.trim() || (!isLogin && !username.trim())) {
            setError("All fields are required!");
            return;
        }

        try {
            setLoading(true);  // Start loading
            const url = isLogin ? loginUrl : registerUrl;
            const payload = isLogin
                ? { identifier: email, password }
                : { username, email, password };
            
            const response = await axios.post(url, payload);
            
            localStorage.setItem("token", response.data.jwt);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            setError("");
            
            navigate("/chat", { state: { email } });
        } catch (err: any) {
            if (err.response && err.response.data) {
                const errorMessage = err.response.data.error.message;

                if (!isLogin) {
                    if (errorMessage.includes("Email is already taken")) {
                        setError("This email is already in use. Try logging in.");
                    } else if (errorMessage.includes("Username is already taken")) {
                        setError("Username is already in use. Try another one.");
                    } else {
                        setError("Signup failed. Please check your details.");
                    }
                } else {
                    setError("Invalid email or password. Please try again.");
                }
            } else {
                setError("Something went wrong. Please try again later.");
            }
        } finally {
            setLoading(false);  // Stop loading
        }
    }

    return (
        <div
            className="w-screen h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: "100%" }}
        >
            <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
                {/* Header */}
                <div className="flex justify-between mb-4">
                    <button
                        className={`text-lg font-semibold cursor-pointer ${isLogin ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
                        onClick={() => {
                            setIsLogin(true);
                            setUsername("");
                            setPassword("");
                            setEmail("");
                            setError("");
                        }}
                    >
                        Login
                    </button>
                    <button
                        className={`text-lg font-semibold cursor-pointer ${!isLogin ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
                        onClick={() => {
                            setIsLogin(false)
                            setUsername("");
                            setPassword("");
                            setEmail("");
                            setError("");
                        }}
                    >
                        Signup
                    </button>
                </div>

                {/* Form */}
                <form className="flex flex-col space-y-4">
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="UserName"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setError("");
                            }}
                            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                        }}
                        className="p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError("");
                        }}
                        className="p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
                    />

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {/* Loading State */}
                    <button
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer flex justify-center"
                        onClick={handleAuth}
                        disabled={loading}  // Disable button while loading
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3v-4z"></path>
                            </svg>
                        ) : (
                            isLogin ? "Login" : "Signup"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Auth;

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth: React.FC = () => {
    // holds the state for whether user want to login or signup
    const [isLogin, setIsLogin] = useState(true);
    // console.log(isLogin);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(""); // used only during signup
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // input validation
        if (!email.trim() || !password.trim() || (!isLogin && !username.trim())) {
            setError("All fields are required!");
            return;
        }

        try {
            const url = isLogin
            ? "http://localhost:1337/api/auth/local"
                : "http://localhost:1337/api/auth/local/register";
            
            const payload = isLogin
                ? { identifier: email, password }
                : { username, email, password };
            
            const response = await axios.post(url, payload);

            // console.log(response);
            
            // storing JWT token in localStorage for future access
            localStorage.setItem("token", response.data.jwt);
            localStorage.setItem("user", JSON.stringify(response.data.user));
            
            // clearing error
            setError("");
            
            // redirecting to chat page
            navigate("/chat");
        } catch (err: any) {
            // Check if error response exists
            if (err.response && err.response.data) {
                const errorMessage = err.response.data.error.message;

                if (!isLogin) {
                    // Signup-specific error handling
                    if (errorMessage.includes("Email is already taken")) {
                        setError("This email is already in use. Try logging in.");
                    } else if (errorMessage.includes("Username is already taken")) {
                        setError("Username is already in use. Try another one.");
                    } else {
                        setError("Signup failed. Please check your details.");
                    }
                } else {
                    // Login-specific error handling
                    setError("Invalid email or password. Please try again.");
                }
            } else {
                setError("Something went wrong. Please try again later.");
            }
        }
    }

    // depending upon the click on the header
    // it will show different forms
    // if it's an existing user then only email and passwd req
    // else it will req username creation
    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
                {/* Header */}
                <div className="flex justify-between mb-4">
                    <button
                        className={`text-lg font-semibold ${isLogin ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
                        onClick={() => {
                            setIsLogin(true);
                            setError("");
                        }}
                    >
                        Login
                    </button>
                    <button
                        className={`text-lg font-semibold ${!isLogin ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
                        onClick={() => {
                            setIsLogin(false)
                            setError("");
                        }
                        }
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
                                setUsername(e.target.value)
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
                            setEmail(e.target.value)
                            setError("");
                        }}
                        className="p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value)
                            setError("");
                        }}
                        className="p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
                    />

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                        onClick={handleAuth}
                    >
                        {isLogin ? "Login" : "Signup"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Auth;
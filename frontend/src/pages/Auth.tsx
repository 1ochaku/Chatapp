import { useState } from "react";

const Auth: React.FC = () => {
    // holds the state for whether user want to login or signup
    const [isLogin, setIsLogin] = useState(true);
    // console.log(isLogin);

    // depending upon the click on the header
    // it will show different forms
    // if it's an existing user then only email and passwd req
    // else it will req username creation
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
            {/* Header */}
            <div className="flex justify-between mb-4">
                <button
                    className={`text-lg font-semibold ${isLogin ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
                    onClick={() => setIsLogin(true)}
                >
                    Login
                </button>
                <button
                    className={`text-lg font-semibold ${!isLogin ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-500"}`}
                    onClick={() => setIsLogin(false)}
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
                        className="p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
                    />
                )}
                <input
                    type="email"
                    placeholder="Email"
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="p-2 border rounded-md focus:ring-2 focus:ring-blue-300"
                />
                <button className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                    {isLogin ? "Login" : "Signup"}
                </button>
            </form>
        </div>
    )
}

export default Auth;
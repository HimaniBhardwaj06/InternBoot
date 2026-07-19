import { useState } from "react";
import { registerUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {

        setError("");

        try {

            await registerUser(email, password);

            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            setError(error.message);

        }

    };

    return (

        <div className="min-h-screen bg-slate-100 flex justify-center items-center">

            <div className="bg-white p-8 rounded-xl shadow-lg w-96">

                <h1 className="text-3xl font-bold text-center mb-6">

                    Create Account

                </h1>
                
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border rounded-lg p-3 mb-4"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />

                <div className="relative mb-6">

                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-full border rounded-lg p-3 pr-12"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>

                </div>

                {error && (

                    <p className="text-red-500 text-sm text-center mb-4">

                        {error}

                    </p>

                )}

                <button
                    onClick={handleRegister}
                    className="w-full bg-blue-600 text-white p-3 rounded-lg">

                    Register

                </button>

                
            </div>

        </div>

    )

}

export default Register;
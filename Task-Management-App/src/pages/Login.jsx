import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        try {
            await loginUser(email, password);
            navigate("/dashboard");
        } catch {
            setError("Invalid email or password.");
        }
    };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-slate-500 mb-8">
          Login to manage your tasks
        </p>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>

            <input type="email" placeholder="Enter your email"
             className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"value={email}
             onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>

            <div className="relative">

                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          </div>

          {error && (

                <p className="text-red-500 text-sm text-center">

                    {error}

                </p>

            )}

          <button type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition" > 
            Login
          </button>

        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Don't have an account? <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
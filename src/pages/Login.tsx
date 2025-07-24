import { useState } from "react";
import { loginUser } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../firebase/authService";
import { ResetPassword } from "../components/modal/ResetPassword";

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle(rememberMe);
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(email, password, rememberMe);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-30 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Login
      </h2>
      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <input
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <input
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            type="password"
            placeholder="Parola"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="w-4 h-4"
          />
          <label
            htmlFor="rememberMe"
            className="text-sm text-gray-700 select-none"
          >
            Ține-mă minte
          </label>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow-md"
        >
          Login
        </button>

        <div className="flex flex-col md:flex-row gap-2 justify-between items-center mt-4">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition"
            onClick={() => setShowReset(true)}
          >
            Ai uitat parola?
          </button>

          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition"
            >
              Register here
            </a>
          </p>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="mt-6 w-full bg-white border border-gray-300 shadow-sm flex items-center justify-center gap-2 px-4 py-3 rounded-lg hover:bg-gray-50 transition duration-200"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
            alt="Google"
          />
          <span className="text-gray-700 font-medium">
            Continue with Google
          </span>
        </button>
      </div>

      {showReset && <ResetPassword onClose={() => setShowReset(false)} />}
    </div>
  );
};

export default Login;

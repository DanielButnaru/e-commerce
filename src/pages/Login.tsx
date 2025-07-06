import { useState } from "react";
import { loginUser } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../firebase/authService";
import { ResetPassword } from "../components/modal/ResetPassword";

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          type="password"
          placeholder="Parola"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login
        </button>
        <p className="mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </form>
      <button
        type="button"
        className="text-sm text-blue-500 underline"
        onClick={() => setShowReset(true)}
      >
        Ai uitat parola?
      </button>

      <button
        onClick={handleGoogleLogin}
        className="bg-white border shadow flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-50 transition"
      >
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          className="w-5 h-5"
          alt="Google"
        />
        Continuă cu Google
      </button>
      {showReset && <ResetPassword onClose={() => setShowReset(false)} />}
    </div>
  );
};

export default Login;

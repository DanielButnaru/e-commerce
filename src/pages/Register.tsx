// src/pages/Register.tsx
import { useState } from "react";
import { registerUser } from "../firebase/authService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
   <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
  <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Register</h2>
  <form onSubmit={handleRegister} className="space-y-6">
    <div>
      <input
        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring- focus:border-blue-500 outline-none transition"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>
    <div>
      <input
        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        type="password"
        placeholder="Parola"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>
    
    {error && (
      <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
        {error}
      </div>
    )}
    
    <button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 shadow-md"
    >
      Create Account
    </button>
    
    <div className="mt-6 pt-4 border-t border-gray-200">
      <p className="text-sm text-center text-gray-600">
        Already have an account?{" "}
        <a 
          href="/login" 
          className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition"
        >
          Login here
        </a>
      </p>
    </div>
  </form>
</div>
  );
};

export default Register;

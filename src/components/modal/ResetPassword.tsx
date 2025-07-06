import { useState } from "react";
import { resetPassword } from "../../firebase/authService";

export const ResetPassword = ({ onClose }: { onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      await resetPassword(email);
      setMessage("Email sent! Please check your inbox.");
    } catch (error: any) {
      setMessage(error.message);
    }
  };
  return (
    <div className="p-4 border rounded bg-white shadow">
      <h2 className="text-lg font-bold mb-2">Resetare parolă</h2>
      <input
        type="email"
        placeholder="Emailul tău"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Trimite email
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
      <button
        onClick={onClose}
        className="text-sm text-gray-500 mt-2 underline"
      >
        Închide
      </button>
    </div>
  );
};

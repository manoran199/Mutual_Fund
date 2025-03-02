import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://127.0.0.1:8000/register/", { email, password });
      alert("Registration successful!");
      navigate("/");
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-10">
      <h1 className="text-2xl font-bold">Register</h1>
      <input className="p-2 border" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="p-2 border" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button className="px-4 py-2 bg-blue-600 text-white" onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;

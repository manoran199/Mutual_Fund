import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/login/", { email, password });
      localStorage.setItem("token", response.data.access_token);
      alert("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-10">
      <h1 className="text-2xl font-bold">Login</h1>
      <input className="p-2 border" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input className="p-2 border" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button className="px-4 py-2 bg-green-600 text-white" onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;

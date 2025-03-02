import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">Mutual Fund App</h1>
        <div>
          <Link to="/" className="px-4">Login</Link>
          <Link to="/dashboard" className="px-4">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

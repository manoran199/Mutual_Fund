import { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = () => {
  const [fundFamily, setFundFamily] = useState("");
  const [funds, setFunds] = useState([]);
  const [portfolio, setPortfolio] = useState([]);

  const fetchFunds = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/funds/", { params: { fund_family: fundFamily } });
      setFunds(response.data);
    } catch (error) {
      alert("Failed to fetch funds");
    }
  };

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/portfolio/", { params: { user_id: 1 } });
      setPortfolio(response.data);
    } catch (error) {
      alert("Failed to fetch portfolio");
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="mb-4">
        <input className="p-2 border" placeholder="Enter Fund Family" onChange={(e) => setFundFamily(e.target.value)} />
        <button className="px-4 py-2 bg-blue-600 text-white ml-2" onClick={fetchFunds}>Fetch Funds</button>
      </div>

      <h2 className="text-xl font-bold">Available Funds</h2>
      <ul>
        {funds.map((fund) => (
          <li key={fund.id} className="border p-2 mt-2">
            {fund.fund_name} - ${fund.current_value}
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-bold mt-4">Your Portfolio</h2>
      <ul>
        {portfolio.map((p) => (
          <li key={p.id} className="border p-2 mt-2">
            {p.fund.fund_name} - {p.units} units - Invested: ${p.investment_value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

import React, { useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import stockOptions from "./stockList";

function App() {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  const handlePredict = async () => {
    if (!symbol) return alert("Please enter a stock symbol!");
    setLoading(true);
    try {
      const response = await axios.get(
        `https://stock-predictor-backend-4tp3.onrender.com/predict?stock=${symbol}`
      );
      console.log(response.data);

      setData(response.data);
      await fetchHistory();
    } catch (err) {
      console.error(err);
      alert("Failed to fetch prediction. Make sure your backend is running.");
    }
    setLoading(false);
  };

  const fetchHistory = async () => {
    if (!symbol) return;

    try {
      const res = await axios.get(
        `https://stock-predictor-backend-4tp3.onrender.com/history?stock=${symbol}&range=1y`
      );
      setHistoryData(res.data);
    } catch (err) {
      console.error("History error:", err);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>📈 Stock Price Predictor</h2>
      <select
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        style={{
          padding: "0.5rem",
          marginRight: "1rem",
          fontSize: "1rem",
          minWidth: "200px",
        }}
      >
        <option value="">Select a Stock</option>
        {stockOptions.map((stock) => (
          <option key={stock.value} value={stock.value}>
            {stock.label}
          </option>
        ))}
      </select>

      <button
        onClick={handlePredict}
        style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}
      >
        {loading ? "Predicting..." : "Predict"}
      </button>

      {data.length > 0 && (
        <div style={{ marginTop: "3rem" }}>
          <h3>Prediction for next 7 days</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ds" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="yhat"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {historyData.length > 0 && (
        <div style={{ marginTop: "3rem" }}>
          <h3>📉 Historical Prices (Past 1 Year)</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ds" />
              <YAxis domain={["auto", "auto"]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="close"
                stroke="#82ca9d"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default App;

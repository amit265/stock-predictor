import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import stockOptions from "./stockList";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Spinner from "./Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [symbol, setSymbol] = useState("SBIN.NS");
  const [data, setData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comparisonData, setComparisonData] = useState([]);
  const [predictionDate, setPredictionDate] = useState(new Date());

  const formattedDate = predictionDate.toISOString().split("T")[0]; // 'yyyy-mm-dd'

  const handlePredict = async () => {
    if (!symbol) return alert("Please select a stock!");

    setLoading(true);
    try {
      const predictionRes = await axios.get(
        `https://stock-predictor-backend-4tp3.onrender.com/predict?stock=${symbol}`
      );
      setData(predictionRes.data);

      const historyRes = await axios.get(
        `https://stock-predictor-backend-4tp3.onrender.com/history?stock=${symbol}&range=1y`
      );
      setHistoryData(historyRes.data);

      // const predictionResByDate = await axios.get(
      //   `https://stock-predictor-backend-4tp3.onrender.com/predict?stock=${symbol}&date=${formattedDate}`
      // );
      // console.log("hello there", predictionResByDate.data);

      const comparisonRes = await axios.get(
        `https://stock-predictor-backend-4tp3.onrender.com/get-comparisons?stock=${symbol}`
      );
      setComparisonData(comparisonRes.data);
      toast.success("Prediction loaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching data.");

      // alert("Error fetching data. Please try again.");
    }
    setLoading(false);
  };

  // Call on startup and whenever symbol changes
  useEffect(() => {
    if (symbol) {
      handlePredict();
    }
  }, [symbol]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>📊 Nifty Stock Price Predictor</h2>

      {/* <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "1rem" }}>Choose date: </label>
        <DatePicker
          selected={predictionDate}
          onChange={(date) => setPredictionDate(date)}
          dateFormat="yyyy-MM-dd"
          minDate={new Date()}
        />
      </div> */}

      <div style={{ maxWidth: 400, marginBottom: "1rem" }}>
        <Select
          options={stockOptions}
          defaultValue={stockOptions.find(
            (option) => option.value === "SBIN.NS"
          )}
          onChange={(selected) => setSymbol(selected.value)}
          placeholder="Select a company..."
          isSearchable
        />
      </div>

      {/* <button
        onClick={handlePredict}
        style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}
        disabled={loading}
      >
        {loading ? "Predicting..." : "Predict"}
      </button> */}

      {loading && <Spinner />}

      {!loading && data.length > 0 && (
        <>
          <div style={{ marginTop: "3rem" }}>
            <h3>📈 Next 7 Days Forecast</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ds" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="yhat"
                  stroke="#007bff"
                  strokeWidth={2}
                  name="Predicted Price"
                />
                <Line
                  type="monotone"
                  dataKey="yhat_lower"
                  stroke="#ff6961"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  name="Lower Bound"
                />
                <Line
                  type="monotone"
                  dataKey="yhat_upper"
                  stroke="#77dd77"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  name="Upper Bound"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: "3rem" }}>
            <h3>📉 Historical Trend (Past 1 Year)</h3>
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
        </>
      )}

      {!loading && comparisonData.length > 0 && (
        <div style={{ marginTop: "3rem" }}>
          <h3>✅ Prediction Accuracy</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f0f0f0" }}>
                <th style={th}>Date</th>
                <th style={th}>Predicted</th>
                <th style={th}>Actual</th>
                <th style={th}>Error</th>
                <th style={th}>Accuracy (%)</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <tr key={idx}>
                  <td style={td}>{row.target_date}</td>
                  <td style={td}>₹{row.predicted_price}</td>
                  <td style={td}>₹{row.actual_price}</td>
                  <td style={td}>₹{row.error}</td>
                  <td style={td}>{row.accuracy_percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

const th = {
  padding: "0.5rem",
  textAlign: "left",
  borderBottom: "1px solid #ddd",
};
const td = { padding: "0.5rem", borderBottom: "1px solid #eee" };

export default App;

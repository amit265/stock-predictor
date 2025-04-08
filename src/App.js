import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import stockOptions from './stockList';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

function App() {
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!symbol) return alert("Please select a stock!");

    setLoading(true);
    try {
      const predictionRes = await axios.get(`https://stock-predictor-backend-4tp3.onrender.com/predict?stock=${symbol}`);
      setData(predictionRes.data);

      const historyRes = await axios.get(`https://stock-predictor-backend-4tp3.onrender.com/history?stock=${symbol}&range=1y`);
      setHistoryData(historyRes.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching data. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>📊 Nifty Stock Price Predictor</h2>

      <div style={{ maxWidth: 400, marginBottom: '1rem' }}>
        <Select
          options={stockOptions}
          onChange={(selected) => setSymbol(selected.value)}
          placeholder="Select a company..."
          isSearchable
        />
      </div>

      <button
        onClick={handlePredict}
        style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
      >
        {loading ? 'Predicting...' : 'Predict'}
      </button>

      {data.length > 0 && (
        <>
          <div style={{ marginTop: '3rem' }}>
            <h3>📈 Next 7 Days Forecast</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ds" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Line type="monotone" dataKey="yhat" stroke="#007bff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ marginTop: '3rem' }}>
            <h3>📉 Historical Trend (Past 1 Year)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ds" />
                <YAxis domain={['auto', 'auto']} />
                <Tooltip />
                <Line type="monotone" dataKey="close" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default App;

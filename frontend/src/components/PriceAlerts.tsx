import { useState } from "react";
import axios from "axios";

interface PriceAlert {
  symbol: string;
  targetPrice: number;
}

const PriceAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [newSymbol, setNewSymbol] = useState<string>("");
  const [newTargetPrice, setNewTargetPrice] = useState<number>(0);

  const addAlert = async () => {
    if (newSymbol && newTargetPrice > 0) {
      try {
        const newAlert: PriceAlert = { symbol: newSymbol, targetPrice: newTargetPrice };
        setAlerts([...alerts, newAlert]);
        setNewSymbol("");
        setNewTargetPrice(0);
        // Optionally, send the alert to the backend for persistent storage
        await axios.post(`${import.meta.env.VITE_API_URL}/alerts`, newAlert);
      } catch (error) {
        console.error("Error adding alert:", error);
      }
    }
  };

  const removeAlert = (symbol: string) => {
    setAlerts(alerts.filter((alert) => alert.symbol !== symbol));
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Price Alerts</h2>
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div key={alert.symbol} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <span>{alert.symbol} - Target: ${alert.targetPrice.toFixed(2)}</span>
            <button type="button" onClick={() => removeAlert(alert.symbol)} className="text-red-500">Remove</button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-col space-y-2">
        <input
          type="text"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value)}
          placeholder="Stock Symbol"
          className="p-2 border rounded"
        />
        <input
          type="number"
          value={newTargetPrice}
          onChange={(e) => setNewTargetPrice(Number(e.target.value))}
          placeholder="Target Price"
          className="p-2 border rounded"
        />
        <button type="button" onClick={addAlert} className="p-2 bg-blue-500 text-white rounded">
          Add Alert
        </button>
      </div>
    </div>
  );
};

export default PriceAlerts;
import { useEffect, useState } from "react";
import axios from "axios";

interface Stock {
  symbol: string;
  price: number | null;
  error?: string;
}

const Watchlist: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [newStock, setNewStock] = useState<string>("");

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/stocks/watchlist`);
        setStocks(response.data);
      } catch (error) {
        console.error("Error fetching watchlist:", error);
      }
    };

    fetchWatchlist();
  }, []);

  const addStock = async () => {
    if (newStock && !stocks.some(stock => stock.symbol === newStock)) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/stocks/watchlist`, { symbol: newStock });
        setStocks([...stocks, response.data]);
        setNewStock("");
      } catch (error) {
        console.error("Error adding stock:", error);
      }
    }
  };

  const removeStock = async (symbol: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/stocks/watchlist/${symbol}`);
      setStocks(stocks.filter(stock => stock.symbol !== symbol));
    } catch (error) {
      console.error("Error removing stock:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Watchlist</h2>
      <div className="space-y-2">
        {stocks.map((stock) => (
          <div key={stock.symbol} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <span>{stock.symbol} - {stock.price !== null ? `$${stock.price.toFixed(2)}` : `Error: ${stock.error}`}</span>
            <button type="button" onClick={() => removeStock(stock.symbol)} className="text-red-500">Remove</button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
          placeholder="Add stock..."
          className="flex-1 p-2 border rounded-l-lg"
        />
        <button type="button" onClick={addStock} className="p-2 bg-blue-500 text-white rounded-r-lg">
          Add
        </button>
      </div>
    </div>
  );
};

export default Watchlist;
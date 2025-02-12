import { useEffect, useState } from "react";
import axios from "axios";

interface PortfolioItem {
  stock: string;
  quantity: number;
  price: number;
  currentPrice: number;
}

const Portfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [newStock, setNewStock] = useState<string>("");
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [newPrice, setNewPrice] = useState<number>(0);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/stocks/portfolio`);
        setPortfolio(response.data);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    };

    fetchPortfolio();
  }, []);

  const addStock = async () => {
    if (newStock && newQuantity > 0 && newPrice > 0) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/stocks/portfolio`, {
          stock: newStock,
          quantity: newQuantity,
          price: newPrice,
        });
        setPortfolio([...portfolio, response.data]);
        setNewStock("");
        setNewQuantity(0);
        setNewPrice(0);
      } catch (error) {
        console.error("Error adding stock:", error);
      }
    }
  };

  const removeStock = async (stock: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/stocks/portfolio/${stock}`);
      setPortfolio(portfolio.filter((item) => item.stock !== stock));
    } catch (error) {
      console.error("Error removing stock:", error);
    }
  };

  const calculateProfitLoss = (quantity: number, price: number, currentPrice: number) => {
    return (currentPrice - price) * quantity;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Portfolio</h2>
      <div className="space-y-2">
        {portfolio.map((item) => (
          <div key={item.stock} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="flex justify-between items-center">
              <span>{item.stock}</span>
              <span>{calculateProfitLoss(item.quantity, item.price, item.currentPrice).toFixed(2)}</span>
              <button
                type="button"
                onClick={() => removeStock(item.stock)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-col space-y-2">
        <input
          type="text"
          value={newStock}
          onChange={(e) => setNewStock(e.target.value)}
          placeholder="Stock Symbol"
          className="p-2 border rounded"
        />
        <input
          type="number"
          value={newQuantity}
          onChange={(e) => setNewQuantity(Number(e.target.value))}
          placeholder="Quantity"
          className="p-2 border rounded"
        />
        <input
          type="number"
          value={newPrice}
          onChange={(e) => setNewPrice(Number(e.target.value))}
          placeholder="Purchase Price"
          className="p-2 border rounded"
        />
        <button type="button" onClick={addStock} className="p-2 bg-blue-500 text-white rounded">
          Add Stock
        </button>
      </div>
    </div>
  );
};

export default Portfolio;
import { useEffect, useState } from "react";
import api from "../utils/api";

interface PortfolioItem {
	symbol: string;
	name: string;
	quantity: number;
	price: number;
	currentPrice: number | null;
	error?: string;
}

const Portfolio: React.FC = () => {
	const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
	const [newStock, setNewStock] = useState<string>("");
	const [newQuantity, setNewQuantity] = useState<number>(0);
	const [newPrice, setNewPrice] = useState<number>(0);

	useEffect(() => {
		const fetchPortfolio = async () => {
			try {
				const response = await api.get("/stocks/portfolio");
				setPortfolio(response.data);
			} catch (error) {
				console.error("Error fetching portfolio:", error);
			}
		};

		fetchPortfolio();
	}, []);

	const handleNewStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewStock(e.target.value.toUpperCase());
	};

	const handleNewQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewQuantity(Number(e.target.value));
	};

	const handleNewPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewPrice(Number(e.target.value));
	};

	const addStock = async () => {
		if (newStock && newQuantity > 0 && newPrice > 0) {
			try {
				const response = await api.post("/stocks/portfolio", {
					symbol: newStock,
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

	const removeStock = async (symbol: string) => {
		try {
			await api.delete(`/stocks/portfolio/${symbol}`);
			setPortfolio(portfolio.filter((item) => item.symbol !== symbol));
		} catch (error) {
			console.error("Error removing stock:", error);
		}
	};

	const calculateProfitLoss = (
		quantity: number,
		price: number,
		currentPrice: number | null,
	) => {
		if (currentPrice === null) return "N/A";
		return ((currentPrice - price) * quantity).toFixed(2);
	};

	return (
		<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
			<h2 className="text-lg font-semibold mb-4">Portfolio</h2>
			<div className="space-y-2">
				{portfolio.map((item) => (
					<div
						key={item.symbol}
						className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
					>
						<div className="flex justify-between items-center">
							<span>
								{item.symbol} - {item.name} - Quantity: {item.quantity} -
								Purchase Price: ${item.price.toFixed(2)} - Current Price:{" "}
								{item.currentPrice !== null
									? `$${item.currentPrice.toFixed(2)}`
									: `Error: ${item.error}`}{" "}
								- Profit/Loss:{" "}
								{calculateProfitLoss(
									item.quantity,
									item.price,
									item.currentPrice,
								)}
							</span>
							<button
								type="button"
								onClick={() => removeStock(item.symbol)}
								className="text-red-500"
							>
								Remove
							</button>
						</div>
					</div>
				))}
			</div>
			<div className="mt-4 relative">
				<input
					type="text"
					value={newStock}
					onChange={handleNewStockChange}
					placeholder="Stock Symbol"
					className="p-2 border rounded w-full"
				/>
				<input
					type="number"
					value={newQuantity}
					onChange={handleNewQuantityChange}
					placeholder="Quantity"
					className="p-2 border rounded w-full mt-2"
				/>
				<input
					type="number"
					value={newPrice}
					onChange={handleNewPriceChange}
					placeholder="Purchase Price"
					className="p-2 border rounded w-full mt-2"
				/>
			</div>
			<div className="mt-4 flex">
				<button
					type="button"
					onClick={addStock}
					className="p-2 bg-blue-500 text-white rounded"
				>
					Add to Portfolio
				</button>
			</div>
		</div>
	);
};

export default Portfolio;

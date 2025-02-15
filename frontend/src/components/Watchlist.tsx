import { useEffect, useState } from "react";
import api from "../utils/api";

interface Stock {
	symbol: string;
	name: string;
	price: number | null;
	error?: string;
}

interface WatchlistProps {
	setSelectedSymbol: (symbol: string) => void;
}

const Watchlist: React.FC<WatchlistProps> = ({ setSelectedSymbol }) => {
	const [stocks, setStocks] = useState<Stock[]>([]);
	const [newStock, setNewStock] = useState<string>("");

	useEffect(() => {
		const fetchWatchlist = async () => {
			try {
				const response = await api.get("/stocks/watchlist");
				setStocks(response.data);
			} catch (error) {
				console.error("Error fetching watchlist:", error);
			}
		};

		fetchWatchlist();
	}, []);

	const handleNewStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewStock(e.target.value.toUpperCase());
	};

	const addStock = async () => {
		if (newStock && !stocks.some((stock) => stock.symbol === newStock)) {
			try {
				const response = await api.post("/stocks/watchlist", {
					symbol: newStock,
				});
				setStocks([...stocks, response.data]);
				setNewStock("");
			} catch (error) {
				console.error("Error adding stock:", error);
			}
		}
	};

	const removeStock = async (symbol: string) => {
		try {
			await api.delete(`/stocks/watchlist/${symbol}`);
			setStocks(stocks.filter((stock) => stock.symbol !== symbol));
		} catch (error) {
			console.error("Error removing stock:", error);
		}
	};

	return (
		<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
			<h2 className="text-lg font-semibold mb-4">Watchlist</h2>
			<div className="space-y-2">
				{stocks.map((stock) => (
					<div
						key={stock.symbol}
						className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer"
						onClick={() => setSelectedSymbol(stock.symbol)}
						onKeyUp={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								setSelectedSymbol(stock.symbol);
							}
						}}
					>
						<span>
							{stock.symbol} - {stock.name} -{" "}
							{stock.price !== null
								? `$${stock.price.toFixed(2)}`
								: `Error: ${stock.error}`}
						</span>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								removeStock(stock.symbol);
							}}
							className="text-red-500"
						>
							Remove
						</button>
					</div>
				))}
			</div>
			<div className="mt-4 relative">
				<input
					type="text"
					value={newStock}
					onChange={handleNewStockChange}
					placeholder="Add stock..."
					className="p-2 border rounded w-full"
				/>
			</div>
			<div className="mt-4 flex">
				<button
					type="button"
					onClick={addStock}
					className="p-2 bg-blue-500 text-white rounded"
				>
					Add
				</button>
			</div>
		</div>
	);
};

export default Watchlist;

import { useEffect, useState } from "react";
import api from "../utils/api";

interface PriceAlert {
	symbol: string;
	name: string;
	targetPrice: number;
	currentPrice: number | null;
	error?: string;
}

const PriceAlerts: React.FC = () => {
	const [alerts, setAlerts] = useState<PriceAlert[]>([]);
	const [newStock, setNewStock] = useState<string>("");
	const [targetPrice, setTargetPrice] = useState<number>(0);

	useEffect(() => {
		const fetchAlerts = async () => {
			try {
				const response = await api.get("/stocks/alerts");
				setAlerts(response.data);
			} catch (error) {
				console.error("Error fetching alerts:", error);
			}
		};

		fetchAlerts();
	}, []);

	const handleNewStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewStock(e.target.value.toUpperCase());
	};

	const handleTargetPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTargetPrice(Number(e.target.value));
	};

	const addAlert = async () => {
		if (newStock && targetPrice > 0) {
			try {
				const response = await api.post("/stocks/alerts", {
					symbol: newStock,
					targetPrice,
				});
				setAlerts([...alerts, response.data]);
				setNewStock("");
				setTargetPrice(0);
			} catch (error) {
				console.error("Error adding alert:", error);
			}
		}
	};

	const removeAlert = async (symbol: string) => {
		try {
			await api.delete(`/stocks/alerts/${symbol}`);
			setAlerts(alerts.filter((alert) => alert.symbol !== symbol));
		} catch (error) {
			console.error("Error removing alert:", error);
		}
	};

	return (
		<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
			<h2 className="text-lg font-semibold mb-4">Price Alerts</h2>
			<div className="space-y-2">
				{alerts.map((alert) => (
					<div
						key={alert.symbol}
						className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
					>
						<div className="flex justify-between items-center">
							<span>
								{alert.symbol} - {alert.name} - Target Price: $
								{alert.targetPrice.toFixed(2)} - Current Price:{" "}
								{alert.currentPrice !== null
									? `$${alert.currentPrice.toFixed(2)}`
									: `Error: ${alert.error}`}
							</span>
							<button
								type="button"
								onClick={() => removeAlert(alert.symbol)}
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
					value={targetPrice}
					onChange={handleTargetPriceChange}
					placeholder="Target Price"
					className="p-2 border rounded w-full mt-2"
				/>
			</div>
			<div className="mt-4 flex">
				<button
					type="button"
					onClick={addAlert}
					className="p-2 bg-blue-500 text-white rounded"
				>
					Add Alert
				</button>
			</div>
		</div>
	);
};

export default PriceAlerts;

import { useEffect, useState } from "react";
import type { FC } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import api from "../utils/api";

interface StockData {
	date: string;
	price: number;
}

interface StockChartProps {
	symbol: string;
}

const StockChart: FC<StockChartProps> = ({ symbol }) => {
	const [data, setData] = useState<StockData[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			if (!symbol) return;

			setLoading(true);
			setError(null);

			try {
				const response = await api.get(`/stock/${symbol}`);
				setData(response.data);
			} catch (error) {
				setError(
					error instanceof Error ? error.message : "Failed to fetch data",
				);
				console.error(`Error fetching stock data for symbol ${symbol}:`, error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [symbol]);

	if (loading) {
		return (
			<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
				<h2 className="text-lg font-semibold mb-4">Loading...</h2>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
				<h2 className="text-lg font-semibold mb-4">Error: {error}</h2>
			</div>
		);
	}

	return (
		<div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
			<h2 className="text-lg font-semibold mb-4">Stock Chart - {symbol}</h2>
			<ResponsiveContainer width="100%" height={400}>
				<LineChart data={data}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis dataKey="date" />
					<YAxis />
					<Tooltip />
					<Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default StockChart;

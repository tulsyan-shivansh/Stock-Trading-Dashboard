import { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Watchlist from "./components/Watchlist";
import StockChart from "./components/StockChart";
import Portfolio from "./components/Portfolio";
import PriceAlerts from "./components/PriceAlerts";
import SignUp from "./components/SignUp";
import Login from "./components/Login";

const App: React.FC = () => {
	const [darkMode, setDarkMode] = useState<boolean>(false);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [selectedSymbol, setSelectedSymbol] = useState<string>("");

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
	};

	useEffect(() => {
		const token = localStorage.getItem("token");
		setIsAuthenticated(!!token);
	}, []);

	return (
		<Router>
			<div className={darkMode ? "dark" : ""}>
				<div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
					<Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
					<div className="container mx-auto p-4 space-y-4">
						<Routes>
							<Route path="/signup" element={<SignUp />} />
							<Route
								path="/login"
								element={<Login setIsAuthenticated={setIsAuthenticated} />}
							/>
							<Route
								path="/"
								element={
									isAuthenticated ? (
										<>
											<Watchlist setSelectedSymbol={setSelectedSymbol} />
											{selectedSymbol && <StockChart symbol={selectedSymbol} />}
											<Portfolio />
											<PriceAlerts />
										</>
									) : (
										<Navigate to="/login" />
									)
								}
							/>
						</Routes>
					</div>
				</div>
			</div>
		</Router>
	);
};

export default App;

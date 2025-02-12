import { useState } from "react";
import Navbar from "./components/Navbar";
import Watchlist from "./components/Watchlist";
import StockChart from "./components/StockChart";
import Portfolio from "./components/Portfolio";
import PriceAlerts from "./components/PriceAlerts";

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="container mx-auto p-4 space-y-4">
          <Watchlist />
          <StockChart />
          <Portfolio />
          <PriceAlerts />
        </div>
      </div>
    </div>
  );
};

export default App;
const axios = require("axios");

const fetchStockData = async (symbol) => {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data["Time Series (Daily)"];
        const formattedData = Object.keys(data).map((date) => ({
            date,
            price: Number.parseFloat(data[date]["4. close"]),
        }));
        return formattedData;
    } catch (error) {
        console.error("Error fetching stock data:", error);
        throw error;
    }
};

module.exports = fetchStockData;
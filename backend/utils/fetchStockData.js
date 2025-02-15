const axios = require("axios");

const fetchStockData = async (symbol) => {
  if (!symbol) {
    throw new Error("Symbol is required");
  }

  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
    const response = await axios.get(url);

    // Log the full response for debugging
    console.log("Alpha Vantage API response:", response.data);

    if (response.data['Error Message']) {
      throw new Error(response.data['Error Message']);
    }

    if (response.data.Note) {
      throw new Error('API call frequency limit reached');
    }

    const data = response.data['Time Series (Daily)'];
    if (!data) {
      throw new Error(`No data found for symbol ${symbol}`);
    }

    const metaData = response.data['Meta Data'];
    const name = metaData['2. Symbol']; // Assuming the name is the symbol itself, you might need to adjust this based on actual API response

    const formattedData = Object.entries(data).map(([date, values]) => ({
      date,
      price: Number(values['4. close'])
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    return { name, data: formattedData };
  } catch (error) {
    console.error(`Error fetching stock data for symbol ${symbol}:`, error);
    throw new Error(error.message);
  }
};

module.exports = fetchStockData;
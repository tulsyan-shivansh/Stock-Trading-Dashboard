const axios = require("axios");
require("dotenv").config();

const testAlphaVantageApiKey = async () => {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  const symbol = "AAPL"; // Use a common stock symbol for testing
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data["Error Message"]) {
      console.error("Error: Invalid API key or request.");
    } else if (response.data.Note) {
      console.error("Error: API call frequency limit reached.");
    } else if (response.data["Time Series (Daily)"]) {
      console.log("API key is valid.");
    } else {
      console.error("Error: Unexpected response format.");
    }
  } catch (error) {
    console.error("Error: Unable to reach Alpha Vantage API.", error);
  }
};

testAlphaVantageApiKey();
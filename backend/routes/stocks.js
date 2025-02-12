const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require("../models/User");

// Middleware to set req.userId for demonstration purposes
router.use((req, res, next) => {
  req.userId = "someUserId"; // Replace with actual user ID logic
  next();
});

// Fetch watchlist
router.get("/watchlist", async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const watchlist = await Promise.all(
      user.watchlist.map(async (symbol) => {
        try {
          const response = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
          );
          const data = response.data["Time Series (Daily)"];
          const latestDate = Object.keys(data)[0];
          const price = Number.parseFloat(data[latestDate]["4. close"]);
          return { symbol, price };
        } catch (error) {
          console.error(`Error fetching data for symbol ${symbol}:`, error);
          return { symbol, price: null, error: error.message };
        }
      })
    );
    res.json(watchlist);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    res.status(500).json({ message: "Failed to fetch watchlist", error: error.message });
  }
});

// Add stock to watchlist
router.post("/watchlist", async (req, res) => {
  const { symbol } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.watchlist.includes(symbol)) {
      user.watchlist.push(symbol);
      await user.save();
    }
    res.json({ message: "Stock added to watchlist" });
  } catch (error) {
    console.error("Error adding stock to watchlist:", error);
    res.status(500).json({ message: "Failed to add stock to watchlist", error: error.message });
  }
});

// Fetch portfolio
router.get("/portfolio", async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const portfolio = await Promise.all(
      user.portfolio.map(async (item) => {
        try {
          const response = await axios.get(
            `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${item.stock}&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`
          );
          const data = response.data["Time Series (Daily)"];
          const latestDate = Object.keys(data)[0];
          const currentPrice = Number.parseFloat(data[latestDate]["4. close"]);
          return { ...item, currentPrice };
        } catch (error) {
          console.error(`Error fetching data for stock ${item.stock}:`, error);
          return { ...item, currentPrice: null, error: error.message };
        }
      })
    );
    res.json(portfolio);
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    res.status(500).json({ message: "Failed to fetch portfolio", error: error.message });
  }
});

// Add stock to portfolio
router.post("/portfolio", async (req, res) => {
  const { stock, quantity, price } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const portfolioItem = { stock, quantity, price };
    user.portfolio.push(portfolioItem);
    await user.save();
    res.status(201).json(portfolioItem);
  } catch (error) {
    console.error("Error adding stock to portfolio:", error);
    res.status(500).json({ message: "Failed to add stock to portfolio", error: error.message });
  }
});

// Remove stock from portfolio
router.delete("/portfolio/:stock", async (req, res) => {
  const { stock } = req.params;

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.portfolio = user.portfolio.filter((item) => item.stock !== stock);
    await user.save();
    res.status(204).send();
  } catch (error) {
    console.error("Error removing stock from portfolio:", error);
    res.status(500).json({ message: "Failed to remove stock from portfolio", error: error.message });
  }
});

module.exports = router;
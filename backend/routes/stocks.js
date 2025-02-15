const express = require("express");
const axios = require("axios");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const fetchStockData = require("../utils/fetchStockData");
const symbols = require("../symbols.json");

// Middleware to authenticate and set req.userId
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('Authentication token required');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new Error('User not found');
    }

    req.userId = user._id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

// Apply auth middleware to all routes
router.use(auth);

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
          const { name, data } = await fetchStockData(symbol);
          const latestData = data[0];
          return { symbol, name, price: latestData.price };
        } catch (error) {
          console.error(`Error fetching data for symbol ${symbol}:`, error);
          return { symbol, name: "", price: null, error: error.message };
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

  if (!symbol) {
    return res.status(400).json({ message: "Symbol is required" });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.watchlist.includes(symbol)) {
      user.watchlist.push(symbol);
      await user.save();
    }
    const { name, data } = await fetchStockData(symbol);
    const latestData = data[0];
    res.json({ symbol, name, price: latestData.price });
  } catch (error) {
    console.error("Error adding stock to watchlist:", error);
    res.status(500).json({ message: "Failed to add stock to watchlist", error: error.message });
  }
});

// Remove stock from watchlist
router.delete("/watchlist/:symbol", async (req, res) => {
  const { symbol } = req.params;

  if (!symbol) {
    return res.status(400).json({ message: "Symbol is required" });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.watchlist = user.watchlist.filter((s) => s !== symbol);
    await user.save();
    res.status(204).send();
  } catch (error) {
    console.error("Error removing stock from watchlist:", error);
    res.status(500).json({ message: "Failed to remove stock from watchlist", error: error.message });
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
          const { name, data } = await fetchStockData(item.stock);
          const latestData = data[0];
          return { ...item, name, currentPrice: latestData.price };
        } catch (error) {
          console.error(`Error fetching data for stock ${item.stock}:`, error);
          return { ...item, name: "", currentPrice: null, error: error.message };
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

  if (!stock) {
    return res.status(400).json({ message: "Stock symbol is required" });
  }

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

  if (!stock) {
    return res.status(400).json({ message: "Stock symbol is required" });
  }

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

// Fetch symbols
router.get("/symbols", (req, res) => {
  res.json(symbols);
});

module.exports = router;
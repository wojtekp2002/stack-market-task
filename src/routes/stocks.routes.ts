import express from "express";
import { marketService } from "../services/market.instance";

const router = express.Router();

router.post("/stocks", (req, res) => {
  const { stocks } = req.body;

  if (!Array.isArray(stocks)) {
    return res.status(400).json({ error: "Stocks must be an array" });
  }

  try {
    marketService.setBankStocks(stocks);

    return res.status(200).json({
      message: "Bank stocks updated successfully",
    });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stocks", (req, res) => {
  try {
    const stocks = marketService.getBankStocks();

    return res.status(200).json({ stocks });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/wallets/:walletId", (req, res) => {
  try {
    const { walletId } = req.params;
    const wallet = marketService.getWallet(walletId);

    return res.status(200).json(wallet);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
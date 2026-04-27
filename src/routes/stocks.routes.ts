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

export default router;
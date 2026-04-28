import express from "express";
import { marketService } from "../services/market.instance";
import { HttpError } from "../errors/HttpError";

const router = express.Router();

router.post("/stocks", (req, res) => {
  const { stocks } = req.body;

  if (!Array.isArray(stocks)) {
    return res.status(400).json({ error: "Stocks must be an array" });
  }

  if (stocks.some(s => !s.name || typeof s.quantity !== "number")) {
    return res.status(400).json({ error: "Invalid stock format" });
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

router.post("/wallets/:walletId/stocks/:stockName", (req, res) => {
  try {
    const { walletId, stockName } = req.params;
    const { type } = req.body;

    if (type !== "buy" && type !== "sell") {
        return res.status(400).json({ error: "Invalid operation type" });
    }

    marketService.performOperation(walletId, stockName, type);

    return res.status(200).json({
      message: "Operation performed successfully",
    });
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.statusCode).json({ error: err.message });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/log", (req, res) => {
  try {
    const auditLog = marketService.getAuditLog();
    return res.status(200).json(auditLog);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/chaos", (req, res) => {
  process.exit(1);
});


export default router;
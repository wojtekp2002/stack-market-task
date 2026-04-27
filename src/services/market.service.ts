import { OperationType } from "../types/operation.type";
import { Stock} from "../models/stock.model";
import { Wallet } from "../models/wallet.model";
import { AuditLogEntry } from "../models/audit-log.model";
import { HttpError } from "../errors/HttpError";

export class MarketService {
  private bankStocks: Stock[] = [];
  private wallets: Map<string, Wallet> = new Map();
  private auditLog: AuditLogEntry[] = [];

  setBankStocks(stocks: Stock[]): void {
    this.bankStocks = stocks.map((stock) => ({
      name: stock.name,
      quantity: stock.quantity,
    }));
  }

  getBankStocks(): Stock[] {
      return this.bankStocks.map((stock) => ({
      name: stock.name,
      quantity: stock.quantity,
    }));
  }

  getWallet(walletId: string): Wallet {
    const wallet = this.wallets.get(walletId);
    
    if (!wallet) {
      return {
        id: walletId,
        stocks: []
      };
    }

    return {
      id: wallet.id,
      stocks: wallet.stocks.map(s => ({
        name: s.name,
        quantity: s.quantity
      }))
    };
  }

  private getOrCreateWallet(walletId: string): Wallet {
    let wallet = this.wallets.get(walletId);

    if (!wallet) {
      wallet = {
        id: walletId,
        stocks: [],
      };
      this.wallets.set(walletId, wallet);
    }

    return wallet;
  }

  private getOrCreateWalletStock(wallet: Wallet, stockName: string): Stock {
    let walletStock = wallet.stocks.find(
      (stock) => stock.name === stockName
    );

    if (!walletStock) {
      walletStock = { name: stockName, quantity: 0 };
      wallet.stocks.push(walletStock);
    }

    return walletStock;
  }

  performOperation(walletId: string, stockName: string, type: OperationType): void {
    const bankStock = this.bankStocks.find((stock) => stock.name === stockName);

    if (!bankStock) {
      throw new HttpError(404, "Stock not found");
    }

    if (type === "buy") {
      if (bankStock.quantity <= 0) {
        throw new HttpError(400, "Stock is not available in bank");
      }

      const wallet = this.getOrCreateWallet(walletId);
      const walletStock = this.getOrCreateWalletStock(wallet, stockName);

      bankStock.quantity -= 1;
      walletStock.quantity += 1;

      this.auditLog.push({
        type: "buy",
        walletId,
        stockName,
      });

      return;
    }

    if (type === "sell") {
      const wallet = this.wallets.get(walletId);

      if (!wallet) {
        throw new HttpError(400, "Stock is not available in wallet");
      }

      const walletStock = wallet.stocks.find(
        (stock) => stock.name === stockName
      );

      if (!walletStock || walletStock.quantity <= 0) {
        throw new HttpError(400, "Stock is not available in wallet");
      }

      walletStock.quantity -= 1;
      bankStock.quantity += 1;

      this.auditLog.push({
        type: "sell",
        walletId,
        stockName,
      });

      return;
    }

    throw new HttpError(400, "Invalid operation type");
  }

}
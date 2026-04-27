import { AuditLogEntry, OperationType, Stock, Wallet } from "../models/types";
import { HttpError } from "../errors/HttpError";

export class MarketService {
  private bankStocks: Stock[] = [];
  private wallets: Map<string, Wallet> = new Map();
  private auditLog: AuditLogEntry[] = [];

  

}
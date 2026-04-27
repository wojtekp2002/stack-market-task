import { OperationType } from "../models/operation.type";
import { Stock} from "../models/stock.model";
import { Wallet } from "../models/wallet.model";
import { AuditLogEntry } from "../models/audit-log.model";
import { HttpError } from "../errors/HttpError";

export class MarketService {
  private bankStocks: Stock[] = [];
  private wallets: Map<string, Wallet> = new Map();
  private auditLog: AuditLogEntry[] = [];



}
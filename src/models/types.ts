export type OperationType = "buy" | "sell";

export interface Stock {
  name: string;
  quantity: number;
}

export interface Wallet {
  id: string;
  stocks: Stock[];
}

export interface AuditLogEntry {
  type: OperationType;
  wallet_id: string;
  stock_name: string;
}
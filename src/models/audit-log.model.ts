import { OperationType } from "../types/operation.type";

export interface AuditLogEntry {
  type: OperationType;
  walletId: string;
  stockName: string;
}
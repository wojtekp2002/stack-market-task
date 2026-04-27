import { OperationType } from "./operation.type";

export interface AuditLogEntry {
  type: OperationType;
  walletId: string;
  stockName: string;
}
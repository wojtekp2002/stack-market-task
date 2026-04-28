import {Stock} from './stock.model'

export interface Wallet {
  id: string;
  stocks: Stock[];
}
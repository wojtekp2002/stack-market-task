# Stock Market Simulator - interview task

Simple in-memory REST API that simulates a simplified stock market.

The system consists of:
- wallets that can own stocks
- a bank that stores available stocks
- an audit log of successful wallet operations

Stock price is fixed at `1`, wallet balance is not tracked, and all operations are executed immediately.

## Tech stack

- Node.js
- Express
- TypeScript
- Docker

## Requirements

- Node.js 18+
- npm
- Docker

## Running locally

Install dependencies:

```bash
npm install
```

Start the application in development mode:

```bash
npm run dev
```

Application runs by default on:

```txt
http://localhost:8080
```

You can verify that the server is running by calling:

```http
GET /health
```

Expected response:

```json
{
  "status": "ok"
}
```

## Configuration

The application port can be configured using the `PORT` environment variable.

Linux / macOS:

```bash
PORT=3000 npm run dev
```

Windows PowerShell:

```powershell
$env:PORT=3000; npm run dev
```

If no port is provided, the application uses port `8080`.

## Running with Docker

Build the Docker image:

```bash
docker build -t stock-app .
```

Run the container:

```bash
docker run --rm -p 8080:8080 stock-app
```

If port `8080` is already in use on your machine, you can map the container to another local port:

```bash
docker run --rm -p 8081:8080 stock-app
```

Then use:

```txt
http://localhost:8081
```

## API Endpoints

### Health check

```http
GET /health
```

Response:

```json
{
  "status": "ok"
}
```

---

### Set bank stocks

```http
POST /stocks
```

Request body:

```json
{
  "stocks": [
    { "name": "stock1", "quantity": 99 },
    { "name": "stock2", "quantity": 1 }
  ]
}
```

Response:

```json
{
  "message": "Bank stocks updated successfully"
}
```

---

### Get bank stocks

```http
GET /stocks
```

Response:

```json
{
  "stocks": [
    { "name": "stock1", "quantity": 99 },
    { "name": "stock2", "quantity": 1 }
  ]
}
```

---

### Get wallet state

```http
GET /wallets/:walletId
```

Example:

```http
GET /wallets/user1
```

Response:

```json
{
  "id": "user1",
  "stocks": [
    { "name": "stock1", "quantity": 1 }
  ]
}
```

If the wallet does not exist, the endpoint returns an empty wallet:

```json
{
  "id": "user1",
  "stocks": []
}
```

---

### Get stock quantity in wallet

```http
GET /wallets/:walletId/stocks/:stockName
```

Example:

```http
GET /wallets/user1/stocks/stock1
```

Response:

```json
1
```

If the wallet or stock does not exist, the endpoint returns:

```json
0
```

---

### Buy or sell stock

```http
POST /wallets/:walletId/stocks/:stockName
```

Request body for buying:

```json
{
  "type": "buy"
}
```

Request body for selling:

```json
{
  "type": "sell"
}
```

Response:

```json
{
  "message": "Operation performed successfully"
}
```

Possible error responses:

```json
{
  "error": "Invalid operation type"
}
```

```json
{
  "error": "Stock not found"
}
```

```json
{
  "error": "Stock is not available in bank"
}
```

```json
{
  "error": "Stock is not available in wallet"
}
```

---

### Get audit log

```http
GET /log
```

Response:

```json
{
  "log": [
    {
      "type": "buy",
      "walletId": "user1",
      "stockName": "stock1"
    },
    {
      "type": "sell",
      "walletId": "user1",
      "stockName": "stock1"
    }
  ]
}
```

Only successful wallet operations are stored in the audit log.

---

### Chaos endpoint

```http
POST /chaos
```

This endpoint terminates the application process and can be used to simulate an application crash.

## Manual testing scenario

A simple testing flow:

1. Initialize bank stocks:

```http
POST /stocks
```

```json
{
  "stocks": [
    { "name": "apple", "quantity": 2 },
    { "name": "tesla", "quantity": 1 }
  ]
}
```

2. Buy one Apple stock:

```http
POST /wallets/user1/stocks/apple
```

```json
{
  "type": "buy"
}
```

3. Check wallet state:

```http
GET /wallets/user1
```

4. Check bank stock state:

```http
GET /stocks
```

5. Check wallet stock quantity:

```http
GET /wallets/user1/stocks/apple
```

6. Sell one Apple stock:

```http
POST /wallets/user1/stocks/apple
```

```json
{
  "type": "sell"
}
```

7. Check audit log:

```http
GET /log
```

## Design decisions

- The application uses in-memory storage because persistence was not required.
- Business logic is kept in `MarketService`.
- Routes are responsible only for HTTP request and response handling.
- Wallets are created automatically only when buying stock.
- Selling stock from a non-existing or empty wallet returns `400`.
- Buying a stock that does not exist in the bank returns `404`.
- Service methods return defensive copies to avoid accidental external state mutation.
- The API follows the endpoint structure defined in the task requirements.

## Project structure

```txt
src/
├── errors/
│   └── HttpError.ts
├── models/
│   ├── audit-log.model.ts
│   ├── stock.model.ts
│   └── wallet.model.ts
├── routes/
│   └── stocks.routes.ts
├── services/
│   ├── market.instance.ts
│   └── market.service.ts
├── types/
│   └── operation.type.ts
└── server.ts
```

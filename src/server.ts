import express from "express";
import cors from "cors";
import stocksRouter from "./routes/stocks.routes";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api", stocksRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

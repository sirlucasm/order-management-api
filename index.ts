import "dotenv/config";
import express from "express";
import routes from "./src/routes";
import { errorMiddleware } from "./src/middlewares/error";
import cors from "cors";
import { ErrorResponse } from "./src/lib/classes/error";
import { database } from "./src/lib/mongoose";

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    status: "running",
    env: process.env.NODE_ENV,
    version: process.env.npm_package_version,
  });
});

app.use("/v1", routes);

app.use((req, res, next) => {
  const error = new ErrorResponse("Page not found", 404);

  res.status(404).json(error.serializeErrors());
});

app.use(errorMiddleware);

database.on(
  "error",
  console.log.bind(console, "🔴 Connection error to MongoDB")
);
database.once("open", () => {
  console.log("🟢 Successful connection to MongoDB");
});

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}...`);
});

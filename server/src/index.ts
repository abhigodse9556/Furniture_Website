import cors from "cors";
import express from "express";

import { config } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import routes from "./routes";

const app = express();

app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", routes);
app.use(errorHandler);

app.listen(config.port, "0.0.0.0", () => {
  console.log(
    `Furniture API listening on http://0.0.0.0:${config.port} (CORS: ${config.clientOrigin})`,
  );
});

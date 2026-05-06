import express, { type Request, Response, NextFunction } from "express";
import serverless from "serverless-http";
import { createServer } from "http";
import { registerRoutes } from "./routes";

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const initPromise = registerRoutes(httpServer, app).then(() => {
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });
});

const serverlessHandler = serverless(app);

export const handler = async (event: any, context: any) => {
  await initPromise;
  return serverlessHandler(event, context);
};

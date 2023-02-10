import express, { Request, Response } from "express";
import cors from "cors";
import { errorHandler } from "./controllers/errorController";
import { userRoutes } from "./routes/auth/userRoutes";

const app = express();

let url;

if (process.env.NODE_ENV === "production") {
  app.use(cors({ origin: process.env.PRODUCTION_URL }));
  url = process.env.PRODUCTION_URL;
} else {
  app.use(cors());
  url = "http://localhost:3000";
}

import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server, {
  cors: {
    origin: url,
    methods: ["GET", "POST"],
  },
});

app.use(express.json());

// Routes here
app.use(userRoutes);
app.use(errorHandler);

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    // message: req.originalUrl,
    message: "error end point not found!",
  });
});

export { server };

import express from "express";
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import rosterRoutes from "./routes/rosterRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import userRoutes from "./routes/userRoutes.js"
import businessOwnerRoutes from "./routes/businessOwnerRoutes.js";
import qrRoutes from "./routes/qrRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import https from 'https'
import fs from 'fs'

dotenv.config();
const app = express();

// MongoDB connection
dbConnect();

// Whitelist of allowed frontend origins
const allowedOrigins = ["http://localhost:3000", "http://localhost:5173",process.env.CLIENT_APP_URL];

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps or curl)
      if (!origin) return callback(null, true);

      // Check if the request origin is in the whitelist
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Reject if origin is not allowed
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // Required for cookies/credentials
  })
);
app.use(express.json());
app.use(cookieParser());

//Api routes
const apiRouter = express.Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/admin", adminRoutes);
apiRouter.use("/roster", rosterRoutes);
apiRouter.use("/employee", employeeRoutes);
apiRouter.use("/business-owner", businessOwnerRoutes);
apiRouter.use("/user", userRoutes)
apiRouter.use("/qr", qrRoutes);

app.use("/api", apiRouter);

app.listen(3005, () => console.log("Server is running on 3005"));

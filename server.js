import "dotenv/config.js";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./routes/user.js";
import tourRoutes from "./routes/tour.js";

const app = express();

// connect to db
mongoose
    .connect(process.env.MONG_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () => {
            console.log(
                "connected to db & listening to port",
                process.env.PORT
            );
        });
    })
    .catch((err) => console.log(err));

// middleware
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});
app.set("trust proxy", 1);
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);

app.use("/user", userRoutes);
app.use("/tour", tourRoutes);

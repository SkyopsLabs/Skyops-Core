import dotenv from "dotenv";
dotenv.config();

// Import the 'express' module along with 'Request' and 'Response' types from express
import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";

// Load Routes
import user from "./routes/users";
import billing from "./routes/billing";
import model from "./routes/models";
import service from "./routes/service";
import organization from "./routes/organization";
import explorer from "./routes/aiExplorer";
import { startDiscordBot } from "./scripts/discord-bot";

// Create an Express application
const app = express();

// Cors
app.use(cors());

// Body Parser
app.use(express.json());

// Specify the port number for the serve  r
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Set Routes
app.use("/api/users", user);
app.use("/api/billing", billing);
app.use("/api/models", model);
app.use("/api/service", service);
app.use("/api/orgs", organization);
app.use("/api/explorer", explorer);


//Start discord bot
startDiscordBot().then(data=>console.log("Discord bot started")).catch(err=>console.log("Error in starting discord bot"));

// Define a route for the root path ('/')
app.get("/", (req: Request, res: Response) => {
  // Send a response to the client
  res.send("You are accessing the Intellify server in the illegal way!");
});

// Start the server and listen on the specified port
app.listen(port, () => {
  // Log a message when the server is successfully running
  console.log(`Server is running on http://localhost:${port}`);
});

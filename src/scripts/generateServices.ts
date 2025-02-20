import dotenv from "dotenv";
import mongoose from "mongoose";

import { Service } from "../models/Service";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("MongoDB is connected."))
  .catch((err) => console.error(err));

const services = [
  {
    name: "8x A100 (80 GB SXM4)",
    defaultValue: 4,
  },
  {
    name: "1x A100 (40 GB SXM4)",
    defaultValue: 4,
  },
  {
    name: "1x H100 (80 GB PCIe)",
    defaultValue: 4,
  },
  {
    name: "1x T4 (16 GB)",
    defaultValue: 3,
  },
  {
    name: "x86",
    defaultValue: 2,
  },
  {
    name: "4x T4 (16 GB)",
    defaultValue: 4,
  },
  {
    name: "1x A10 (24 GB)",
    defaultValue: 5,
  },
  {
    name: "4x A10 (24 GB)",
    defaultValue: 6,
  },
  {
    name: "1x RTX 4090 (24 GB)",
    defaultValue: 4,
  },
  {
    name: "8x H100 (80 GB SXM5)",
    defaultValue: 4,
  },
];

(async () => {
  if (services.length > 0) {
    for (let i = 0; i < services.length; i++) {
      await Service.create({
        name: services[i].name,
        defaultValue: services[i].defaultValue,
      });
    }
  }
})();

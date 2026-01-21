import fs from "node:fs";
import path from "node:path";
import winston from "winston";

const isProd = process.env.NODE_ENV === "production";

const logDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return stack
      ? `${timestamp} [${level}] ${message} - ${stack}`
      : `${timestamp} [${level}] ${message}`;
  }),
);

const devTransports = [
  new winston.transports.Console({
    level: "debug",
    format: winston.format.colorize({ all: true }),
  }),
];

const prodTransports = [
  new winston.transports.Console({
    level: "info",
    format: winston.format.colorize({ all: true }),
  }),
  new winston.transports.File({
    filename: path.join(logDir, "error.log"),
    level: "error",
  }),
];

export const logger = winston.createLogger({
  level: isProd ? "info" : "debug",
  format: logFormat,
  transports: isProd ? prodTransports : devTransports,
});

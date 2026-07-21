type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) this.logs.shift();

    if (this.isDevelopment) {
      const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`;
      const ctx = context ? ` ${JSON.stringify(context)}` : "";
      const err = error ? ` ${error.message}` : "";
      switch (level) {
        case "error":
          console.error(`${prefix} ${message}${ctx}${err}`);
          break;
        case "warn":
          console.warn(`${prefix} ${message}${ctx}${err}`);
          break;
        case "info":
          console.info(`${prefix} ${message}${ctx}`);
          break;
        case "debug":
          console.debug(`${prefix} ${message}${ctx}`);
          break;
      }
    }
  }

  error(message: string, context?: Record<string, unknown>, error?: Error) {
    this.log("error", message, context, error);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log("warn", message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log("info", message, context);
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log("debug", message, context);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
  }
}

export const logger = new Logger();

export function createContextLogger(prefix: string) {
  return {
    error: (message: string, context?: Record<string, unknown>, error?: Error) =>
      logger.error(`[${prefix}] ${message}`, context, error),
    warn: (message: string, context?: Record<string, unknown>) =>
      logger.warn(`[${prefix}] ${message}`, context),
    info: (message: string, context?: Record<string, unknown>) =>
      logger.info(`[${prefix}] ${message}`, context),
    debug: (message: string, context?: Record<string, unknown>) =>
      logger.debug(`[${prefix}] ${message}`, context),
  };
}
type LogLevel = "info" | "warn" | "error" | "debug";

class Logger {
  private isDevelopment = process.env.NODE_ENV !== "production";

  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>) {
    const timestamp = new Date().toISOString();
    const ctxString = context ? ` | Context: ${JSON.stringify(context)}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${ctxString}`;
  }

  info(message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      console.log(`\x1b[36m${this.formatMessage("info", message, context)}\x1b[0m`);
    }
  }

  warn(message: string, context?: Record<string, any>) {
    console.warn(`\x1b[33m${this.formatMessage("warn", message, context)}\x1b[0m`);
  }

  error(message: string, error?: Error | unknown, context?: Record<string, any>) {
    const errDetails = error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error;
    console.error(`\x1b[31m${this.formatMessage("error", message, { ...context, error: errDetails })}\x1b[0m`);
  }

  debug(message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      console.debug(`\x1b[35m${this.formatMessage("debug", message, context)}\x1b[0m`);
    }
  }
}

export const logger = new Logger();

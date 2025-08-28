
import fs from 'fs';
import path from 'path';
import os from 'os';

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';


export class AppLogger {
  private static instance: AppLogger | null = null;
  private logFile: string;
  private level: LogLevel;
  private static levelOrder: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  private constructor(logFileName = 'application.log', level: LogLevel = 'info') {
    // Always use OS temp directory for logs
    const tempDir = path.join(os.tmpdir(), 'SafeBoxLogs');
    console.log('Log directory:', tempDir);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    this.logFile = path.join(tempDir, logFileName);
    this.level = level;
  }

  public static getInstance(logFileName = 'application.log', level: LogLevel = 'info'): AppLogger {
    if (!AppLogger.instance) {
      AppLogger.instance = new AppLogger(logFileName, level);
    }
    return AppLogger.instance;
  }

  setLevel(level: LogLevel) {
    this.level = level;
  }

  private shouldLog(level: LogLevel) {
    return AppLogger.levelOrder[level] <= AppLogger.levelOrder[this.level];
  }

  private writeLog(level: LogLevel, message: string) {
    if (!this.shouldLog(level)) return;
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;
    fs.appendFileSync(this.logFile, logLine, 'utf-8');
  }

  error(message: string) {
    this.writeLog('error', message);
  }
  warn(message: string) {
    this.writeLog('warn', message);
  }
  info(message: string) {
    this.writeLog('info', message);
  }
  debug(message: string) {
    this.writeLog('debug', message);
  }
  trace(message: string) {
    this.writeLog('debug', '[TRACE] ' + message);
  }
  metric(message: string) {
    this.writeLog('info', '[METRIC] ' + message);
  }
}

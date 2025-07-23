// Error handling and logging system for Man vs God chess game

export interface ErrorLog {
  timestamp: string
  level: 'error' | 'warn' | 'info' | 'debug'
  category: string
  message: string
  details?: any
  stack?: string
  userId?: string
  sessionId?: string
  levelId?: number
  action?: string
}

export interface GameError extends Error {
  category: string
  levelId?: number
  action?: string
  recoverable?: boolean
}

class ErrorHandler {
  private logs: ErrorLog[] = []
  private maxLogs = 100
  private googleFormUrl?: string
  private sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  setGoogleFormUrl(url: string) {
    this.googleFormUrl = url
  }

  private addLog(log: ErrorLog) {
    this.logs.push(log)
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${log.level.toUpperCase()}] ${log.category}: ${log.message}`, log.details)
    }

    // Send critical errors to Google Form
    if (log.level === 'error' && this.googleFormUrl) {
      this.sendToGoogleForm(log)
    }
  }

  private async sendToGoogleForm(errorLog: ErrorLog) {
    if (!this.googleFormUrl) {
      console.warn('Google Form URL not set for error logging')
      return
    }

    try {
      // Create a comprehensive traceback string with all error information
      const traceback = [
        `=== MAN VS GOD ERROR LOG ===`,
        `Timestamp: ${errorLog.timestamp}`,
        `Level: ${errorLog.level.toUpperCase()}`,
        `Category: ${errorLog.category}`,
        `Message: ${errorLog.message}`,
        `Session ID: ${errorLog.sessionId}`,
        `Level ID: ${errorLog.levelId || 'N/A'}`,
        `Action: ${errorLog.action || 'N/A'}`,
        `Details: ${JSON.stringify(errorLog.details, null, 2)}`,
        `Stack Trace:`,
        errorLog.stack || 'No stack trace available',
        `=== END ERROR LOG ===`
      ].join('\n')

      const formData = new FormData()
      formData.append('entry.1882440699', traceback) // Actual Google Form field ID

      await fetch(this.googleFormUrl, {
        method: 'POST',
        body: formData
      })
      
      console.log('Error logged to Google Form successfully')
    } catch (error) {
      console.error('Failed to send error to Google Form:', error)
    }
  }

  error(message: string, category: string, details?: any, levelId?: number, action?: string) {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'error',
      category,
      message,
      details,
      stack: new Error().stack,
      sessionId: this.sessionId,
      levelId,
      action
    }
    this.addLog(errorLog)
  }

  warn(message: string, category: string, details?: any, levelId?: number, action?: string) {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      category,
      message,
      details,
      sessionId: this.sessionId,
      levelId,
      action
    }
    this.addLog(errorLog)
  }

  info(message: string, category: string, details?: any, levelId?: number, action?: string) {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'info',
      category,
      message,
      details,
      sessionId: this.sessionId,
      levelId,
      action
    }
    this.addLog(errorLog)
  }

  debug(message: string, category: string, details?: any, levelId?: number, action?: string) {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'debug',
      category,
      message,
      details,
      sessionId: this.sessionId,
      levelId,
      action
    }
    this.addLog(errorLog)
  }

  // Handle async operations with error catching
  async withErrorHandling<T>(
    operation: () => Promise<T>,
    category: string,
    fallback?: T,
    levelId?: number,
    action?: string
  ): Promise<T> {
    try {
      this.info(`Starting operation: ${action || 'unknown'}`, category, {}, levelId, action)
      const result = await operation()
      this.info(`Operation completed successfully: ${action || 'unknown'}`, category, {}, levelId, action)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.error(`Operation failed: ${errorMessage}`, category, { error }, levelId, action)
      
      if (fallback !== undefined) {
        this.warn(`Using fallback value for failed operation`, category, { fallback }, levelId, action)
        return fallback
      }
      
      throw error
    }
  }

  // Handle synchronous operations with error catching
  withErrorHandlingSync<T>(
    operation: () => T,
    category: string,
    fallback?: T,
    levelId?: number,
    action?: string
  ): T {
    try {
      this.info(`Starting sync operation: ${action || 'unknown'}`, category, {}, levelId, action)
      const result = operation()
      this.info(`Sync operation completed successfully: ${action || 'unknown'}`, category, {}, levelId, action)
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      this.error(`Sync operation failed: ${errorMessage}`, category, { error }, levelId, action)
      
      if (fallback !== undefined) {
        this.warn(`Using fallback value for failed sync operation`, category, { fallback }, levelId, action)
        return fallback
      }
      
      throw error
    }
  }

  // Get all logs for debugging
  getLogs(): ErrorLog[] {
    return [...this.logs]
  }

  // Clear logs
  clearLogs() {
    this.logs = []
  }

  // Get session ID
  getSessionId(): string {
    return this.sessionId
  }

  // Create a custom error with category
  createError(message: string, category: string, levelId?: number, action?: string): GameError {
    const error = new Error(message) as GameError
    error.category = category
    error.levelId = levelId
    error.action = action
    error.recoverable = true
    return error
  }
}

// Create singleton instance
export const errorHandler = new ErrorHandler()

// Convenience functions
export const logError = (message: string, category: string, details?: any, levelId?: number, action?: string) => {
  errorHandler.error(message, category, details, levelId, action)
}

export const logWarn = (message: string, category: string, details?: any, levelId?: number, action?: string) => {
  errorHandler.warn(message, category, details, levelId, action)
}

export const logInfo = (message: string, category: string, details?: any, levelId?: number, action?: string) => {
  errorHandler.info(message, category, details, levelId, action)
}

export const logDebug = (message: string, category: string, details?: any, levelId?: number, action?: string) => {
  errorHandler.debug(message, category, details, levelId, action)
}

// Error categories
export const ErrorCategories = {
  LEVEL_LOADING: 'level_loading',
  CHESS_MOVE: 'chess_move',
  BETTING: 'betting',
  GOOGLE_SHEETS: 'google_sheets',
  GOOGLE_FORMS: 'google_forms',
  UI_RENDERING: 'ui_rendering',
  STATE_MANAGEMENT: 'state_management',
  NETWORK: 'network',
  VALIDATION: 'validation',
  GAME_LOGIC: 'game_logic'
} as const

// Common error messages
export const ErrorMessages = {
  LEVEL_NOT_FOUND: 'Level not found',
  INVALID_MOVE: 'Invalid chess move',
  INSUFFICIENT_CURRENCY: 'Insufficient currency',
  NETWORK_ERROR: 'Network request failed',
  VALIDATION_ERROR: 'Validation failed',
  RENDER_ERROR: 'Component rendering failed',
  STATE_ERROR: 'State management error'
} as const 
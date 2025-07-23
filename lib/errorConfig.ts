// Error handling configuration for Man vs God chess game

export interface ErrorConfig {
  // Google Form settings for error logging
  googleFormUrl?: string
  googleFormFields: {
    traceback: string
  }
  
  // Logging settings
  maxLogs: number
  enableConsoleLogging: boolean
  enableGoogleFormLogging: boolean
  logLevels: {
    error: boolean
    warn: boolean
    info: boolean
    debug: boolean
  }
  
  // Error recovery settings
  enableErrorRecovery: boolean
  maxRetries: number
  retryDelay: number
  
  // UI error handling
  showErrorDetails: boolean
  enableErrorBoundary: boolean
}

// Default configuration
export const defaultErrorConfig: ErrorConfig = {
  googleFormUrl: undefined, // Will be set by user
  googleFormFields: {
    traceback: 'entry.1882440699' // Actual Google Form field ID
  },
  
  maxLogs: 100,
  enableConsoleLogging: true,
  enableGoogleFormLogging: true,
  logLevels: {
    error: true,
    warn: true,
    info: true,
    debug: process.env.NODE_ENV === 'development'
  },
  
  enableErrorRecovery: true,
  maxRetries: 3,
  retryDelay: 1000,
  
  showErrorDetails: process.env.NODE_ENV === 'development',
  enableErrorBoundary: true
}

// Configuration management
class ErrorConfigManager {
  private config: ErrorConfig = { ...defaultErrorConfig }

  setGoogleFormUrl(url: string) {
    this.config.googleFormUrl = url
  }

  setGoogleFormFields(fields: Partial<ErrorConfig['googleFormFields']>) {
    this.config.googleFormFields = { ...this.config.googleFormFields, ...fields }
  }

  getConfig(): ErrorConfig {
    return { ...this.config }
  }

  updateConfig(updates: Partial<ErrorConfig>) {
    this.config = { ...this.config, ...updates }
  }

  // Load configuration from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('manvsgod_error_config')
      if (stored) {
        const parsed = JSON.parse(stored)
        this.config = { ...this.config, ...parsed }
      }
    } catch (error) {
      console.warn('Failed to load error config from storage:', error)
    }
  }

  // Save configuration to localStorage
  saveToStorage() {
    try {
      localStorage.setItem('manvsgod_error_config', JSON.stringify(this.config))
    } catch (error) {
      console.warn('Failed to save error config to storage:', error)
    }
  }
}

export const errorConfigManager = new ErrorConfigManager()

// Initialize configuration
if (typeof window !== 'undefined') {
  errorConfigManager.loadFromStorage()
} 
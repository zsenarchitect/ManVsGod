'use client'

import React from 'react'
import { logError, logWarn, logInfo, logDebug, ErrorCategories } from '../../lib/errorHandler'

export default function ErrorTest() {
  const testErrorLogging = () => {
    logInfo('Testing error logging system', ErrorCategories.GAME_LOGIC, { test: true })
    logWarn('This is a test warning', ErrorCategories.GAME_LOGIC, { test: true })
    logError('This is a test error', ErrorCategories.GAME_LOGIC, { test: true, timestamp: new Date().toISOString() })
  }

  const testAsyncError = async () => {
    try {
      throw new Error('Test async error')
    } catch (error) {
      logError('Async error test', ErrorCategories.GAME_LOGIC, { error, test: true })
    }
  }

  const testValidationError = () => {
    try {
      // Simulate a validation error
      const invalidMove = 'invalid'
      if (!['e2e4', 'd2d4', 'c2c4'].includes(invalidMove)) {
        throw new Error('Invalid chess move')
      }
    } catch (error) {
      logError('Validation error test', ErrorCategories.VALIDATION, { error, test: true })
    }
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-bold text-god-gold mb-4">Error Logging Test</h3>
      <div className="space-y-2">
        <button
          onClick={testErrorLogging}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Basic Error Logging
        </button>
        <button
          onClick={testAsyncError}
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Test Async Error
        </button>
        <button
          onClick={testValidationError}
          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Test Validation Error
        </button>
      </div>
      <p className="text-sm text-gray-400 mt-4">
        Check the browser console and Google Form for logged errors.
      </p>
    </div>
  )
} 
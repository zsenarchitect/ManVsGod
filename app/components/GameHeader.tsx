'use client'

import React from 'react'

export default function GameHeader() {
  return (
    <header className="text-center py-8">
      <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-god-gold via-collective-purple to-human-blue bg-clip-text text-transparent">
        Man vs God
      </h1>
      <p className="text-xl text-gray-300 max-w-2xl mx-auto">
        Face an escalating series of moral dilemmas while battling against the collective memory of all previous players. 
        Each level gets harder and more hazardous. Can you survive all 5 levels?
      </p>
      <div className="mt-6 flex justify-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-human-blue rounded-full"></div>
          <span className="text-sm text-gray-400">Your Choice</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-god-gold rounded-full animate-pulse-slow"></div>
          <span className="text-sm text-gray-400">Collective Memory</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-collective-purple rounded-full animate-float"></div>
          <span className="text-sm text-gray-400">Dynamic Probabilities</span>
        </div>
      </div>
    </header>
  )
} 
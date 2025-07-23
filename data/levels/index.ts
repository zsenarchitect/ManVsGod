// Level data index file
// Exports all level data and utility functions

import level1 from './level1.json'
import level2 from './level2.json'
import level3 from './level3.json'
import level4 from './level4.json'
import level5 from './level5.json'

export const levels = [level1, level2, level3, level4, level5]

export { default as level1 } from './level1.json'
export { default as level2 } from './level2.json'
export { default as level3 } from './level3.json'
export { default as level4 } from './level4.json'
export { default as level5 } from './level5.json'

// Utility functions
export function getLevel(levelId: number) {
  return levels.find(level => level.id === levelId)
}

export function getAllLevels() {
  return levels
}

export function getLevelCount() {
  return levels.length
}

export function getLevelByDifficulty(difficulty: string) {
  return levels.filter(level => level.difficulty === difficulty)
}

export function getLevelsByHazard(hazard: string) {
  return levels.filter(level => level.hazard === hazard)
}

export function getLevelsByCategory(category: string) {
  return levels.filter(level => level.category === category)
} 
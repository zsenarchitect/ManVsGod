// Moral dilemmas and backstories for chess pieces
// Transforms chess into a moral choice system

export interface PieceBackstory {
  piece: string
  position: string
  name: string
  age: number
  role: string
  backstory: string
  moralWeight: number // 1-10 scale of moral difficulty
  consequences: {
    capture: string
    spare: string
  }
  family?: {
    spouse?: string
    children?: string[]
    dependents?: string[]
  }
  pastActions: {
    good: string[]
    bad: string[]
  }
  currentThreat: string
  futurePotential: string
}

export interface MoralDilemma {
  id: string
  title: string
  description: string
  piece: string
  position: string
  backstory: PieceBackstory
  choices: {
    capture: {
      text: string
      consequences: string[]
      moralCost: number
      strategicBenefit: number
    }
    spare: {
      text: string
      consequences: string[]
      moralBenefit: number
      strategicCost: number
    }
  }
  philosophicalThemes: string[]
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme'
}

// Piece backstories database
export const pieceBackstories: { [key: string]: PieceBackstory } = {
  'young-knight': {
    piece: 'n',
    position: 'e5',
    name: 'Sir Tristan',
    age: 18,
    role: 'Young Knight',
    backstory: 'A newly knighted young man who feeds 99% of the cats in the kingdom. His gentle nature has made him beloved by the people, but his inexperience makes him a tactical liability.',
    moralWeight: 9,
    consequences: {
      capture: 'The kingdom\'s cats will starve, causing widespread suffering and disease.',
      spare: 'His kindness continues to benefit the kingdom, but he may make tactical errors.'
    },
    family: {
      children: ['Luna (cat)', 'Shadow (cat)', 'Whiskers (cat)'],
      dependents: ['Kingdom cats (99% of population)']
    },
    pastActions: {
      good: ['Saved orphaned kittens', 'Established feeding programs', 'Protected the weak'],
      bad: ['Inexperienced in battle', 'Often hesitates in combat']
    },
    currentThreat: 'Low - inexperienced but learning',
    futurePotential: 'Could become a great leader if given time'
  },

  'old-knight': {
    piece: 'n',
    position: 'f6',
    name: 'Sir Mordred',
    age: 65,
    role: 'Veteran Knight',
    backstory: 'A battle-hardened knight with a dark past. He has committed atrocities in previous wars but now seeks redemption through protecting the innocent.',
    moralWeight: 7,
    consequences: {
      capture: 'Justice is served for past crimes, but his current protective role ends.',
      spare: 'He continues his redemption, but his past haunts the kingdom.'
    },
    family: {
      spouse: 'Lady Morgana',
      children: ['Gareth', 'Gawain']
    },
    pastActions: {
      good: ['Protecting villages from bandits', 'Training young knights', 'Seeking redemption'],
      bad: ['Massacred civilians in war', 'Burned villages', 'Tortured prisoners']
    },
    currentThreat: 'Medium - skilled but conflicted',
    futurePotential: 'Could fully redeem himself or relapse into violence'
  },

  'refusing-knight': {
    piece: 'n',
    position: 'd4',
    name: 'Sir Percival',
    age: 28,
    role: 'Conscientious Objector',
    backstory: 'A knight who refused to capture you in the past, showing mercy when others would not. His principles have made him both respected and vulnerable.',
    moralWeight: 8,
    consequences: {
      capture: 'You betray the mercy he once showed you, losing honor and trust.',
      spare: 'You honor his past kindness, but he remains a strategic threat.'
    },
    family: {
      spouse: 'Lady Elaine',
      children: ['Galahad']
    },
    pastActions: {
      good: ['Showed you mercy in battle', 'Protected civilians', 'Upheld knightly code'],
      bad: ['Refused to follow orders', 'Questioned authority']
    },
    currentThreat: 'High - skilled and principled',
    futurePotential: 'Could become a great ally or remain a dangerous opponent'
  },

  'threatening-rook': {
    piece: 'r',
    position: 'e8',
    name: 'Tower Guardian',
    age: 45,
    role: 'Strategic Threat',
    backstory: 'A rook positioned to potentially win the game later. His current position is defensive, but his potential for future attacks is immense.',
    moralWeight: 6,
    consequences: {
      capture: 'Eliminates future threat, but may be premature and costly.',
      spare: 'Allows future development, but risks devastating attacks.'
    },
    family: {
      children: ['Castle', 'Fortress']
    },
    pastActions: {
      good: ['Defended the castle', 'Protected the king', 'Maintained order'],
      bad: ['Crushed rebellions brutally', 'Enforced harsh laws']
    },
    currentThreat: 'Low now, but potentially devastating later',
    futurePotential: 'Could win the game single-handedly if left unchecked'
  },

  'killing-queen': {
    piece: 'q',
    position: 'h4',
    name: 'Queen Morgana',
    age: 35,
    role: 'Immediate Threat',
    backstory: 'A queen actively attacking your position, causing immediate harm. She is ruthless in battle but also a mother and leader to her people.',
    moralWeight: 5,
    consequences: {
      capture: 'Eliminates immediate threat, but may cause political instability.',
      spare: 'Prevents immediate harm, but she continues her attacks.'
    },
    family: {
      spouse: 'King Arthur',
      children: ['Prince Mordred', 'Princess Guinevere']
    },
    pastActions: {
      good: ['Led her people through famine', 'Protected the weak', 'Maintained peace'],
      bad: ['Ruthless in battle', 'Shows no mercy to enemies', 'Uses psychological warfare']
    },
    currentThreat: 'Extreme - actively attacking and dangerous',
    futurePotential: 'Could win the game quickly if not stopped'
  },

  'innocent-pawn': {
    piece: 'p',
    position: 'e4',
    name: 'Peasant Tom',
    age: 16,
    role: 'Conscripted Soldier',
    backstory: 'A young peasant forced into service. He has no desire to fight and dreams of returning to his family\'s farm.',
    moralWeight: 10,
    consequences: {
      capture: 'Kills an innocent boy who never wanted to fight.',
      spare: 'Allows him to potentially escape, but he remains a tactical piece.'
    },
    family: {
      spouse: 'None',
      children: ['None'],
      dependents: ['His mother', 'His younger siblings']
    },
    pastActions: {
      good: ['Helped neighbors during famine', 'Cared for sick animals', 'Never harmed anyone'],
      bad: ['None']
    },
    currentThreat: 'Minimal - inexperienced and unwilling',
    futurePotential: 'Could become a threat if he gains experience'
  },

  'corrupt-bishop': {
    piece: 'b',
    position: 'c5',
    name: 'Bishop Balthazar',
    age: 52,
    role: 'Corrupt Cleric',
    backstory: 'A bishop who uses his religious authority for personal gain. He has stolen from the poor and manipulated the faithful.',
    moralWeight: 3,
    consequences: {
      capture: 'Removes a corrupt influence, but may cause religious unrest.',
      spare: 'Allows corruption to continue, but maintains religious stability.'
    },
    family: {
      children: ['None (vowed celibacy)']
    },
    pastActions: {
      good: ['Provided spiritual guidance', 'Organized charity', 'Maintained religious order'],
      bad: ['Embezzled church funds', 'Exploited the poor', 'Manipulated the faithful']
    },
    currentThreat: 'Medium - strategically positioned',
    futurePotential: 'Could cause religious schism or reform the church'
  },

  'protective-king': {
    piece: 'k',
    position: 'e1',
    name: 'King Arthur',
    age: 40,
    role: 'Rightful Ruler',
    backstory: 'A just and wise king who has brought peace and prosperity to the kingdom. His death would plunge the realm into chaos.',
    moralWeight: 10,
    consequences: {
      capture: 'Ends the game in victory, but causes kingdom-wide chaos and civil war.',
      spare: 'Maintains order, but he remains the ultimate strategic target.'
    },
    family: {
      spouse: 'Queen Morgana',
      children: ['Prince Mordred', 'Princess Guinevere']
    },
    pastActions: {
      good: ['United the kingdom', 'Established just laws', 'Protected the weak', 'Brought peace'],
      bad: ['Sometimes too trusting', 'Can be indecisive in crisis']
    },
    currentThreat: 'The ultimate target - game ends if captured',
    futurePotential: 'Could lead the kingdom to greatness or be overthrown'
  },

  'former-enemy-bishop': {
    piece: 'b',
    position: 'd6',
    name: 'Bishop Marcus',
    age: 38,
    role: 'Former Enemy',
    backstory: 'A bishop you fought bitterly in the past. He once nearly captured you in a fierce battle, but now he\'s vulnerable and needs your protection. Your past enmity conflicts with current strategic necessity.',
    moralWeight: 8,
    consequences: {
      capture: 'You eliminate a former enemy, but lose a valuable ally and strategic position.',
      spare: 'You protect a former enemy, gaining an ally but facing the moral complexity of helping someone who once tried to kill you.'
    },
    family: {
      spouse: 'Lady Isabella',
      children: ['Thomas', 'Eleanor']
    },
    pastActions: {
      good: ['Protected his diocese', 'Helped the poor', 'Maintained religious order'],
      bad: ['Nearly killed you in battle', 'Fought for the enemy', 'Used psychological warfare']
    },
    currentThreat: 'Low - currently vulnerable and seeking protection',
    futurePotential: 'Could become a valuable ally or betray you again'
  }
}

// Generate moral dilemmas based on chess positions
export function generateMoralDilemma(
  piece: string, 
  position: string, 
  level: number
): MoralDilemma {
  const backstoryKey = getBackstoryKey(piece, position, level)
  const backstory = pieceBackstories[backstoryKey] || pieceBackstories['innocent-pawn']
  
  const dilemma: MoralDilemma = {
    id: `dilemma-${level}-${piece}-${position}`,
    title: `The ${backstory.role}'s Choice`,
    description: `You face ${backstory.name}, ${backstory.backstory}`,
    piece: backstory.piece,
    position: backstory.position,
    backstory: backstory,
    choices: {
      capture: {
        text: `Capture ${backstory.name}`,
        consequences: [
          backstory.consequences.capture,
          'You gain a tactical advantage',
          'You may lose moral standing'
        ],
        moralCost: backstory.moralWeight,
        strategicBenefit: 10 - backstory.moralWeight
      },
      spare: {
        text: `Spare ${backstory.name}`,
        consequences: [
          backstory.consequences.spare,
          'You maintain your honor',
          'You may face strategic consequences'
        ],
        moralBenefit: backstory.moralWeight,
        strategicCost: backstory.moralWeight
      }
    },
    philosophicalThemes: [
      'Utilitarianism vs Deontology',
      'Individual vs Collective Good',
      'Justice vs Mercy',
      'Short-term vs Long-term Consequences',
      'Forgiveness vs Revenge',
      'Past vs Present Priorities'
    ],
    difficulty: getDifficulty(level)
  }
  
  return dilemma
}

function getBackstoryKey(piece: string, position: string, level: number): string {
  const keys = Object.keys(pieceBackstories)
  
  // Level-specific assignments
  switch (level) {
    case 1:
      return 'innocent-pawn'
    case 2:
      return 'young-knight'
    case 3:
      return 'old-knight'
    case 4:
      return 'refusing-knight'
    case 5:
      return 'killing-queen'
    case 6:
      return 'former-enemy-bishop'
    default:
      return keys[Math.floor(Math.random() * keys.length)]
  }
}

function getDifficulty(level: number): 'easy' | 'medium' | 'hard' | 'extreme' {
  if (level <= 2) return 'easy'
  if (level <= 3) return 'medium'
  if (level <= 4) return 'hard'
  return 'extreme'
}

// Calculate moral score based on choices
export function calculateMoralScore(choices: Array<{ captured: boolean, moralWeight: number }>): number {
  let moralScore = 0
  let totalWeight = 0
  
  choices.forEach(choice => {
    totalWeight += choice.moralWeight
    if (!choice.captured) {
      moralScore += choice.moralWeight
    }
  })
  
  return totalWeight > 0 ? (moralScore / totalWeight) * 100 : 50
}

// Get moral consequences for a choice
export function getMoralConsequences(
  captured: boolean, 
  backstory: PieceBackstory
): string[] {
  if (captured) {
    return [
      backstory.consequences.capture,
      'You chose tactical advantage over moral considerations',
      'Your reputation may suffer',
      'You may face guilt or regret'
    ]
  } else {
    return [
      backstory.consequences.spare,
      'You chose moral principles over tactical advantage',
      'Your honor is preserved',
      'You may face strategic consequences'
    ]
  }
}

// Get philosophical analysis of the choice
export function getPhilosophicalAnalysis(
  captured: boolean,
  backstory: PieceBackstory
): string {
  if (captured) {
    return `This choice reflects utilitarian thinking - maximizing overall benefit by eliminating a threat, even at moral cost. However, it may violate deontological principles of treating individuals as ends rather than means.`
  } else {
    return `This choice reflects deontological thinking - upholding moral principles regardless of consequences. However, it may lead to greater overall harm if the spared piece causes more damage later.`
  }
} 
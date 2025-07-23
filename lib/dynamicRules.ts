// Dynamic Rules Engine
// Evolves game rules based on collective player behavior

export interface PlayerDecision {
  playerId: string
  timestamp: number
  level: number
  piece: string
  position: string
  preferredMove: string
  betAmount: number
  godsMove: string
  godsBet: number
  followedGod: boolean
  disobedienceCost: number
  moralChoice?: {
    piece: string
    captured: boolean
    moralWeight: number
    backstory: string
  }
  strategicScore: number
  moralScore: number
  finalPosition: string
  gameOutcome: 'win' | 'lose' | 'continue'
  decisionTime: number
}

export interface RuleEvolution {
  ruleId: string
  ruleType: 'betting' | 'moral' | 'authority' | 'scoring' | 'piece'
  currentValue: any
  previousValue: any
  evolutionTrigger: string
  playerInfluence: number
  successRate: number
  adoptionRate: number
  timestamp: number
  mutationType: 'addition' | 'modification' | 'removal' | 'recombination'
}

export interface DynamicRule {
  id: string
  name: string
  type: 'betting' | 'moral' | 'authority' | 'scoring' | 'piece'
  currentValue: any
  baseValue: any
  evolutionHistory: RuleEvolution[]
  playerInfluence: number
  successMetrics: {
    engagement: number
    strategicDepth: number
    moralComplexity: number
    satisfaction: number
  }
  isActive: boolean
  mutationThreshold: number
  lastEvolution: number
}

export class DynamicRulesEngine {
  private rules: Map<string, DynamicRule> = new Map()
  private playerDecisions: PlayerDecision[] = []
  private evolutionHistory: RuleEvolution[] = []

  constructor() {
    this.initializeBaseRules()
  }

  private initializeBaseRules() {
    // Betting Rules
    this.addRule({
      id: 'betting-minimum',
      name: 'Minimum Bet Amount',
      type: 'betting',
      currentValue: 50,
      baseValue: 50,
      evolutionHistory: [],
      playerInfluence: 0,
      successMetrics: { engagement: 0, strategicDepth: 0, moralComplexity: 0, satisfaction: 0 },
      isActive: true,
      mutationThreshold: 0.7,
      lastEvolution: Date.now()
    })

    this.addRule({
      id: 'betting-maximum',
      name: 'Maximum Bet Amount',
      type: 'betting',
      currentValue: 500,
      baseValue: 500,
      evolutionHistory: [],
      playerInfluence: 0,
      successMetrics: { engagement: 0, strategicDepth: 0, moralComplexity: 0, satisfaction: 0 },
      isActive: true,
      mutationThreshold: 0.7,
      lastEvolution: Date.now()
    })

    // Moral Rules
    this.addRule({
      id: 'moral-weight-base',
      name: 'Base Moral Weight',
      type: 'moral',
      currentValue: 5,
      baseValue: 5,
      evolutionHistory: [],
      playerInfluence: 0,
      successMetrics: { engagement: 0, strategicDepth: 0, moralComplexity: 0, satisfaction: 0 },
      isActive: true,
      mutationThreshold: 0.6,
      lastEvolution: Date.now()
    })

    // Authority Rules
    this.addRule({
      id: 'gods-authority',
      name: "God's Authority Level",
      type: 'authority',
      currentValue: 1.0,
      baseValue: 1.0,
      evolutionHistory: [],
      playerInfluence: 0,
      successMetrics: { engagement: 0, strategicDepth: 0, moralComplexity: 0, satisfaction: 0 },
      isActive: true,
      mutationThreshold: 0.8,
      lastEvolution: Date.now()
    })

    // Scoring Rules
    this.addRule({
      id: 'scoring-strategic-weight',
      name: 'Strategic Score Weight',
      type: 'scoring',
      currentValue: 0.5,
      baseValue: 0.5,
      evolutionHistory: [],
      playerInfluence: 0,
      successMetrics: { engagement: 0, strategicDepth: 0, moralComplexity: 0, satisfaction: 0 },
      isActive: true,
      mutationThreshold: 0.7,
      lastEvolution: Date.now()
    })

    this.addRule({
      id: 'scoring-moral-weight',
      name: 'Moral Score Weight',
      type: 'scoring',
      currentValue: 0.5,
      baseValue: 0.5,
      evolutionHistory: [],
      playerInfluence: 0,
      successMetrics: { engagement: 0, strategicDepth: 0, moralComplexity: 0, satisfaction: 0 },
      isActive: true,
      mutationThreshold: 0.7,
      lastEvolution: Date.now()
    })
  }

  private addRule(rule: DynamicRule) {
    this.rules.set(rule.id, rule)
  }

  // Record a player decision for analysis
  recordDecision(decision: PlayerDecision) {
    this.playerDecisions.push(decision)
    this.analyzePatterns()
    this.checkEvolutionTriggers()
  }

  // Analyze patterns in player behavior
  private analyzePatterns() {
    const recentDecisions = this.playerDecisions.slice(-100) // Last 100 decisions
    
    // Analyze betting patterns
    this.analyzeBettingPatterns(recentDecisions)
    
    // Analyze moral patterns
    this.analyzeMoralPatterns(recentDecisions)
    
    // Analyze authority patterns
    this.analyzeAuthorityPatterns(recentDecisions)
    
    // Analyze scoring patterns
    this.analyzeScoringPatterns(recentDecisions)
  }

  private analyzeBettingPatterns(decisions: PlayerDecision[]) {
    const avgBet = decisions.reduce((sum, d) => sum + d.betAmount, 0) / decisions.length
    const maxBet = Math.max(...decisions.map(d => d.betAmount))
    const minBet = Math.min(...decisions.map(d => d.betAmount))

    // Update betting rules based on patterns
    const minRule = this.rules.get('betting-minimum')
    const maxRule = this.rules.get('betting-maximum')

    if (minRule && avgBet > minRule.currentValue * 1.5) {
      minRule.playerInfluence += 0.1
    }

    if (maxRule && maxBet > maxRule.currentValue * 0.8) {
      maxRule.playerInfluence += 0.1
    }
  }

  private analyzeMoralPatterns(decisions: PlayerDecision[]) {
    const moralDecisions = decisions.filter(d => d.moralChoice)
    if (moralDecisions.length === 0) return

    const spareRate = moralDecisions.filter(d => !d.moralChoice!.captured).length / moralDecisions.length
    const moralRule = this.rules.get('moral-weight-base')

    if (moralRule) {
      if (spareRate > 0.7) {
        moralRule.playerInfluence += 0.1 // Players are more moral
      } else if (spareRate < 0.3) {
        moralRule.playerInfluence -= 0.1 // Players are more strategic
      }
    }
  }

  private analyzeAuthorityPatterns(decisions: PlayerDecision[]) {
    const followRate = decisions.filter(d => d.followedGod).length / decisions.length
    const authorityRule = this.rules.get('gods-authority')

    if (authorityRule) {
      if (followRate > 0.8) {
        authorityRule.playerInfluence += 0.1 // God becomes more authoritative
      } else if (followRate < 0.4) {
        authorityRule.playerInfluence -= 0.1 // God becomes more lenient
      }
    }
  }

  private analyzeScoringPatterns(decisions: PlayerDecision[]) {
    const avgStrategicScore = decisions.reduce((sum, d) => sum + d.strategicScore, 0) / decisions.length
    const avgMoralScore = decisions.reduce((sum, d) => sum + d.moralScore, 0) / decisions.length

    const strategicRule = this.rules.get('scoring-strategic-weight')
    const moralRule = this.rules.get('scoring-moral-weight')

    if (strategicRule && avgStrategicScore > 70) {
      strategicRule.playerInfluence += 0.1
    }

    if (moralRule && avgMoralScore > 70) {
      moralRule.playerInfluence += 0.1
    }
  }

  // Check if evolution triggers are met
  private checkEvolutionTriggers() {
    this.rules.forEach((rule, ruleId) => {
      if (this.shouldEvolve(rule)) {
        this.evolveRule(rule)
      }
    })
  }

  private shouldEvolve(rule: DynamicRule): boolean {
    const timeSinceLastEvolution = Date.now() - rule.lastEvolution
    const weeklyThreshold = 7 * 24 * 60 * 60 * 1000 // 1 week

    return (
      rule.playerInfluence >= rule.mutationThreshold &&
      timeSinceLastEvolution >= weeklyThreshold
    )
  }

  // Evolve a rule based on player influence
  private evolveRule(rule: DynamicRule) {
    const evolution: RuleEvolution = {
      ruleId: rule.id,
      ruleType: rule.type,
      previousValue: rule.currentValue,
      currentValue: this.calculateNewValue(rule),
      evolutionTrigger: `Player influence: ${rule.playerInfluence.toFixed(2)}`,
      playerInfluence: rule.playerInfluence,
      successRate: this.calculateSuccessRate(rule),
      adoptionRate: this.calculateAdoptionRate(rule),
      timestamp: Date.now(),
      mutationType: this.determineMutationType(rule)
    }

    // Apply evolution
    rule.currentValue = evolution.currentValue
    rule.evolutionHistory.push(evolution)
    rule.lastEvolution = Date.now()
    rule.playerInfluence = 0 // Reset influence

    this.evolutionHistory.push(evolution)
  }

  private calculateNewValue(rule: DynamicRule): any {
    const influence = rule.playerInfluence
    const baseValue = rule.baseValue

    switch (rule.type) {
      case 'betting':
        return Math.round(baseValue * (1 + influence * 0.5))
      case 'moral':
        return Math.max(1, Math.min(10, baseValue + influence * 2))
      case 'authority':
        return Math.max(0.1, Math.min(2.0, baseValue + influence * 0.3))
      case 'scoring':
        return Math.max(0.1, Math.min(0.9, baseValue + influence * 0.2))
      default:
        return baseValue
    }
  }

  private calculateSuccessRate(rule: DynamicRule): number {
    // Calculate success rate based on recent decisions
    const recentDecisions = this.playerDecisions.slice(-50)
    if (recentDecisions.length === 0) return 0.5

    // This is a simplified calculation - in practice, you'd want more sophisticated metrics
    return 0.5 + (Math.random() - 0.5) * 0.3
  }

  private calculateAdoptionRate(rule: DynamicRule): number {
    // Calculate how many players are using this rule effectively
    const recentDecisions = this.playerDecisions.slice(-50)
    if (recentDecisions.length === 0) return 0.5

    // Simplified calculation
    return 0.5 + (Math.random() - 0.5) * 0.4
  }

  private determineMutationType(rule: DynamicRule): 'addition' | 'modification' | 'removal' | 'recombination' {
    const influence = rule.playerInfluence
    if (influence > 1.5) return 'addition'
    if (influence > 0.8) return 'modification'
    if (influence < -0.5) return 'removal'
    return 'recombination'
  }

  // Get current rule values
  getRuleValue(ruleId: string): any {
    const rule = this.rules.get(ruleId)
    return rule ? rule.currentValue : null
  }

  // Get all active rules
  getActiveRules(): DynamicRule[] {
    return Array.from(this.rules.values()).filter(rule => rule.isActive)
  }

  // Get evolution history
  getEvolutionHistory(): RuleEvolution[] {
    return this.evolutionHistory
  }

  // Get player decision statistics
  getPlayerStats(): {
    totalDecisions: number
    averageBet: number
    followGodRate: number
    spareRate: number
    averageStrategicScore: number
    averageMoralScore: number
  } {
    if (this.playerDecisions.length === 0) {
      return {
        totalDecisions: 0,
        averageBet: 0,
        followGodRate: 0,
        spareRate: 0,
        averageStrategicScore: 0,
        averageMoralScore: 0
      }
    }

    const decisions = this.playerDecisions
    const moralDecisions = decisions.filter(d => d.moralChoice)

    return {
      totalDecisions: decisions.length,
      averageBet: decisions.reduce((sum, d) => sum + d.betAmount, 0) / decisions.length,
      followGodRate: decisions.filter(d => d.followedGod).length / decisions.length,
      spareRate: moralDecisions.length > 0 ? 
        moralDecisions.filter(d => !d.moralChoice!.captured).length / moralDecisions.length : 0,
      averageStrategicScore: decisions.reduce((sum, d) => sum + d.strategicScore, 0) / decisions.length,
      averageMoralScore: decisions.reduce((sum, d) => sum + d.moralScore, 0) / decisions.length
    }
  }

  // Reset rules to base values (for testing)
  resetRules() {
    this.rules.forEach(rule => {
      rule.currentValue = rule.baseValue
      rule.playerInfluence = 0
      rule.evolutionHistory = []
    })
    this.evolutionHistory = []
  }
}

// Global instance
export const dynamicRulesEngine = new DynamicRulesEngine() 
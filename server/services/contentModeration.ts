/**
 * Content Moderation Service
 * 
 * Provides tools for detecting and filtering profanity, hate speech,
 * and other potentially harmful content in user-generated text.
 */

// Types for content moderation
export interface ContentDetectionResult {
  isClean: boolean;
  hasProfanity: boolean;
  hasHateSpeech: boolean;
  hasThreat: boolean;
  categories: string[];
  filteredText?: string;
  severity: 'none' | 'low' | 'medium' | 'high';
  offendingWords: string[];
}

export interface ContentModerationOptions {
  replaceChars?: string;
  allowPartialMatches?: boolean;
  filterByLanguage?: string;
  threshold?: number;
  skipUserIds?: number[];
  strictMode?: boolean;
}

/**
 * Content Moderation Service for detecting and filtering profanity and harmful content
 * 
 * SECURITY FEATURE: Protects users from offensive content and ensures
 * platform safety and compliance with content guidelines.
 */
export class ContentModerationService {
  private static instance: ContentModerationService;
  
  // Base dictionaries - these would be much more comprehensive in production
  // and would be loaded from external files or databases
  private profanityDictionary: Set<string> = new Set();
  private hateSpeechDictionary: Set<string> = new Set();
  private threatDictionary: Set<string> = new Set();
  
  // Words that might be flagged incorrectly (false positives)
  private whitelistDictionary: Set<string> = new Set();
  
  // Track context-based patterns (more sophisticated than simple word matching)
  private contextPatterns: Map<string, RegExp> = new Map();
  
  // Default options
  private defaultOptions: ContentModerationOptions = {
    replaceChars: '****',
    allowPartialMatches: false,
    threshold: 0.7, // Confidence threshold
    strictMode: false,
  };

  private constructor() {
    this.initializeDictionaries();
    this.initializePatterns();
    console.log('[ContentModeration] Service initialized');
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ContentModerationService {
    if (!ContentModerationService.instance) {
      ContentModerationService.instance = new ContentModerationService();
    }
    return ContentModerationService.instance;
  }

  /**
   * Initialize word dictionaries
   * In a production environment, these would be loaded from external sources
   * and would be much more comprehensive
   */
  private initializeDictionaries(): void {
    // Basic profanity dictionary - this is just a small sample for demonstration
    // In production, use a comprehensive dictionary from a reliable source
    const profanityWords = [
      "ass", "asshole", "bastard", "bitch", "bullshit", "crap", "damn", "fuck", 
      "fucking", "shit", "piss", "dick", "cock", "pussy", "whore", "slut", "cunt"
    ];
    
    // Basic hate speech dictionary - just a small sample for demonstration
    const hateSpeechWords = [
      "nigger", "faggot", "spic", "chink", "kike", "retard", "towelhead", "wetback",
      "raghead", "negro"
    ];
    
    // Basic threat dictionary - just a small sample for demonstration
    const threatWords = [
      "kill", "murder", "die", "death", "bomb", "attack", "shoot", "gun", "knife",
      "stab", "burn", "rape", "torture", "hurt", "destroy"
    ];
    
    // Whitelist for false positives
    const whitelistWords = [
      "class", "assess", "assets", "assignment", "passage", "assistant", "massachusetts",
      "cassette", "assume", "association", "passport", "assemble"
    ];
    
    // Add words to dictionaries
    profanityWords.forEach(word => this.profanityDictionary.add(word.toLowerCase()));
    hateSpeechWords.forEach(word => this.hateSpeechDictionary.add(word.toLowerCase()));
    threatWords.forEach(word => this.threatDictionary.add(word.toLowerCase()));
    whitelistWords.forEach(word => this.whitelistDictionary.add(word.toLowerCase()));
    
    console.log(`[ContentModeration] Loaded dictionaries: ${profanityWords.length} profanity words, ${hateSpeechWords.length} hate speech words, ${threatWords.length} threat words`);
  }

  /**
   * Initialize context-based patterns for more nuanced detection
   */
  private initializePatterns(): void {
    // These patterns detect contextual usage that simple word matching might miss
    this.contextPatterns.set('threat', /(?:i\s+(?:will|am\s+going\s+to|gonna|want\s+to)\s+(?:kill|hurt|harm|beat|attack|murder|bomb|shoot|stab|torture|rape|destroy))/i);
    this.contextPatterns.set('racial_slur_context', /(?:you\s+(?:are|fucking|dirty|filthy|stupid|dumb)\s+(?:nigger|faggot|spic|chink|kike|retard))/i);
    this.contextPatterns.set('harassment', /(?:kill\s+yourself|hang\s+yourself|commit\s+suicide|kys)/i);
    
    console.log(`[ContentModeration] Loaded ${this.contextPatterns.size} context patterns`);
  }

  /**
   * Check text for profanity and other harmful content
   * Returns a detailed result with information about detected content
   * 
   * @param text The text to scan for harmful content
   * @param options Configuration options for detection
   */
  public detectHarmfulContent(text: string, options: ContentModerationOptions = {}): ContentDetectionResult {
    // Merge with default options
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    if (!text) {
      return {
        isClean: true,
        hasProfanity: false,
        hasHateSpeech: false,
        hasThreat: false,
        categories: [],
        severity: 'none',
        offendingWords: [],
      };
    }
    
    // Variables to track results
    let hasProfanity = false;
    let hasHateSpeech = false;
    let hasThreat = false;
    const categories: string[] = [];
    const offendingWords: string[] = [];
    let severityScore = 0;
    
    // Prepare text for analysis
    const normalizedText = text.toLowerCase();
    const words = this.tokenize(normalizedText);
    
    // Scan for individual words
    for (const word of words) {
      // Skip if word is in whitelist
      if (this.whitelistDictionary.has(word)) {
        continue;
      }
      
      // Check dictionaries
      if (this.checkDictionary(word, this.profanityDictionary, mergedOptions.allowPartialMatches)) {
        hasProfanity = true;
        if (!categories.includes('profanity')) categories.push('profanity');
        if (!offendingWords.includes(word)) offendingWords.push(word);
        severityScore += 1;
      }
      
      if (this.checkDictionary(word, this.hateSpeechDictionary, mergedOptions.allowPartialMatches)) {
        hasHateSpeech = true;
        if (!categories.includes('hate_speech')) categories.push('hate_speech');
        if (!offendingWords.includes(word)) offendingWords.push(word);
        severityScore += 3; // Hate speech is weighted more seriously
      }
      
      if (this.checkDictionary(word, this.threatDictionary, false)) {
        // For threats, context matters - individual words may not be enough
        // We'll do more context checking below
        if (!offendingWords.includes(word)) offendingWords.push(word);
      }
    }
    
    // Context-based pattern matching for more nuanced detection
    for (const [category, pattern] of this.contextPatterns.entries()) {
      if (pattern.test(normalizedText)) {
        if (category === 'threat') {
          hasThreat = true;
          if (!categories.includes('threat')) categories.push('threat');
          severityScore += 3; // Threats are serious
        } else if (category === 'racial_slur_context') {
          hasHateSpeech = true;
          if (!categories.includes('hate_speech')) categories.push('hate_speech');
          severityScore += 4; // Context-based hate speech is very serious
        } else if (category === 'harassment') {
          if (!categories.includes('harassment')) categories.push('harassment');
          severityScore += 3;
        }
      }
    }
    
    // Determine severity level
    let severity: 'none' | 'low' | 'medium' | 'high' = 'none';
    if (severityScore > 0) {
      severity = severityScore <= 1 ? 'low' : 
                (severityScore <= 3 ? 'medium' : 'high');
    }
    
    // Generate filtered text if requested
    let filteredText: string | undefined;
    if (mergedOptions.replaceChars) {
      filteredText = this.filterText(text, offendingWords, mergedOptions.replaceChars);
    }
    
    // Final result
    return {
      isClean: severityScore === 0,
      hasProfanity,
      hasHateSpeech,
      hasThreat,
      categories,
      filteredText,
      severity,
      offendingWords,
    };
  }

  /**
   * Filter text by replacing offensive words with specified characters
   */
  public filterText(text: string, offendingWords: string[], replaceChars: string = '****'): string {
    if (!text || offendingWords.length === 0) {
      return text;
    }
    
    let filteredText = text;
    
    // Sort words by length (descending) to avoid partial replacements
    const sortedWords = [...offendingWords].sort((a, b) => b.length - a.length);
    
    for (const word of sortedWords) {
      // Case-insensitive replacement
      const regex = new RegExp(`\\b${this.escapeRegExp(word)}\\b`, 'gi');
      filteredText = filteredText.replace(regex, replaceChars);
    }
    
    return filteredText;
  }

  /**
   * Split text into tokens for analysis
   */
  private tokenize(text: string): string[] {
    // Split by spaces and remove punctuation
    return text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 0);
  }

  /**
   * Check if a word exists in a dictionary
   */
  private checkDictionary(word: string, dictionary: Set<string>, allowPartial: boolean = false): boolean {
    if (dictionary.has(word)) {
      return true;
    }
    
    if (allowPartial) {
      // Check for partial matches (e.g., "fck" matches "fuck")
      for (const dictWord of dictionary) {
        if (this.isPartialMatch(word, dictWord)) {
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Check if a word is a partial match for a dictionary word
   * This helps catch attempts to bypass filters with altered spellings
   */
  private isPartialMatch(input: string, target: string): boolean {
    // Skip very short inputs or large length differences
    if (input.length < 3 || Math.abs(input.length - target.length) > 2) {
      return false;
    }
    
    // Simple Levenshtein distance-based detection
    if (this.calculateLevenshteinDistance(input, target) <= 1) {
      return true;
    }
    
    // Check for letter substitutions (e.g., "f*ck", "fu©k")
    const normalizedInput = input.replace(/[^a-z]/gi, '*');
    const normalizedTarget = target.replace(/[^a-z]/gi, '*');
    
    if (normalizedInput === normalizedTarget) {
      return true;
    }
    
    return false;
  }

  /**
   * Calculate Levenshtein distance between two strings
   * Used for fuzzy matching to catch slight misspellings or intentional alterations
   */
  private calculateLevenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];
    
    // Initialize matrix
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
    
    // Fill matrix
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = a[j - 1] === b[i - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    
    return matrix[b.length][a.length];
  }

  /**
   * Escape special characters in string for RegExp
   */
  private escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Public method to add custom words to dictionaries
   * Useful for updating the dictionaries at runtime
   */
  public addCustomWords(words: string[], category: 'profanity' | 'hate_speech' | 'threat' | 'whitelist'): void {
    const dictionary = 
      category === 'profanity' ? this.profanityDictionary :
      category === 'hate_speech' ? this.hateSpeechDictionary :
      category === 'threat' ? this.threatDictionary :
      this.whitelistDictionary;
    
    words.forEach(word => dictionary.add(word.toLowerCase()));
    console.log(`[ContentModeration] Added ${words.length} custom words to ${category} dictionary`);
  }

  /**
   * Apply content moderation to fields in an object
   * Useful for moderating user input in forms
   */
  public moderateObject<T extends Record<string, any>>(
    obj: T, 
    fieldsToCheck: (keyof T)[], 
    options: ContentModerationOptions = {}
  ): { isSafe: boolean; moderatedObject: T; results: Record<keyof T, ContentDetectionResult> } {
    const results: Record<string, ContentDetectionResult> = {};
    let isSafe = true;
    const moderatedObject = { ...obj };
    
    for (const field of fieldsToCheck) {
      if (typeof obj[field] === 'string') {
        const result = this.detectHarmfulContent(obj[field] as string, options);
        results[field as string] = result;
        
        if (!result.isClean) {
          isSafe = false;
          if (options.replaceChars) {
            (moderatedObject[field] as string) = result.filteredText || (obj[field] as string);
          }
        }
      }
    }
    
    return {
      isSafe,
      moderatedObject,
      results: results as Record<keyof T, ContentDetectionResult>,
    };
  }
}

// Export singleton instance
export const contentModeration = ContentModerationService.getInstance();
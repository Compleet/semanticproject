// Semantic Addressing System Implementation
// This provides the foundation for robust knowledge linking at scale

class SemanticAddressSystem {
  constructor() {
    this.index = new Map(); // sem:// URI → {file, type, title, content}
    this.reverseIndex = new Map(); // file → sem:// URI
    this.vaultName = 'vault'; // configurable
  }

  // Generate semantic URI from title and type
  generate(title, type = 'note') {
    const slug = this.createSlug(title);
    return `sem://${this.vaultName}/${type}/${slug}`;
  }

  // Create URL-safe slug from title
  createSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-')         // Spaces to hyphens
      .replace(/-+/g, '-')          // Collapse multiple hyphens
      .replace(/^-|-$/g, '')        // Trim hyphens
      .substring(0, 50);            // Length limit
  }

  // Normalize semantic URI to full form
  normalize(semUri) {
    if (semUri.match(/^[a-z]+:[a-z0-9-]+$/)) {
      const [type, id] = semUri.split(':');
      return `sem://vault/${type}/${id}`;
    }
    return semUri;
  }

  // Parse semantic URI into components
  parse(semUri) {
    // Try full form first
    const fullMatch = semUri.match(/^sem:\/\/([^\/]+)\/([^\/]+)\/(.+)$/);
    if (fullMatch) {
      return {
        vault: fullMatch[1],
        type: fullMatch[2],
        id: fullMatch[3],
        uri: semUri
      };
    }

    // Try short form
    const shortMatch = semUri.match(/^([a-z]+):([a-z0-9-]+)$/);
    if (shortMatch) {
      const fullUri = `sem://vault/${shortMatch[1]}/${shortMatch[2]}`;
      return {
        vault: 'vault',
        type: shortMatch[1],
        id: shortMatch[2],
        uri: fullUri
      };
    }

    return null;
  }

  // Register a semantic address for a file
  register(semUri, metadata) {
    const parsed = this.parse(semUri);
    if (!parsed) throw new Error(`Invalid semantic URI: ${semUri}`);

    // Use the normalized/full URI for storage
    const normalizedUri = parsed.uri;

    // Check for collisions
    if (this.index.has(normalizedUri)) {
      console.warn(`Semantic address collision: ${normalizedUri}`);
      return this.resolveCollision(normalizedUri, metadata);
    }

    this.index.set(normalizedUri, metadata);
    if (metadata.file) {
      this.reverseIndex.set(metadata.file, normalizedUri);
    }
    return normalizedUri;
  }

  // Resolve semantic URI to metadata
  resolve(semUri) {
    // Try direct resolution first
    let result = this.index.get(semUri);
    if (result) return result;

    // If not found and it's a short form, try converting to full form
    if (semUri.match(/^[a-z]+:[a-z0-9-]+$/)) {
      const [type, id] = semUri.split(':');
      const fullUri = `sem://vault/${type}/${id}`;
      result = this.index.get(fullUri);
      if (result) return result;
    }

    return null;
  }

  // Get semantic URI for file
  getSemanticUri(file) {
    return this.reverseIndex.get(file) || null;
  }

  // Resolve collision by appending suffix
  resolveCollision(semUri, metadata) {
    const parsed = this.parse(semUri);
    let counter = 2;
    let newUri;

    do {
      newUri = `sem://${parsed.vault}/${parsed.type}/${parsed.id}-${counter}`;
      counter++;
    } while (this.index.has(newUri) && counter < 100);

    if (counter >= 100) {
      throw new Error(`Cannot resolve collision for ${semUri}`);
    }

    return this.register(newUri, metadata);
  }

  // Extract semantic links from content
  extractSemanticLinks(content) {
    const semLinkRegex = /\[\[sem:\/\/[^\]]+\]\]/g;
    const matches = content.match(semLinkRegex) || [];
    return matches.map(match => {
      const uri = match.slice(2, -2); // Remove [[ ]]
      return {
        uri,
        text: match,
        parsed: this.parse(uri)
      };
    });
  }

  // Validate all semantic links in content
  validateLinks(content) {
    const links = this.extractSemanticLinks(content);
    const results = [];

    for (const link of links) {
      const metadata = this.resolve(link.uri);
      results.push({
        ...link,
        valid: !!metadata,
        target: metadata
      });
    }

    return results;
  }

  // Generate ontology-based semantic addresses
  generateOntologyAddress(title, ontologyType) {
    const typeMap = {
      'Person': 'person',
      'Concept': 'concept',
      'Project': 'project',
      'Task': 'task',
      'Meeting': 'meeting',
      'Research': 'research',
      'Goal': 'goal'
    };

    const type = typeMap[ontologyType] || 'note';
    return this.generate(title, type);
  }

  // Export semantic index for backup
  exportIndex() {
    return {
      vault: this.vaultName,
      timestamp: new Date().toISOString(),
      index: Object.fromEntries(this.index),
      reverseIndex: Object.fromEntries(this.reverseIndex),
      stats: {
        totalAddresses: this.index.size,
        types: this.getTypeStats()
      }
    };
  }

  // Get statistics by type
  getTypeStats() {
    const stats = {};
    for (const [uri, metadata] of this.index) {
      const parsed = this.parse(uri);
      if (parsed) {
        stats[parsed.type] = (stats[parsed.type] || 0) + 1;
      }
    }
    return stats;
  }

  // Clear all semantic addresses and indexes
  clear() {
    this.index.clear();
    this.reverseIndex.clear();
    console.log('🧹 Semantic system cleared');
  }

  // Find related semantic addresses with pathfinding weights
  findRelated(semUri, limit = 5, context = {}) {
    const target = this.resolve(semUri);
    if (!target) return [];

    const candidates = [];

    // Find by backlinks (directional relationships)
    for (const [uri, metadata] of this.index) {
      if (uri === semUri) continue;

      const links = this.extractSemanticLinks(metadata.content || '');
      if (links.some(link => link.uri === semUri)) {
        candidates.push({
          uri,
          metadata,
          reason: 'backlink',
          score: 10,
          pathfindingWeight: {
            semantic_similarity: 0.9,
            causal_strength: 0.8,
            temporal_dependency: 0.3,
            source: 'user-explicit'
          }
        });
      }
    }

    // Find by content similarity with enhanced pathfinding metrics
    const targetWords = new Set((target.content || '').toLowerCase().split(/\W+/));

    for (const [uri, metadata] of this.index) {
      if (uri === semUri) continue;

      const contentWords = new Set((metadata.content || '').toLowerCase().split(/\W+/));
      const overlap = [...targetWords].filter(word => contentWords.has(word) && word.length > 3);

      if (overlap.length > 2) {
        // Calculate pathfinding-specific weights
        const semanticSimilarity = Math.min(overlap.length / 10, 1.0);
        const typeCompatibility = this.calculateTypeCompatibility(target, metadata);

        candidates.push({
          uri,
          metadata,
          reason: 'content-similarity',
          score: overlap.length,
          pathfindingWeight: {
            semantic_similarity: semanticSimilarity,
            causal_strength: 0.4, // Conservative for content similarity
            temporal_dependency: 0.2,
            type_compatibility: typeCompatibility,
            source: 'content-analysis'
          }
        });
      }
    }

    // Enhanced sorting with pathfinding context
    if (context.pathfindingMode) {
      return this.sortForPathfinding(candidates, context).slice(0, limit);
    }

    return candidates
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  // Calculate compatibility between semantic types for pathfinding
  calculateTypeCompatibility(source, target) {
    const typeWeights = {
      'concept-to-skill': 0.8,
      'skill-to-action': 0.9,
      'action-to-outcome': 0.9,
      'resource-to-action': 0.7,
      'goal-to-strategy': 0.8,
      'strategy-to-tactic': 0.9
    };

    const sourceType = this.parse(source.semanticUri || source.uri)?.type || 'unknown';
    const targetType = this.parse(target.semanticUri || target.uri)?.type || 'unknown';
    const relationKey = `${sourceType}-to-${targetType}`;

    return typeWeights[relationKey] || 0.5;
  }

  // Sort candidates optimized for pathfinding algorithms
  sortForPathfinding(candidates, context) {
    return candidates.sort((a, b) => {
      const aWeight = this.calculatePathfindingScore(a, context);
      const bWeight = this.calculatePathfindingScore(b, context);
      return bWeight - aWeight;
    });
  }

  // Calculate composite pathfinding score
  calculatePathfindingScore(candidate, context) {
    const weights = candidate.pathfindingWeight;
    const userContext = context.userContext || {};

    // Base semantic score
    let score = weights.semantic_similarity * 0.3;

    // Add causal strength (important for goal achievement)
    score += weights.causal_strength * 0.4;

    // Add user skill match if available
    if (userContext.skillLevel) {
      const skillMatch = this.calculateSkillMatch(candidate, userContext.skillLevel);
      score += skillMatch * 0.2;
    }

    // Add accessibility factor
    if (weights.accessibility) {
      score += weights.accessibility * 0.1;
    }

    return score;
  }

  // Calculate how well a path matches user's current skill level
  calculateSkillMatch(candidate, userSkillLevel) {
    // This would be enhanced with actual skill analysis
    // For now, return reasonable defaults based on type
    const skillRequirements = {
      'action': 0.6,
      'skill': 0.8,
      'concept': 0.3,
      'resource': 0.2
    };

    const type = this.parse(candidate.uri)?.type || 'unknown';
    const required = skillRequirements[type] || 0.5;

    // Return how well user skill matches requirement (closer to 1.0 = better match)
    return 1.0 - Math.abs(userSkillLevel - required);
  }
}

// Integration with existing PKM system
window.semanticSystem = new SemanticAddressSystem();

// Auto-assign semantic addresses to loaded notes
function assignSemanticAddresses(notes) {
  const system = window.semanticSystem;

  notes.forEach(note => {
    // Extract existing semantic ID from frontmatter or generate new
    let semUri = note.semanticId;

    if (!semUri) {
      const ontologyType = note.type || 'Note';
      semUri = system.generateOntologyAddress(note.title, ontologyType);
    }

    // Register in semantic system
    system.register(semUri, {
      file: note.file,
      title: note.title,
      content: note.content,
      type: note.type,
      created: note.created,
      modified: note.modified
    });

    // Add to note object
    note.semanticUri = semUri;
  });

  console.log('Semantic addressing initialized:', system.getTypeStats());
  return notes;
}

// Enhanced link rendering with semantic validation
function renderSemanticLinks(content) {
  const system = window.semanticSystem;
  const links = system.extractSemanticLinks(content);

  let result = content;

  links.forEach(link => {
    const metadata = system.resolve(link.uri);
    const validClass = metadata ? 'semantic-link valid' : 'semantic-link broken';
    const title = metadata ? metadata.title : 'Broken Link';

    const replacement = `<a href="#" class="${validClass}" data-semantic="${link.uri}" title="${title}">${link.text}</a>`;
    result = result.replace(link.text, replacement);
  });

  return result;
}

// Export for use in main application
if (typeof module !== 'undefined') {
  module.exports = { SemanticAddressSystem, assignSemanticAddresses, renderSemanticLinks };
}

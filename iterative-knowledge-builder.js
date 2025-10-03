/**
 * Iterative Knowledge Building System - Phase 1 Implementation
 *
 * This demonstrates the "Rough Landscape Mapping" phase where we perform
 * initial surface-level analysis and categorization of large document collections.
 *
 * Key Features:
 * - Surface-level document analysis (titles, headings, key phrases)
 * - Initial clustering using TF-IDF similarity
 * - Category suggestion engine
 * - Interactive category management
 * - Progress tracking
 */

class IterativeKnowledgeBuilder {
  constructor() {
    this.documents = [];
    this.categories = new Map();
    this.assignments = new Map(); // docId -> {categoryId, confidence}
    this.userFeedback = [];
    this.progressMetrics = {
      totalDocs: 0,
      categorized: 0,
      validated: 0,
      phase: 1
    };
  }

  /**
   * Phase 1: Rough Landscape Mapping
   */
  async phase1_roughMapping(documents) {
    console.log('🗺️ Starting Phase 1: Rough Landscape Mapping');

    this.documents = documents;
    this.progressMetrics.totalDocs = documents.length;

    // Step 1: Surface-level analysis
    const analyses = await this.surfaceLevelAnalysis(documents);

    // Step 2: Initial clustering
    const clusters = await this.initialClustering(analyses);

    // Step 3: Generate category suggestions
    const suggestedCategories = await this.generateCategoryLabels(clusters);

    // Step 4: Create initial assignments
    this.createInitialAssignments(clusters, suggestedCategories);

    // Step 5: Update progress
    this.updateProgress();

    return {
      categories: Array.from(this.categories.values()),
      assignments: Array.from(this.assignments.entries()),
      progress: this.progressMetrics
    };
  }

  /**
   * Extract surface-level features from documents
   */
  async surfaceLevelAnalysis(documents) {
    console.log('📊 Analyzing surface-level features...');

    const analyses = documents.map(doc => {
      const analysis = {
        id: doc.id || this.generateId(doc.path),
        path: doc.path,
        title: this.extractTitle(doc.content),
        headings: this.extractHeadings(doc.content),
        keyPhrases: this.extractKeyPhrases(doc.content),
        metadata: this.extractMetadata(doc.content),
        wordCount: this.countWords(doc.content),
        tfIdfVector: this.computeTfIdf(doc.content)
      };

      return analysis;
    });

    console.log('✅ Analyzed', analyses.length, 'documents');
    return analyses;
  }

  /**
   * Perform initial clustering based on similarity
   */
  async initialClustering(analyses) {
    console.log('🔗 Performing initial clustering...');

    if (!analyses || analyses.length === 0) {
      console.log('⚠️ No analyses provided for clustering');
      return [];
    }

    // Simple k-means clustering based on TF-IDF vectors
    const numClusters = Math.max(2, Math.min(5, Math.floor(analyses.length / 2)));
    console.log(`📊 Clustering ${analyses.length} documents into ${numClusters} clusters`);

    const clusters = this.kMeansClustering(analyses, numClusters);
    console.log(`✅ Created ${clusters.length} clusters`);

    return clusters;
  }

  /**
   * Generate human-readable category labels for clusters
   */
  async generateCategoryLabels(clusters) {
    console.log('🏷️ Generating category labels...');

    return clusters.map((cluster, index) => {
      const topTerms = this.extractTopTermsFromCluster(cluster);
      const suggestedLabel = this.generateLabelFromTerms(topTerms);

      return {
        id: `category-${index}`,
        label: suggestedLabel,
        confidence: this.calculateLabelConfidence(topTerms),
        size: cluster.length,
        topTerms: topTerms.slice(0, 5),
        documents: cluster.map(doc => doc.id)
      };
    });
  }

  /**
   * Create initial document-to-category assignments
   */
  createInitialAssignments(clusters, categories) {
    console.log('📝 Creating initial assignments...');

    clusters.forEach((cluster, clusterIndex) => {
      const category = categories[clusterIndex];

      cluster.forEach(doc => {
        const confidence = this.calculateAssignmentConfidence(doc, cluster);

        this.assignments.set(doc.id, {
          categoryId: category.id,
          confidence: confidence,
          reasoning: this.generateReasoning(doc, category),
          needsReview: confidence < 0.7,
          timestamp: new Date().toISOString()
        });
      });
    });

    // Store categories
    categories.forEach(cat => {
      this.categories.set(cat.id, cat);
    });
  }

  /**
   * Helper methods for analysis
   */
  extractTitle(content) {
    // Extract title from markdown frontmatter or first heading
    const frontmatterMatch = content.match(/^---\s*\n.*?title:\s*['"]?(.+?)['"]?\s*\n.*?---/s);
    if (frontmatterMatch) return frontmatterMatch[1];

    const headingMatch = content.match(/^#\s+(.+)$/m);
    if (headingMatch) return headingMatch[1];

    // Fallback to filename
    return 'Untitled Document';
  }

  extractHeadings(content) {
    const headings = [];
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: match[1].length,
        text: match[2].trim()
      });
    }

    return headings;
  }

  extractKeyPhrases(content) {
    // Simple key phrase extraction using TF-IDF-like scoring
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !this.isStopWord(word));

    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // Get top words by frequency
    return Object.entries(wordFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word, freq]) => ({ word, frequency: freq }));
  }

  extractMetadata(content) {
    const metadata = {};

    // Extract YAML frontmatter
    const frontmatterMatch = content.match(/^---\s*\n(.*?)\n---/s);
    if (frontmatterMatch) {
      try {
        // Simple YAML parsing for key: value pairs
        const yamlLines = frontmatterMatch[1].split('\n');
        yamlLines.forEach(line => {
          const match = line.match(/^\s*(\w+):\s*(.+)$/);
          if (match) {
            metadata[match[1]] = match[2].replace(/['"`]/g, '');
          }
        });
      } catch (e) {
        console.warn('Failed to parse frontmatter:', e);
      }
    }

    return metadata;
  }

  countWords(content) {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  }

  computeTfIdf(content) {
    // Simplified TF-IDF computation
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.isStopWord(word));

    const wordFreq = {};
    words.forEach(word => {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    });

    // Normalize by document length
    const maxFreq = Math.max(...Object.values(wordFreq));
    const normalizedFreq = {};

    Object.entries(wordFreq).forEach(([word, freq]) => {
      normalizedFreq[word] = freq / maxFreq;
    });

    return normalizedFreq;
  }

  /**
   * Simple k-means clustering implementation
   */
  kMeansClustering(documents, k) {
    // Initialize random centroids
    const centroids = this.initializeRandomCentroids(documents, k);
    let clusters = [];
    let converged = false;
    let iterations = 0;
    const maxIterations = 50;

    while (!converged && iterations < maxIterations) {
      // Assign documents to nearest centroid
      clusters = this.assignToClusters(documents, centroids);

      // Update centroids
      const newCentroids = this.updateCentroids(clusters);

      // Check convergence
      converged = this.centroidsConverged(centroids, newCentroids);
      centroids.splice(0, centroids.length, ...newCentroids);

      iterations++;
    }

    console.log(`Clustering converged after ${iterations} iterations`);
    return clusters;
  }

  initializeRandomCentroids(documents, k) {
    const centroids = [];
    const allWords = new Set();

    // Collect all unique words
    documents.forEach(doc => {
      Object.keys(doc.tfIdfVector).forEach(word => allWords.add(word));
    });

    const wordList = Array.from(allWords);

    // Create random centroids
    for (let i = 0; i < k; i++) {
      const centroid = {};
      // Randomly select some words for this centroid
      const numWords = Math.min(20, wordList.length);
      for (let j = 0; j < numWords; j++) {
        const word = wordList[Math.floor(Math.random() * wordList.length)];
        centroid[word] = Math.random();
      }
      centroids.push(centroid);
    }

    return centroids;
  }

  assignToClusters(documents, centroids) {
    const clusters = centroids.map(() => []);

    documents.forEach(doc => {
      let minDistance = Infinity;
      let closestCluster = 0;

      centroids.forEach((centroid, index) => {
        const distance = this.cosineSimilarity(doc.tfIdfVector, centroid);
        if (distance < minDistance) {
          minDistance = distance;
          closestCluster = index;
        }
      });

      clusters[closestCluster].push(doc);
    });

    return clusters;
  }

  updateCentroids(clusters) {
    return clusters.map(cluster => {
      if (cluster.length === 0) return {};

      const centroid = {};
      const allWords = new Set();

      // Collect all words in cluster
      cluster.forEach(doc => {
        Object.keys(doc.tfIdfVector).forEach(word => allWords.add(word));
      });

      // Average word frequencies
      allWords.forEach(word => {
        const sum = cluster.reduce((acc, doc) => acc + (doc.tfIdfVector[word] || 0), 0);
        centroid[word] = sum / cluster.length;
      });

      return centroid;
    });
  }

  centroidsConverged(oldCentroids, newCentroids, threshold = 0.01) {
    if (oldCentroids.length !== newCentroids.length) return false;

    for (let i = 0; i < oldCentroids.length; i++) {
      const similarity = this.cosineSimilarity(oldCentroids[i], newCentroids[i]);
      if (similarity < 1 - threshold) return false;
    }

    return true;
  }

  cosineSimilarity(vecA, vecB) {
    const allKeys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    allKeys.forEach(key => {
      const a = vecA[key] || 0;
      const b = vecB[key] || 0;
      dotProduct += a * b;
      normA += a * a;
      normB += b * b;
    });

    if (normA === 0 || normB === 0) return 0;
    return 1 - (dotProduct / (Math.sqrt(normA) * Math.sqrt(normB)));
  }

  /**
   * Category label generation
   */
  extractTopTermsFromCluster(cluster) {
    const termFreq = {};

    cluster.forEach(doc => {
      // Weight terms from titles and headings more heavily
      const titleWords = doc.title.toLowerCase().split(/\s+/);
      const headingWords = doc.headings.flatMap(h => h.text.toLowerCase().split(/\s+/));

      [...titleWords, ...headingWords].forEach(word => {
        if (word.length > 2 && !this.isStopWord(word)) {
          termFreq[word] = (termFreq[word] || 0) + 3; // Higher weight
        }
      });

      // Add key phrases with medium weight
      doc.keyPhrases.forEach(phrase => {
        termFreq[phrase.word] = (termFreq[phrase.word] || 0) + 2;
      });
    });

    return Object.entries(termFreq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([term, freq]) => ({ term, frequency: freq }));
  }

  generateLabelFromTerms(topTerms) {
    if (topTerms.length === 0) return 'Miscellaneous';

    // Try to create a meaningful label from top terms
    const primaryTerm = topTerms[0].term;
    const secondaryTerms = topTerms.slice(1, 3).map(t => t.term);

    // Capitalize and create label
    const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

    if (secondaryTerms.length > 0) {
      return `${capitalize(primaryTerm)} & ${secondaryTerms.map(capitalize).join(', ')}`;
    }

    return capitalize(primaryTerm);
  }

  calculateLabelConfidence(topTerms) {
    if (topTerms.length === 0) return 0;

    // Higher confidence if top terms have clear frequency separation
    const topFreq = topTerms[0].frequency;
    const avgFreq = topTerms.reduce((sum, t) => sum + t.frequency, 0) / topTerms.length;

    return Math.min(1, topFreq / (avgFreq * 2));
  }

  calculateAssignmentConfidence(doc, cluster) {
    // Calculate confidence based on how well document fits in cluster
    const clusterCentroid = this.calculateClusterCentroid(cluster);
    const similarity = 1 - this.cosineSimilarity(doc.tfIdfVector, clusterCentroid);

    return Math.max(0, Math.min(1, similarity));
  }

  calculateClusterCentroid(cluster) {
    const centroid = {};
    const allWords = new Set();

    cluster.forEach(doc => {
      Object.keys(doc.tfIdfVector).forEach(word => allWords.add(word));
    });

    allWords.forEach(word => {
      const sum = cluster.reduce((acc, doc) => acc + (doc.tfIdfVector[word] || 0), 0);
      centroid[word] = sum / cluster.length;
    });

    return centroid;
  }

  generateReasoning(doc, category) {
    return `Assigned to "${category.label}" based on similarity to ${category.topTerms.slice(0, 3).map(t => t.term).join(', ')}`;
  }

  /**
   * User feedback and interaction methods
   */
  async acceptCategoryAssignment(docId, categoryId) {
    const assignment = this.assignments.get(docId);
    if (assignment) {
      assignment.userValidated = true;
      assignment.validatedAt = new Date().toISOString();
      this.userFeedback.push({
        type: 'accept',
        docId,
        categoryId,
        timestamp: new Date().toISOString()
      });
      this.updateProgress();
    }
  }

  async rejectCategoryAssignment(docId, newCategoryId, reason) {
    const assignment = this.assignments.get(docId);
    if (assignment) {
      const oldCategoryId = assignment.categoryId;
      assignment.categoryId = newCategoryId;
      assignment.userValidated = true;
      assignment.validatedAt = new Date().toISOString();
      assignment.userCorrected = true;

      this.userFeedback.push({
        type: 'reject',
        docId,
        oldCategoryId,
        newCategoryId,
        reason,
        timestamp: new Date().toISOString()
      });

      this.updateProgress();
    }
  }

  async createNewCategory(label, description, initialDocIds = []) {
    const categoryId = `category-${Date.now()}`;
    const category = {
      id: categoryId,
      label,
      description,
      confidence: 1.0, // User-created categories have high confidence
      size: initialDocIds.length,
      userCreated: true,
      createdAt: new Date().toISOString(),
      documents: initialDocIds
    };

    this.categories.set(categoryId, category);

    // Reassign documents to new category
    initialDocIds.forEach(docId => {
      const assignment = this.assignments.get(docId);
      if (assignment) {
        assignment.categoryId = categoryId;
        assignment.userValidated = true;
        assignment.validatedAt = new Date().toISOString();
      }
    });

    this.userFeedback.push({
      type: 'create_category',
      categoryId,
      label,
      documentIds: initialDocIds,
      timestamp: new Date().toISOString()
    });

    this.updateProgress();
    return category;
  }

  /**
   * Progress tracking and metrics
   */
  updateProgress() {
    const totalAssignments = this.assignments.size;
    const validatedAssignments = Array.from(this.assignments.values())
      .filter(a => a.userValidated).length;

    this.progressMetrics = {
      ...this.progressMetrics,
      categorized: totalAssignments,
      validated: validatedAssignments,
      completionRate: totalAssignments > 0 ? (validatedAssignments / totalAssignments) : 0,
      categoriesCreated: this.categories.size,
      userFeedbackCount: this.userFeedback.length,
      lastUpdated: new Date().toISOString()
    };
  }

  getProgressReport() {
    return {
      phase: this.progressMetrics.phase,
      totalDocuments: this.progressMetrics.totalDocs,
      categorized: this.progressMetrics.categorized,
      validated: this.progressMetrics.validated,
      completionRate: Math.round(this.progressMetrics.completionRate * 100),
      categories: Array.from(this.categories.values()),
      assignments: Array.from(this.assignments.entries()),
      readyForPhase2: this.progressMetrics.completionRate > 0.8
    };
  }

  /**
   * Utility methods
   */
  isStopWord(word) {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
      'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those'
    ]);
    return stopWords.has(word.toLowerCase());
  }

  generateId(path) {
    return path.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  }

  /**
   * Export functionality for persistence
   */
  exportProgress() {
    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      phase: this.progressMetrics.phase,
      categories: Array.from(this.categories.entries()),
      assignments: Array.from(this.assignments.entries()),
      feedback: this.userFeedback,
      metrics: this.progressMetrics
    };
  }

  importProgress(exportedData) {
    if (exportedData.version !== '1.0') {
      throw new Error('Incompatible export version');
    }

    this.categories = new Map(exportedData.categories);
    this.assignments = new Map(exportedData.assignments);
    this.userFeedback = exportedData.feedback || [];
    this.progressMetrics = exportedData.metrics;
  }
}

// Example usage demonstration
async function demonstratePhase1() {
  console.log('🚀 Demonstrating Iterative Knowledge Building - Phase 1');

  // Sample documents (would be loaded from file system in real implementation)
  const sampleDocuments = [
    {
      path: './vault/01_person.md',
      content: `---
title: "Alex Chen - Personal Profile"
type: person
tags: [identity, personal]
---

# Alex Chen - Personal Profile

## Professional Background
Senior Software Engineer with focus on systems thinking and knowledge management.

## Interests
- Personal knowledge management
- Systems thinking
- Technology trends
- Career development`
    },
    {
      path: './vault/02_biography.md',
      content: `---
title: "Personal Biography Notes"
type: biography
---

# Personal Biography Notes

## Early Career
Started in web development, transitioned to systems architecture.

## Current Focus
Building tools for personal knowledge management and productivity.

## Future Goals
Developing AI-assisted knowledge systems.`
    },
    {
      path: './vault/03_career-research.md',
      content: `---
title: "Career Research Project"
type: project
status: active
---

# Career Research Project

## Objective
Research emerging roles in AI and knowledge management.

## Tasks
- [ ] Research AI/ML engineer positions
- [ ] Study knowledge graph technologies
- [ ] Network with industry professionals
- [ ] Update portfolio with relevant projects

## Timeline
Target completion: Q2 2024`
    },
    {
      path: './vault/04_family-tasks.md',
      content: `---
title: "Family Management Tasks"
type: tasks
---

# Family Management Tasks

## Household
- [ ] Plan summer vacation
- [ ] Organize family photos
- [ ] Schedule home maintenance

## Relationships
- [ ] Call parents weekly
- [ ] Plan date nights
- [ ] Organize family reunion`
    },
    {
      path: './vault/07_concept-systems-thinking.md',
      content: `---
title: "Systems Thinking Concepts"
type: concept
---

# Systems Thinking Concepts

## Core Principles
- Holistic perspective
- Interconnectedness
- Feedback loops
- Emergence

## Applications
- Organizational design
- Problem solving
- Personal development
- Technology architecture

## Related Concepts
- Complexity theory
- Network effects
- Cybernetics`
    }
  ];

  // Initialize the knowledge builder
  const kb = new IterativeKnowledgeBuilder();

  // Run Phase 1
  const result = await kb.phase1_roughMapping(sampleDocuments);

  console.log('📊 Phase 1 Results:');
  console.log('Categories discovered:', result.categories.length);
  console.log('Documents assigned:', result.assignments.length);
  console.log('Progress:', result.progress);

  // Demonstrate user interaction
  console.log('\n🤝 Simulating user feedback...');

  // Accept some assignments
  const firstAssignment = result.assignments[0];
  await kb.acceptCategoryAssignment(firstAssignment[0], firstAssignment[1].categoryId);

  // Create a new category
  await kb.createNewCategory('Personal Development', 'Documents related to personal growth and learning', [sampleDocuments[0].path]);

  // Get final progress report
  const finalReport = kb.getProgressReport();
  console.log('\n📈 Final Progress Report:');
  console.log(`Completion Rate: ${finalReport.completionRate}%`);
  console.log(`Categories: ${finalReport.categories.length}`);
  console.log(`Ready for Phase 2: ${finalReport.readyForPhase2}`);

  return kb;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IterativeKnowledgeBuilder, demonstratePhase1 };
}

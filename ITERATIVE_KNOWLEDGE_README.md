# Iterative Knowledge Building System

## Overview

The Iterative Knowledge Building System is an AI-assisted approach to organizing
and understanding large collections of documents through progressive
categorization and human-guided refinement. This system is designed to handle
hundreds of complex markdown files by working collaboratively with humans to
build personalized knowledge structures.

## Vision

Instead of overwhelming users with all documents at once or requiring manual
organization of everything upfront, this system works iteratively through four
distinct phases:

1. **Rough Landscape Mapping** - Initial surface-level analysis and
   categorization
2. **Human-Guided Refinement** - Interactive feedback and mental model capture
3. **Deep Category Analysis** - Sophisticated analysis within established
   categories
4. **Emergent Intelligence** - Advanced AI partnership for knowledge discovery

## Phase 1: Rough Landscape Mapping

### Purpose

Perform initial surface-level analysis and categorization of large document
collections to create a manageable starting point for human review.

### Features

- **Surface-level document analysis**: Extract titles, headings, key phrases,
  and basic metadata
- **Initial clustering algorithms**: Group documents by similarity using TF-IDF
  and basic embeddings
- **Category suggestion engine**: Propose meaningful category labels based on
  cluster analysis
- **Interactive category management**: Allow users to review, rename, merge, and
  split suggested categories
- **Progress tracking**: Visual indicators showing categorization progress and
  readiness for next phase

### Implementation

The core implementation is in `iterative-knowledge-builder.js` which provides:

```javascript
const kb = new IterativeKnowledgeBuilder();
const result = await kb.phase1_roughMapping(documents);
```

Key methods:

- `surfaceLevelAnalysis()` - Extract features from documents
- `initialClustering()` - Group similar documents using k-means clustering
- `generateCategoryLabels()` - Create human-readable category names
- `createInitialAssignments()` - Assign documents to categories with confidence
  scores

### Demo

Run the interactive demo at `knowledge-builder-demo.html` to see Phase 1 in
action:

1. Start local server: `python3 -m http.server 8080`
2. Open `http://localhost:8080/knowledge-builder-demo.html`
3. Click "Run Phase 1 Analysis" to see the system categorize sample documents
4. Use "Simulate User Feedback" to see how human input refines the
   categorization

## Key Benefits

### Context Window Management

- Processes documents in manageable chunks rather than overwhelming AI context
  windows
- Focuses AI attention on specific categorization tasks rather than trying to
  understand everything at once

### Human-AI Collaboration

- Leverages human expertise for high-level organizational decisions
- Uses AI for tedious analysis and pattern recognition tasks
- Creates feedback loops that improve AI understanding over time

### Progressive Complexity

- Starts with simple surface-level analysis that's easy to validate
- Gradually builds up to sophisticated semantic understanding
- Allows users to maintain control and understanding throughout the process

### Personalized Learning

- Captures user's organizational preferences and mental models
- Adapts categorization strategies based on user feedback
- Builds personalized ontologies that reflect individual thinking patterns

## Technical Architecture

### Core Components

1. **Document Analyzer**: Extracts features from markdown documents
   - Title and heading extraction
   - Key phrase identification using TF-IDF
   - Metadata parsing (YAML frontmatter)
   - Word frequency analysis

2. **Clustering Engine**: Groups similar documents
   - K-means clustering with cosine similarity
   - Automatic cluster count determination
   - Centroid-based category representation

3. **Category Generator**: Creates meaningful category labels
   - Top term extraction from clusters
   - Human-readable label generation
   - Confidence score calculation

4. **Feedback System**: Captures and learns from user input
   - Assignment acceptance/rejection
   - New category creation
   - Reasoning capture and analysis

5. **Progress Tracker**: Monitors and visualizes progress
   - Completion rate calculation
   - Phase readiness assessment
   - Export/import capabilities

### Data Structures

```javascript
// Document analysis result
{
  id: "doc-id",
  title: "Document Title",
  headings: [{level: 1, text: "Heading"}],
  keyPhrases: [{word: "term", frequency: 5}],
  metadata: {type: "project", tags: ["ai"]},
  tfIdfVector: {"word": 0.8, "another": 0.3}
}

// Category structure
{
  id: "category-1",
  label: "Research & Development",
  confidence: 0.85,
  size: 12,
  topTerms: [{term: "research", frequency: 45}],
  documents: ["doc-1", "doc-2"],
  userCreated: false
}

// Assignment with confidence
{
  categoryId: "category-1",
  confidence: 0.78,
  reasoning: "Assigned based on similarity to research, development, project",
  needsReview: false,
  userValidated: true
}
```

## Future Phases

### Phase 2: Human-Guided Refinement

- Active learning loops for uncertain categorizations
- Mental model extraction from user feedback patterns
- Personalized ontology building based on domain expertise
- Conflict resolution for multi-category documents

### Phase 3: Deep Category Analysis

- Category-specific embedding generation
- Intra-category relationship mapping
- Sub-category formation within main categories
- Knowledge gap identification and suggestion

### Phase 4: Emergent Intelligence

- Cross-category insight discovery
- Knowledge synthesis from multiple domains
- Trend analysis across entire knowledge base
- Context-aware question answering using personalized knowledge

## Integration with PKM System

The iterative knowledge building system integrates seamlessly with the existing
PKM semantic vault:

- Uses the same markdown document format
- Leverages semantic addressing system for persistent references
- Connects to the tri-column layout for ontology visualization
- Exports results to the goals system for progress tracking

## Getting Started

### Prerequisites

- Modern web browser with ES6+ support
- Local file system access (for File System Access API)
- Collection of markdown documents to analyze

### Quick Start

1. Clone or download the project files
2. Place your markdown documents in a `vault/` directory
3. Open `knowledge-builder-demo.html` in a web browser
4. Follow the guided Phase 1 analysis process
5. Review and refine the suggested categorizations
6. Export progress for backup or sharing

### Configuration

The system can be configured for different use cases:

```javascript
const config = {
  clustering: {
    maxClusters: 10,
    minClusterSize: 2,
    similarityThreshold: 0.7,
  },
  analysis: {
    maxKeyPhrases: 20,
    minWordLength: 3,
    stopWords: customStopWordList,
  },
  ui: {
    progressThreshold: 0.8, // 80% for Phase 2 readiness
    confidenceThresholds: {
      high: 0.8,
      medium: 0.6,
      low: 0.4,
    },
  },
};
```

## Contributing

This is an experimental system designed to explore AI-human collaboration in
knowledge organization. Contributions are welcome, especially:

- Improvements to clustering algorithms
- Better category label generation
- Enhanced user interface for feedback collection
- Integration with external knowledge management tools
- Performance optimizations for large document collections

## Roadmap

- [ ] Complete Phase 1 implementation and testing
- [ ] Develop Phase 2 feedback learning algorithms
- [ ] Implement Phase 3 deep analysis capabilities
- [ ] Build Phase 4 emergent intelligence features
- [ ] Create integration APIs for external tools
- [ ] Develop mobile-friendly interface
- [ ] Add collaborative features for team knowledge building

This system represents a new approach to knowledge management that respects both
human expertise and AI capabilities, creating a collaborative partnership for
organizing and understanding complex information at scale.

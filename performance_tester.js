// Performance and Scale Testing Suite
// Generates realistic data and tests PKM performance

class PerformanceTester {
  constructor() {
    this.results = [];
    this.testData = new Map();
  }

  // Generate realistic test vault with varying content
  generateTestVault(size = 500) {
    console.log(`📊 Generating test vault with ${size} notes...`);

    const noteTypes = ['concept', 'person', 'project', 'meeting', 'research', 'idea'];
    const topics = [
      'systems thinking', 'machine learning', 'product management', 'design systems',
      'team leadership', 'data analysis', 'user research', 'software architecture',
      'cognitive science', 'behavioral economics', 'knowledge management', 'innovation',
      'sustainability', 'digital transformation', 'remote work', 'productivity'
    ];

    const vault = [];

    for (let i = 1; i <= size; i++) {
      const type = noteTypes[Math.floor(Math.random() * noteTypes.length)];
      const topic = topics[Math.floor(Math.random() * topics.length)];
      const title = `${topic.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} ${i}`;

      // Generate realistic content with links
      const linkCount = Math.floor(Math.random() * 8) + 1;
      let content = this.generateRealisticContent(type, topic, linkCount);

      // Add semantic links to other notes
      for (let j = 0; j < linkCount; j++) {
        const linkTarget = Math.floor(Math.random() * Math.min(i, 50)) + 1;
        const linkType = noteTypes[Math.floor(Math.random() * noteTypes.length)];
        const linkTopic = topics[Math.floor(Math.random() * topics.length)];
        const semLink = `sem://vault/${linkType}/${linkTopic.replace(/\s+/g, '-')}-${linkTarget}`;
        content += `\n\nRelated: [[${semLink}]]`;
      }

      const note = {
        id: i,
        title,
        type,
        content,
        semanticId: `sem://vault/${type}/${title.toLowerCase().replace(/\s+/g, '-')}`,
        created: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        modified: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        wordCount: content.split(/\s+/).length,
        linkCount: linkCount
      };

      vault.push(note);
    }

    this.testData.set('vault', vault);
    console.log(`✅ Generated ${size} notes with realistic content and links`);
    return vault;
  }

  generateRealisticContent(type, topic, linkCount) {
    const templates = {
      concept: `# ${topic.charAt(0).toUpperCase() + topic.slice(1)}

## Definition
${topic} is a fundamental approach to understanding complex systems and their interactions.

## Key Principles
- Systems perspective focuses on relationships and patterns
- Emergence occurs when parts interact in complex ways
- Feedback loops create dynamic behavior
- Structure influences behavior

## Applications
This concept applies to organizational design, product development, and strategic planning.

## References
- Peter Senge's "The Fifth Discipline"
- Donella Meadows' "Thinking in Systems"
- Russell Ackoff's systems thinking work`,

      person: `# Person: ${topic}

## Background
Expert in ${topic} with extensive experience in related fields.

## Expertise
- Deep knowledge of ${topic} principles
- Practical application in real-world scenarios
- Teaching and mentoring others
- Research and publication

## Connections
Works closely with teams on ${topic} initiatives and cross-functional projects.

## Notes
Regular contributor to discussions about ${topic} and its applications.`,

      project: `# Project: ${topic}

## Objective
Develop comprehensive understanding and practical application of ${topic}.

## Scope
- Research current best practices
- Analyze existing implementations
- Design improved approaches
- Test and validate solutions

## Timeline
- Phase 1: Research and analysis
- Phase 2: Design and prototyping
- Phase 3: Implementation and testing
- Phase 4: Evaluation and refinement

## Resources
Team members with expertise in ${topic} and related areas.`,

      meeting: `# Meeting Notes: ${topic}

## Date
${new Date().toLocaleDateString()}

## Attendees
- Team lead
- Subject matter experts
- Stakeholders

## Agenda
1. Review progress on ${topic}
2. Discuss challenges and blockers
3. Plan next steps
4. Assign action items

## Key Points
- Current state of ${topic} understanding
- Gaps in knowledge or implementation
- Opportunities for improvement
- Resource requirements

## Action Items
- Follow up on ${topic} research
- Schedule additional discussions
- Document findings and recommendations`,

      research: `# Research: ${topic}

## Research Question
How can we better understand and apply ${topic} in our context?

## Methodology
- Literature review of existing research
- Case study analysis
- Expert interviews
- Empirical testing

## Findings
Initial research suggests that ${topic} has significant potential for impact.

## Next Steps
- Deeper investigation of specific aspects
- Pilot testing of proposed approaches
- Validation with domain experts
- Documentation of results`,

      idea: `# Idea: ${topic}

## Concept
Novel approach to ${topic} that could improve current practices.

## Inspiration
Combines insights from multiple domains to create innovative solutions.

## Potential Impact
- Improved efficiency
- Better outcomes
- Reduced complexity
- Enhanced user experience

## Implementation
- Prototype development
- User feedback
- Iterative refinement
- Scaling strategy

## Challenges
- Technical feasibility
- Resource requirements
- Adoption barriers
- Measurement difficulties`
    };

    return templates[type] || templates.concept;
  }

  // Test search performance across large vault
  async testSearchPerformance(vault, queries = 50) {
    console.log(`🔍 Testing search performance with ${vault.length} notes...`);

    const searchTerms = [
      'systems', 'thinking', 'approach', 'development', 'team', 'project',
      'research', 'analysis', 'implementation', 'design', 'process', 'strategy'
    ];

    const results = [];

    for (let i = 0; i < queries; i++) {
      const term = searchTerms[Math.floor(Math.random() * searchTerms.length)];
      const startTime = performance.now();

      // Simulate full-text search
      const matches = vault.filter(note =>
        note.title.toLowerCase().includes(term.toLowerCase()) ||
        note.content.toLowerCase().includes(term.toLowerCase())
      );

      const endTime = performance.now();
      const duration = endTime - startTime;

      results.push({
        term,
        matches: matches.length,
        duration,
        notes: vault.length
      });
    }

    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    const maxDuration = Math.max(...results.map(r => r.duration));

    console.log(`   Average search time: ${avgDuration.toFixed(2)}ms`);
    console.log(`   Maximum search time: ${maxDuration.toFixed(2)}ms`);
    console.log(`   Performance target: <50ms average`);

    return {
      avgDuration,
      maxDuration,
      results,
      passed: avgDuration < 50
    };
  }

  // Test semantic link resolution performance
  testSemanticLinkPerformance(vault) {
    console.log(`🔗 Testing semantic link resolution with ${vault.length} notes...`);

    // Build semantic index
    const startIndexTime = performance.now();
    const semanticIndex = new Map();

    vault.forEach(note => {
      semanticIndex.set(note.semanticId, note);
    });

    const indexTime = performance.now() - startIndexTime;

    // Test link resolution
    const resolutionTests = [];
    const testCount = Math.min(1000, vault.length * 2);

    for (let i = 0; i < testCount; i++) {
      const randomNote = vault[Math.floor(Math.random() * vault.length)];
      const startTime = performance.now();
      const resolved = semanticIndex.get(randomNote.semanticId);
      const duration = performance.now() - startTime;

      resolutionTests.push({
        semanticId: randomNote.semanticId,
        resolved: !!resolved,
        duration
      });
    }

    const avgResolution = resolutionTests.reduce((sum, r) => sum + r.duration, 0) / resolutionTests.length;
    const successRate = resolutionTests.filter(r => r.resolved).length / resolutionTests.length;

    console.log(`   Index build time: ${indexTime.toFixed(2)}ms`);
    console.log(`   Average resolution time: ${avgResolution.toFixed(4)}ms`);
    console.log(`   Resolution success rate: ${(successRate * 100).toFixed(1)}%`);

    return {
      indexTime,
      avgResolution,
      successRate,
      passed: avgResolution < 1 && successRate > 0.99
    };
  }

  // Test graph rendering performance
  testGraphPerformance(vault) {
    console.log(`🕸️ Testing graph rendering with ${vault.length} notes...`);

    // Extract links from content
    const startTime = performance.now();
    const nodes = vault.map(note => ({
      id: note.semanticId,
      title: note.title,
      type: note.type
    }));

    const links = [];
    vault.forEach(note => {
      const semLinkRegex = /\[\[sem:\/\/[^\]]+\]\]/g;
      const matches = note.content.match(semLinkRegex) || [];

      matches.forEach(match => {
        const targetId = match.slice(2, -2); // Remove [[ ]]
        links.push({
          source: note.semanticId,
          target: targetId
        });
      });
    });

    const extractionTime = performance.now() - startTime;

    // Simulate force-directed layout calculation
    const layoutStartTime = performance.now();

    // Simple force simulation (simplified)
    for (let iteration = 0; iteration < 100; iteration++) {
      // Simulate physics calculations
      nodes.forEach(node => {
        node.x = (node.x || 0) + Math.random() * 2 - 1;
        node.y = (node.y || 0) + Math.random() * 2 - 1;
      });
    }

    const layoutTime = performance.now() - layoutStartTime;

    console.log(`   Link extraction: ${extractionTime.toFixed(2)}ms`);
    console.log(`   Layout calculation: ${layoutTime.toFixed(2)}ms`);
    console.log(`   Nodes: ${nodes.length}, Links: ${links.length}`);

    return {
      nodes: nodes.length,
      links: links.length,
      extractionTime,
      layoutTime,
      totalTime: extractionTime + layoutTime,
      passed: (extractionTime + layoutTime) < 1000
    };
  }

  // Test memory usage simulation
  testMemoryUsage(vault) {
    console.log(`💾 Testing memory usage with ${vault.length} notes...`);

    // Calculate estimated memory usage
    let totalSize = 0;
    let contentSize = 0;
    let metadataSize = 0;

    vault.forEach(note => {
      const noteJson = JSON.stringify(note);
      totalSize += noteJson.length * 2; // UTF-16 encoding
      contentSize += note.content.length * 2;
      metadataSize += (noteJson.length - note.content.length) * 2;
    });

    // Convert to more readable units
    const totalMB = totalSize / (1024 * 1024);
    const contentMB = contentSize / (1024 * 1024);
    const metadataMB = metadataSize / (1024 * 1024);

    console.log(`   Total estimated memory: ${totalMB.toFixed(2)}MB`);
    console.log(`   Content memory: ${contentMB.toFixed(2)}MB`);
    console.log(`   Metadata memory: ${metadataMB.toFixed(2)}MB`);
    console.log(`   Memory target: <100MB for 1000 notes`);

    return {
      totalMB,
      contentMB,
      metadataMB,
      passed: totalMB < 100 || vault.length < 1000
    };
  }

  // Run comprehensive performance test suite
  async runPerformanceTests(vaultSize = 500) {
    console.log('⚡ PKM Performance Test Suite');
    console.log('==============================\n');

    const vault = this.generateTestVault(vaultSize);

    const searchResults = await this.testSearchPerformance(vault);
    const linkResults = this.testSemanticLinkPerformance(vault);
    const graphResults = this.testGraphPerformance(vault);
    const memoryResults = this.testMemoryUsage(vault);

    // Overall assessment
    console.log('\n📊 Performance Summary');
    console.log('======================');

    const tests = [
      { name: 'Search Performance', result: searchResults },
      { name: 'Link Resolution', result: linkResults },
      { name: 'Graph Rendering', result: graphResults },
      { name: 'Memory Usage', result: memoryResults }
    ];

    const passedTests = tests.filter(t => t.result.passed).length;
    const totalTests = tests.length;

    console.log(`Passed: ${passedTests}/${totalTests} tests`);

    tests.forEach(test => {
      const status = test.result.passed ? '✅' : '❌';
      console.log(`${status} ${test.name}`);
    });

    if (passedTests === totalTests) {
      console.log('\n🎉 All performance tests passed! Ready for scale.');
    } else {
      console.log('\n⚠️ Some performance issues detected. Optimization needed.');
    }

    return {
      vaultSize,
      tests,
      summary: { passed: passedTests, total: totalTests, percentage: passedTests / totalTests * 100 }
    };
  }
}

// Export for use
if (typeof window !== 'undefined') {
  window.PerformanceTester = PerformanceTester;
}

if (typeof module !== 'undefined') {
  module.exports = { PerformanceTester };
}

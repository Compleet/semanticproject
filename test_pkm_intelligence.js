const puppeteer = require('puppeteer');
const fs = require('fs');

/**
 * Comprehensive PKM Intelligence Test
 * Tests how well the system understands and processes user content
 */

class PKMIntelligenceTest {
  constructor() {
    this.baseUrl = 'http://localhost:8000';
    this.testResults = {
      contentProcessing: {},
      semanticUnderstanding: {},
      userExperience: {},
      dataReflection: {},
      overall: {}
    };
  }

  async runAllTests() {
    console.log('🧠 PKM INTELLIGENCE & USABILITY TEST');
    console.log('=====================================\n');

    const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: { width: 1400, height: 900 }
    });
    const page = await browser.newPage();

    try {
      // Test 1: Content Loading Intelligence
      await this.testContentLoading(page);

      // Test 2: Semantic Understanding
      await this.testSemanticProcessing(page);

      // Test 3: User Goal Extraction
      await this.testGoalIntelligence(page);

      // Test 4: Knowledge Graph Intelligence
      await this.testGraphIntelligence(page);

      // Test 5: Search Intelligence
      await this.testSearchIntelligence(page);

      // Test 6: User Experience Intelligence
      await this.testUserExperience(page);

      // Test 7: Data Reflection Accuracy
      await this.testDataReflection(page);

      // Generate comprehensive report
      this.generateIntelligenceReport();

    } catch (error) {
      console.error('❌ Test failed:', error);
    } finally {
      await browser.close();
    }
  }

  async testContentLoading(page) {
    console.log('📁 Testing Content Loading Intelligence...');
    await page.goto(this.baseUrl);
    await page.waitForSelector('#loadStatus', { timeout: 10000 });

    // Test vault detection
    const userSelector = await page.$('#userSelect');
    const options = await userSelector.$$eval('option', els =>
      els.map(el => ({ value: el.value, text: el.textContent }))
    );

    this.testResults.contentProcessing.vaultDetection = {
      detected: options.length > 1,
      vaults: options.filter(o => o.value),
      score: options.length >= 2 ? 10 : 5
    };

    console.log(`  ✅ Vault Detection: ${options.length} vaults found`);

    // Test file processing
    await page.waitForFunction(() => {
      const status = document.getElementById('loadStatus');
      return status && status.textContent.includes('vault loaded');
    }, { timeout: 15000 });

    const statusText = await page.$eval('#loadStatus', el => el.textContent);
    const notesCount = parseInt(statusText.match(/(\d+) notes/)?.[1] || '0');

    this.testResults.contentProcessing.fileProcessing = {
      notesLoaded: notesCount,
      success: notesCount > 0,
      score: notesCount > 5 ? 10 : notesCount > 0 ? 5 : 0
    };

    console.log(`  ✅ File Processing: ${notesCount} notes loaded`);
  }

  async testSemanticProcessing(page) {
    console.log('🧠 Testing Semantic Understanding...');

    // Test semantic ID generation
    const semanticIds = await page.evaluate(() => {
      return window.notes ? window.notes.map(n => ({ name: n.name, sem: n.sem })) : [];
    });

    const validSemIds = semanticIds.filter(n => n.sem && n.sem.includes(':'));

    this.testResults.semanticUnderstanding.semanticIds = {
      total: semanticIds.length,
      valid: validSemIds.length,
      percentage: semanticIds.length ? (validSemIds.length / semanticIds.length) * 100 : 0,
      score: validSemIds.length === semanticIds.length ? 10 : validSemIds.length > 0 ? 7 : 0
    };

    console.log(`  ✅ Semantic IDs: ${validSemIds.length}/${semanticIds.length} valid`);

    // Test entity extraction
    const entities = await page.evaluate(() => {
      return {
        people: window.graph?.nodes?.filter(n => n.id.startsWith('person:'))?.length || 0,
        projects: window.graph?.nodes?.filter(n => n.id.startsWith('project:'))?.length || 0,
        concepts: window.graph?.nodes?.filter(n => n.id.startsWith('concept:'))?.length || 0,
        tasks: window.graph?.nodes?.filter(n => n.id.startsWith('task:'))?.length || 0
      };
    });

    this.testResults.semanticUnderstanding.entityExtraction = {
      entities,
      total: Object.values(entities).reduce((a, b) => a + b, 0),
      score: Object.values(entities).reduce((a, b) => a + b, 0) > 10 ? 10 : 5
    };

    console.log(`  ✅ Entity Extraction: ${JSON.stringify(entities)}`);
  }

  async testGoalIntelligence(page) {
    console.log('🎯 Testing Goal Intelligence...');

    // Switch to Margaret's vault
    await page.select('#userSelect', './vault2/');
    await page.waitForTimeout(3000);

    // Check if goals are extracted and displayed
    const goalsPanel = await page.$('#goalsPanel, .goals-section, [class*="goal"]');
    const hasGoalsPanel = !!goalsPanel;

    // Test goal extraction from user documents
    const extractedGoals = await page.evaluate(() => {
      // Check if user goals are detected and parsed
      if (typeof getUserGoals === 'function') {
        return getUserGoals();
      }
      return [];
    });

    this.testResults.semanticUnderstanding.goalExtraction = {
      panelExists: hasGoalsPanel,
      goalsExtracted: Array.isArray(extractedGoals) ? extractedGoals.length : 0,
      score: hasGoalsPanel && extractedGoals.length > 0 ? 10 : hasGoalsPanel ? 5 : 0
    };

    console.log(`  ✅ Goal Extraction: ${extractedGoals.length} goals found`);
  }

  async testGraphIntelligence(page) {
    console.log('🕸️ Testing Knowledge Graph Intelligence...');

    // Open graph view
    await page.click('#openGraph');
    await page.waitForSelector('#graphModal', { timeout: 5000 });

    // Test graph data quality
    const graphData = await page.evaluate(() => {
      return {
        nodes: window.graph?.nodes?.length || 0,
        edges: window.graph?.edges?.length || 0,
        nodeTypes: window.graph?.nodes?.reduce((acc, node) => {
          const type = node.id.split(':')[0];
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {}) || {}
      };
    });

    this.testResults.semanticUnderstanding.graphIntelligence = {
      ...graphData,
      connectivity: graphData.edges / Math.max(graphData.nodes, 1),
      score: graphData.nodes > 5 && graphData.edges > 3 ? 10 : 5
    };

    console.log(`  ✅ Graph: ${graphData.nodes} nodes, ${graphData.edges} edges`);

    // Close graph modal
    await page.click('#graphModal .close, [onclick*="close"]').catch(() => { });
  }

  async testSearchIntelligence(page) {
    console.log('🔍 Testing Search Intelligence...');

    const searchInput = await page.$('#search');
    if (searchInput) {
      // Test semantic search
      await page.type('#search', 'sewing');
      await page.waitForTimeout(1000);

      const results = await page.evaluate(() => {
        const resultElements = document.querySelectorAll('.search-result, .note-card, [class*="result"]');
        return Array.from(resultElements).map(el => el.textContent);
      });

      this.testResults.userExperience.searchIntelligence = {
        query: 'sewing',
        resultsFound: results.length,
        relevant: results.filter(r => r.toLowerCase().includes('sewing')).length,
        score: results.length > 0 ? 8 : 0
      };

      console.log(`  ✅ Search: "${results.length}" results for "sewing"`);

      // Clear search
      await page.evaluate(() => document.getElementById('search').value = '');
    }
  }

  async testUserExperience(page) {
    console.log('👤 Testing User Experience Intelligence...');

    // Test layout responsiveness
    const layoutTest = await page.evaluate(() => {
      const layout = document.querySelector('.new-layout');
      const columns = layout ? layout.children.length : 0;
      const isMobile = window.innerWidth < 768;

      return {
        hasLayout: !!layout,
        columns,
        responsive: !isMobile || columns <= 1
      };
    });

    // Test user-specific content
    const userContent = await page.evaluate(() => {
      const personInfo = document.querySelector('[class*="person"], .persona-panel');
      const tasksPanel = document.querySelector('[class*="task"]');
      const projectsPanel = document.querySelector('[class*="project"]');

      return {
        hasPersonInfo: !!personInfo,
        hasTasks: !!tasksPanel,
        hasProjects: !!projectsPanel,
        personalizedContent: !!(personInfo && tasksPanel && projectsPanel)
      };
    });

    this.testResults.userExperience = {
      layout: layoutTest,
      personalization: userContent,
      score: (layoutTest.hasLayout ? 5 : 0) + (userContent.personalizedContent ? 5 : 0)
    };

    console.log(`  ✅ Layout: ${layoutTest.columns} columns, Personalized: ${userContent.personalizedContent}`);
  }

  async testDataReflection(page) {
    console.log('📊 Testing Data Reflection Accuracy...');

    // Test if the interface accurately reflects the loaded content
    const accuracyTest = await page.evaluate(() => {
      const stats = {
        notesInMemory: window.notes?.length || 0,
        notesDisplayed: document.querySelectorAll('.note-card, .note-item').length,
        tasksInMemory: window.notes?.flatMap(n => n.tasks || []).length || 0,
        tasksDisplayed: document.querySelectorAll('[class*="task-item"], .task').length,
        projectsInMemory: window.projects?.length || 0,
        projectsDisplayed: document.querySelectorAll('.project-card, .project-item').length
      };

      return {
        ...stats,
        notesAccuracy: stats.notesDisplayed > 0 ? (stats.notesDisplayed / stats.notesInMemory) : 0,
        tasksAccuracy: stats.tasksDisplayed > 0 ? (stats.tasksDisplayed / stats.tasksInMemory) : 0,
        projectsAccuracy: stats.projectsDisplayed > 0 ? (stats.projectsDisplayed / stats.projectsInMemory) : 0
      };
    });

    this.testResults.dataReflection = {
      ...accuracyTest,
      overallAccuracy: (accuracyTest.notesAccuracy + accuracyTest.tasksAccuracy + accuracyTest.projectsAccuracy) / 3,
      score: accuracyTest.notesAccuracy > 0.5 ? 8 : accuracyTest.notesAccuracy > 0 ? 4 : 0
    };

    console.log(`  ✅ Data Reflection: Notes ${accuracyTest.notesAccuracy.toFixed(2)}, Tasks ${accuracyTest.tasksAccuracy.toFixed(2)}`);
  }

  generateIntelligenceReport() {
    console.log('\n📋 PKM INTELLIGENCE REPORT');
    console.log('==========================\n');

    const totalScore = Object.values(this.testResults).reduce((sum, category) => {
      return sum + (category.score || 0);
    }, 0);
    const maxScore = 80; // Maximum possible score

    const grade = this.getGrade(totalScore, maxScore);

    console.log(`🎯 OVERALL INTELLIGENCE: ${grade} (${totalScore}/${maxScore})`);
    console.log(`📊 INTELLIGENCE PERCENTAGE: ${((totalScore / maxScore) * 100).toFixed(1)}%\n`);

    // Detailed breakdown
    console.log('📈 CATEGORY BREAKDOWN:');
    console.log('=====================');

    Object.entries(this.testResults).forEach(([category, results]) => {
      const score = results.score || 0;
      const maxCategoryScore = 10;
      const percentage = (score / maxCategoryScore) * 100;
      console.log(`${category.toUpperCase().padEnd(20)} ${score}/10 (${percentage.toFixed(0)}%)`);
    });

    console.log('\n🔍 DETAILED ANALYSIS:');
    console.log('====================');
    console.log(JSON.stringify(this.testResults, null, 2));

    // Generate recommendations
    this.generateRecommendations(totalScore, maxScore);

    // Save results
    fs.writeFileSync('./test-results/pkm-intelligence-report.json', JSON.stringify({
      timestamp: new Date().toISOString(),
      score: totalScore,
      maxScore,
      grade,
      percentage: (totalScore / maxScore) * 100,
      results: this.testResults
    }, null, 2));

    console.log('\n💾 Report saved to test-results/pkm-intelligence-report.json');
  }

  getGrade(score, maxScore) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'A+ (Exceptional)';
    if (percentage >= 80) return 'A (Excellent)';
    if (percentage >= 70) return 'B+ (Very Good)';
    if (percentage >= 60) return 'B (Good)';
    if (percentage >= 50) return 'C+ (Fair)';
    if (percentage >= 40) return 'C (Needs Improvement)';
    return 'D (Significant Issues)';
  }

  generateRecommendations(score, maxScore) {
    console.log('\n💡 INTELLIGENCE IMPROVEMENT RECOMMENDATIONS:');
    console.log('===========================================');

    const percentage = (score / maxScore) * 100;

    if (percentage < 50) {
      console.log('🚨 CRITICAL: System needs major intelligence improvements');
      console.log('  - Implement proper content processing and display');
      console.log('  - Add semantic understanding capabilities');
      console.log('  - Improve user goal extraction and presentation');
    } else if (percentage < 70) {
      console.log('⚠️  MODERATE: System shows basic intelligence but needs enhancement');
      console.log('  - Improve search and discovery features');
      console.log('  - Enhance knowledge graph connectivity');
      console.log('  - Better user personalization');
    } else if (percentage < 85) {
      console.log('✅ GOOD: System demonstrates solid intelligence with room for optimization');
      console.log('  - Fine-tune semantic processing');
      console.log('  - Enhance advanced features');
      console.log('  - Improve performance and responsiveness');
    } else {
      console.log('🏆 EXCELLENT: System demonstrates high intelligence');
      console.log('  - Focus on edge cases and advanced features');
      console.log('  - Optimize for scale and performance');
      console.log('  - Add innovative AI-powered features');
    }

    // Specific recommendations based on test results
    Object.entries(this.testResults).forEach(([category, results]) => {
      if (results.score < 7) {
        console.log(`\n🔧 ${category.toUpperCase()} NEEDS ATTENTION:`);
        this.getCategoryRecommendations(category, results);
      }
    });
  }

  getCategoryRecommendations(category, results) {
    switch (category) {
      case 'contentProcessing':
        console.log('  - Implement robust file parsing and content extraction');
        console.log('  - Add error handling for malformed documents');
        console.log('  - Improve manifest-based loading system');
        break;
      case 'semanticUnderstanding':
        console.log('  - Enhance semantic ID generation algorithms');
        console.log('  - Improve entity recognition and extraction');
        console.log('  - Add more sophisticated content analysis');
        break;
      case 'userExperience':
        console.log('  - Improve layout responsiveness and design');
        console.log('  - Add better user guidance and onboarding');
        console.log('  - Enhance search and navigation features');
        break;
      case 'dataReflection':
        console.log('  - Ensure UI accurately reflects loaded data');
        console.log('  - Add real-time updates and synchronization');
        console.log('  - Improve data consistency across components');
        break;
    }
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  const test = new PKMIntelligenceTest();
  test.runAllTests().catch(console.error);
}

module.exports = PKMIntelligenceTest;

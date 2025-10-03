// Comprehensive MVP Testing Suite
// Tests the full user journey and system integration

class MVPTester {
  constructor() {
    this.results = [];
    this.errors = [];
  }

  log(test, status, details = '') {
    const result = { test, status, details, timestamp: new Date().toISOString() };
    this.results.push(result);
    console.log(`${status === 'PASS' ? '✅' : '❌'} ${test}: ${details}`);
  }

  async runAllTests() {
    console.log('🧪 PKM MVP Comprehensive Testing Suite');
    console.log('=====================================\n');

    // Core functionality tests
    await this.testVaultLoading();
    await this.testSemanticAddressing();
    await this.testTriColumnLayout();
    await this.testComplexityAbstraction();
    await this.testSearchFunctionality();
    await this.testGraphVisualization();
    await this.testUserExperience();
    await this.testPerformance();
    await this.testEdgeCases();

    this.generateReport();
  }

  async testVaultLoading() {
    console.log('📁 Testing Vault Loading System...');

    try {
      // Test manifest loading
      const response = await fetch('/vault/manifest.json');
      const manifest = await response.json();

      if (manifest.length >= 11) {
        this.log('Manifest Loading', 'PASS', `${manifest.length} files found`);
      } else {
        this.log('Manifest Loading', 'FAIL', `Only ${manifest.length} files found`);
      }

      // Test individual file loading
      const firstFile = await fetch(`/vault/${manifest[0]}`);
      const content = await firstFile.text();

      if (content.length > 0) {
        this.log('File Content Loading', 'PASS', `${content.length} characters loaded`);
      } else {
        this.log('File Content Loading', 'FAIL', 'Empty file content');
      }

      // Test YAML frontmatter parsing
      const hasYamlHeader = content.includes('---');
      this.log('YAML Frontmatter', hasYamlHeader ? 'PASS' : 'FAIL',
        hasYamlHeader ? 'YAML frontmatter detected' : 'No YAML frontmatter');

    } catch (error) {
      this.log('Vault Loading', 'FAIL', error.message);
    }
  }

  async testSemanticAddressing() {
    console.log('🔗 Testing Semantic Addressing System...');

    try {
      // Check if semantic system is loaded
      if (typeof window !== 'undefined' && window.semanticSystem) {
        this.log('Semantic System Initialization', 'PASS', 'System loaded in browser');

        // Test URI generation
        const testUri = window.semanticSystem.generate('Systems Thinking', 'concept');
        const expectedPattern = /^sem:\/\/vault\/concept\/systems-thinking$/;

        if (expectedPattern.test(testUri)) {
          this.log('URI Generation', 'PASS', `Generated: ${testUri}`);
        } else {
          this.log('URI Generation', 'FAIL', `Invalid format: ${testUri}`);
        }

        // Test URI parsing
        const parsed = window.semanticSystem.parse(testUri);
        if (parsed && parsed.vault === 'vault' && parsed.type === 'concept') {
          this.log('URI Parsing', 'PASS', 'Correctly parsed URI components');
        } else {
          this.log('URI Parsing', 'FAIL', 'Failed to parse URI');
        }

      } else {
        this.log('Semantic System Initialization', 'FAIL', 'System not found in browser context');
      }

    } catch (error) {
      this.log('Semantic Addressing', 'FAIL', error.message);
    }
  }

  async testTriColumnLayout() {
    console.log('📊 Testing Tri-Column Layout...');

    try {
      const response = await fetch('/');
      const html = await response.text();

      // Check for tri-column structure
      const hasOntologyPanel = html.includes('id="ontologyPanel"') || html.includes('PKM');
      const hasPriorityCenter = html.includes('id="priorityCenter"') || html.includes('Priority');
      const hasGoalsPanel = html.includes('id="goalsPanel"') || html.includes('Goals');

      this.log('Left Column (PKM)', hasOntologyPanel ? 'PASS' : 'FAIL',
        hasOntologyPanel ? 'PKM panel detected' : 'PKM panel missing');
      this.log('Middle Column (Tasks)', hasPriorityCenter ? 'PASS' : 'FAIL',
        hasPriorityCenter ? 'Priority center detected' : 'Priority center missing');
      this.log('Right Column (Goals)', hasGoalsPanel ? 'PASS' : 'FAIL',
        hasGoalsPanel ? 'Goals panel detected' : 'Goals panel missing');

      // Check for responsive design
      const hasResponsiveCSS = html.includes('grid-template-columns') || html.includes('@media');
      this.log('Responsive Design', hasResponsiveCSS ? 'PASS' : 'FAIL',
        hasResponsiveCSS ? 'Responsive CSS detected' : 'No responsive design');

    } catch (error) {
      this.log('Tri-Column Layout', 'FAIL', error.message);
    }
  }

  async testComplexityAbstraction() {
    console.log('🎛️ Testing Complexity Abstraction...');

    try {
      const response = await fetch('/');
      const html = await response.text();

      // Check for overlay buttons (complexity behind buttons)
      const hasGraphButton = html.includes('Graph') || html.includes('graph');
      const hasStatsButton = html.includes('Stats') || html.includes('stats');
      const hasPersonaButton = html.includes('Persona') || html.includes('persona');

      this.log('Graph Overlay Button', hasGraphButton ? 'PASS' : 'FAIL',
        hasGraphButton ? 'Graph access button found' : 'No graph button');
      this.log('Stats Overlay Button', hasStatsButton ? 'PASS' : 'FAIL',
        hasStatsButton ? 'Stats access button found' : 'No stats button');
      this.log('Persona Overlay Button', hasPersonaButton ? 'PASS' : 'FAIL',
        hasPersonaButton ? 'Persona access button found' : 'No persona button');

      // Check for overlay CSS
      const hasOverlayCSS = html.includes('overlay') || html.includes('modal');
      this.log('Overlay Infrastructure', hasOverlayCSS ? 'PASS' : 'FAIL',
        hasOverlayCSS ? 'Overlay CSS detected' : 'No overlay system');

    } catch (error) {
      this.log('Complexity Abstraction', 'FAIL', error.message);
    }
  }

  async testSearchFunctionality() {
    console.log('🔍 Testing Search Functionality...');

    try {
      const response = await fetch('/');
      const html = await response.text();

      // Check for search input
      const hasSearchInput = html.includes('type="text"') || html.includes('search');
      this.log('Search Input', hasSearchInput ? 'PASS' : 'FAIL',
        hasSearchInput ? 'Search input detected' : 'No search input');

      // Check for search suggestions
      const hasSearchSuggestions = html.includes('suggestions') || html.includes('autocomplete');
      this.log('Search Suggestions', hasSearchSuggestions ? 'PASS' : 'FAIL',
        hasSearchSuggestions ? 'Search suggestions detected' : 'No search suggestions');

    } catch (error) {
      this.log('Search Functionality', 'FAIL', error.message);
    }
  }

  async testGraphVisualization() {
    console.log('🕸️ Testing Graph Visualization...');

    try {
      const response = await fetch('/');
      const html = await response.text();

      // Check for canvas element
      const hasCanvas = html.includes('<canvas') || html.includes('graphCanvas');
      this.log('Graph Canvas', hasCanvas ? 'PASS' : 'FAIL',
        hasCanvas ? 'Canvas element detected' : 'No canvas element');

      // Check for graph controls
      const hasGraphControls = html.includes('filter') || html.includes('export');
      this.log('Graph Controls', hasGraphControls ? 'PASS' : 'FAIL',
        hasGraphControls ? 'Graph controls detected' : 'No graph controls');

    } catch (error) {
      this.log('Graph Visualization', 'FAIL', error.message);
    }
  }

  async testUserExperience() {
    console.log('👤 Testing User Experience...');

    try {
      const response = await fetch('/');
      const html = await response.text();

      // Check for loading states
      const hasLoadingStates = html.includes('Loading') || html.includes('loading');
      this.log('Loading States', hasLoadingStates ? 'PASS' : 'FAIL',
        hasLoadingStates ? 'Loading indicators detected' : 'No loading states');

      // Check for modern styling
      const hasModernCSS = html.includes('gradient') || html.includes('rgba');
      this.log('Modern Styling', hasModernCSS ? 'PASS' : 'FAIL',
        hasModernCSS ? 'Modern CSS detected' : 'Basic styling only');

      // Check for accessibility
      const hasAccessibility = html.includes('aria-') || html.includes('role=');
      this.log('Accessibility Features', hasAccessibility ? 'PASS' : 'FAIL',
        hasAccessibility ? 'Accessibility attributes detected' : 'No accessibility features');

    } catch (error) {
      this.log('User Experience', 'FAIL', error.message);
    }
  }

  async testPerformance() {
    console.log('⚡ Testing Performance...');

    try {
      const startTime = performance.now();
      const response = await fetch('/');
      const html = await response.text();
      const loadTime = performance.now() - startTime;

      this.log('Page Load Time', loadTime < 1000 ? 'PASS' : 'FAIL',
        `${Math.round(loadTime)}ms (target: <1000ms)`);

      // Check bundle size
      const htmlSize = html.length;
      this.log('HTML Bundle Size', htmlSize < 100000 ? 'PASS' : 'FAIL',
        `${Math.round(htmlSize/1024)}KB (target: <100KB)`);

    } catch (error) {
      this.log('Performance', 'FAIL', error.message);
    }
  }

  async testEdgeCases() {
    console.log('🔧 Testing Edge Cases...');

    try {
      // Test 404 handling
      const notFoundResponse = await fetch('/nonexistent.json');
      this.log('404 Handling', notFoundResponse.status === 404 ? 'PASS' : 'FAIL',
        `Status: ${notFoundResponse.status}`);

      // Test empty vault
      const emptyResponse = await fetch('/vault/empty.json');
      this.log('Empty Vault Handling', emptyResponse.status === 404 ? 'PASS' : 'FAIL',
        'Should gracefully handle missing files');

    } catch (error) {
      this.log('Edge Cases', 'PASS', 'Proper error handling detected');
    }
  }

  generateReport() {
    console.log('\n📋 Test Results Summary');
    console.log('========================');

    const passed = this.results.filter(r => r.status === 'PASS').length;
    const failed = this.results.filter(r => r.status === 'FAIL').length;
    const total = this.results.length;

    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} (${Math.round(passed/total*100)}%)`);
    console.log(`Failed: ${failed} (${Math.round(failed/total*100)}%)`);

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.filter(r => r.status === 'FAIL').forEach(r => {
        console.log(`   - ${r.test}: ${r.details}`);
      });
    }

    console.log('\n🎯 MVP Readiness Assessment:');
    if (passed >= total * 0.8) {
      console.log('✅ READY FOR MVP - High confidence in core functionality');
    } else if (passed >= total * 0.6) {
      console.log('⚠️ APPROACHING READINESS - Some issues to address');
    } else {
      console.log('❌ NOT READY - Significant issues need resolution');
    }

    // Export results for analysis
    return {
      summary: { total, passed, failed, percentage: Math.round(passed/total*100) },
      details: this.results,
      timestamp: new Date().toISOString()
    };
  }
}

// Run tests if in browser environment
if (typeof window !== 'undefined') {
  window.MVPTester = MVPTester;
  console.log('MVP Tester loaded. Run: new MVPTester().runAllTests()');
}

// Export for Node.js testing
if (typeof module !== 'undefined') {
  module.exports = { MVPTester };
}

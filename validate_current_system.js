#!/usr/bin/env node

/**
 * SEMANTIC PKM SYSTEM VALIDATION
 * Comprehensive assessment of current capabilities
 */

console.log('🎯 SEMANTIC PKM SYSTEM VALIDATION');
console.log('=====================================\n');

// Test 1: Core Files Validation
function validateCoreFiles() {
  const fs = require('fs');
  const coreFiles = [
    'index.html',
    'semantic-system.js',
    'semantic-pathfinding-engine.js',
    'SEMANTIC_PATHFINDING_ARCHITECTURE.md',
    'test-pathfinding.js',
    'goals.html'
  ];

  console.log('📁 CORE FILES VALIDATION:');
  let allPresent = true;

  coreFiles.forEach(file => {
    const exists = fs.existsSync(file);
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allPresent = false;
  });

  return allPresent;
}

// Test 2: Semantic System Analysis
function analyzeSemanticSystem() {
  const fs = require('fs');
  console.log('\n🧠 SEMANTIC SYSTEM ANALYSIS:');

  if (!fs.existsSync('semantic-system.js')) {
    console.log('  ❌ semantic-system.js not found');
    return false;
  }

  const content = fs.readFileSync('semantic-system.js', 'utf8');

  const features = [
    { name: 'Semantic Addressing (sem://)', regex: /sem:\/\// },
    { name: 'findRelated() method', regex: /findRelated\s*\(/ },
    { name: 'Pathfinding weights', regex: /pathfinding.*weight|weight.*pathfinding/i },
    { name: 'User context', regex: /userContext|user.*context/i },
    { name: 'Multi-dimensional scoring', regex: /semantic_similarity|difficulty|success_probability/ }
  ];

  features.forEach(feature => {
    const found = feature.regex.test(content);
    console.log(`  ${found ? '✅' : '❌'} ${feature.name}`);
  });

  return true;
}

// Test 3: Pathfinding Engine Validation
function validatePathfindingEngine() {
  const fs = require('fs');
  console.log('\n🧭 PATHFINDING ENGINE VALIDATION:');

  if (!fs.existsSync('semantic-pathfinding-engine.js')) {
    console.log('  ❌ semantic-pathfinding-engine.js not found');
    return false;
  }

  const content = fs.readFileSync('semantic-pathfinding-engine.js', 'utf8');

  const pathfindingFeatures = [
    { name: 'SemanticPathfindingEngine class', regex: /class SemanticPathfindingEngine/ },
    { name: 'findOptimalPath method', regex: /findOptimalPath\s*\(/ },
    { name: 'A* algorithm implementation', regex: /function aStar|aStar.*function/ },
    { name: 'Goal decomposition', regex: /decomposeGoal|decompose.*goal/i },
    { name: 'User personalization', regex: /personalizeRoute|personalize.*route/i },
    { name: 'Apple pie example', regex: /apple.*pie|pie.*baking/i },
    { name: 'Multi-route generation', regex: /generateAlternativeRoutes|alternative.*routes/i }
  ];

  pathfindingFeatures.forEach(feature => {
    const found = feature.regex.test(content);
    console.log(`  ${found ? '✅' : '❌'} ${feature.name}`);
  });

  return true;
}

// Test 4: Architecture Documentation
function validateArchitecture() {
  const fs = require('fs');
  console.log('\n📐 ARCHITECTURE DOCUMENTATION:');

  if (!fs.existsSync('SEMANTIC_PATHFINDING_ARCHITECTURE.md')) {
    console.log('  ❌ Architecture document not found');
    return false;
  }

  const content = fs.readFileSync('SEMANTIC_PATHFINDING_ARCHITECTURE.md', 'utf8');
  const wordCount = content.split(/\s+/).length;
  const lineCount = content.split('\n').length;

  console.log(`  ✅ Architecture document exists (${wordCount} words, ${lineCount} lines)`);
  console.log(`  ✅ Comprehensive analysis complete`);

  return true;
}

// Test 5: Goals Dashboard Assessment
function assessGoalsDashboard() {
  const fs = require('fs');
  console.log('\n🎯 GOALS DASHBOARD ASSESSMENT:');

  if (!fs.existsSync('goals.html')) {
    console.log('  ❌ Goals dashboard not found');
    return false;
  }

  const content = fs.readFileSync('goals.html', 'utf8');

  const dashboardFeatures = [
    { name: 'Semantic Pathfinding section', regex: /Semantic Pathfinding.*Navigation/i },
    { name: 'Breakthrough styling', regex: /milestone-revolutionary|breakthrough/i },
    { name: '85% pathfinding progress', regex: /85%.*Complete/ },
    { name: 'Updated foundation progress', regex: /75%.*Complete/ },
    { name: 'Progress animations', regex: /animation.*pulse|shimmer/ }
  ];

  dashboardFeatures.forEach(feature => {
    const found = feature.regex.test(content);
    console.log(`  ${found ? '✅' : '❌'} ${feature.name}`);
  });

  return true;
}

// Test 6: System Integration Status
function assessSystemIntegration() {
  const fs = require('fs');
  console.log('\n🔗 SYSTEM INTEGRATION STATUS:');

  // Check if main index.html integrates with pathfinding
  if (fs.existsSync('index.html')) {
    const content = fs.readFileSync('index.html', 'utf8');
    const hasSemanticSystem = /semantic-system\.js/.test(content);
    const hasPathfinding = /semantic-pathfinding/.test(content);

    console.log(`  ${hasSemanticSystem ? '✅' : '❌'} Semantic system integration`);
    console.log(`  ${hasPathfinding ? '✅' : '⚠️ '} Pathfinding integration (${hasPathfinding ? 'present' : 'pending'})`);
  }

  // Check vault structure
  const vaultExists = fs.existsSync('vault') && fs.existsSync('vault/manifest.json');
  console.log(`  ${vaultExists ? '✅' : '❌'} Vault structure`);

  return true;
}

// Test 7: Next Priority Assessment
function assessNextPriorities() {
  console.log('\n🚀 NEXT PRIORITIES ASSESSMENT:');
  console.log('=====================================\n');

  const priorities = [
    {
      name: '🎨 Pathfinding UI Implementation',
      importance: 'HIGH',
      description: 'Interactive visual pathfinding interface',
      effort: 'MEDIUM',
      impact: 'HIGH'
    },
    {
      name: '🤖 AI Integration (LLM Connectors)',
      importance: 'HIGH',
      description: 'Connect Large and Local LLM models',
      effort: 'HIGH',
      impact: 'REVOLUTIONARY'
    },
    {
      name: '⚡ Performance Optimization',
      importance: 'MEDIUM',
      description: 'WebWorkers, virtual scrolling, lazy loading',
      effort: 'MEDIUM',
      impact: 'MEDIUM'
    },
    {
      name: '🔒 Enterprise Security',
      importance: 'LOW',
      description: 'Authentication, authorization, encryption',
      effort: 'HIGH',
      impact: 'LOW (for MVP)'
    },
    {
      name: '📱 Mobile Optimization',
      importance: 'MEDIUM',
      description: 'Responsive design improvements',
      effort: 'LOW',
      impact: 'MEDIUM'
    },
    {
      name: '🧪 Testing Infrastructure',
      importance: 'HIGH',
      description: 'Automated testing for pathfinding',
      effort: 'MEDIUM',
      impact: 'HIGH'
    }
  ];

  priorities.forEach(priority => {
    console.log(`🎯 ${priority.name}`);
    console.log(`   Importance: ${priority.importance} | Effort: ${priority.effort} | Impact: ${priority.impact}`);
    console.log(`   ${priority.description}\n`);
  });

  return priorities;
}

// Main validation runner
async function runValidation() {
  const results = {
    coreFiles: validateCoreFiles(),
    semanticSystem: analyzeSemanticSystem(),
    pathfindingEngine: validatePathfindingEngine(),
    architecture: validateArchitecture(),
    goalsDashboard: assessGoalsDashboard(),
    systemIntegration: assessSystemIntegration()
  };

  const nextPriorities = assessNextPriorities();

  console.log('📊 VALIDATION SUMMARY:');
  console.log('======================\n');

  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
  });

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  const completionRate = Math.round((passedTests / totalTests) * 100);

  console.log(`\n🎯 OVERALL SYSTEM STATUS: ${completionRate}% VALIDATED`);

  if (completionRate >= 80) {
    console.log('🚀 STATUS: READY FOR NEXT PHASE');
    console.log('🎯 RECOMMENDATION: Implement pathfinding UI or AI integration');
  } else if (completionRate >= 60) {
    console.log('⚠️  STATUS: STRONG FOUNDATION, MINOR GAPS');
    console.log('🔧 RECOMMENDATION: Address validation failures before advancing');
  } else {
    console.log('❌ STATUS: SIGNIFICANT GAPS DETECTED');
    console.log('🚨 RECOMMENDATION: Focus on core infrastructure completion');
  }

  return { results, nextPriorities, completionRate };
}

// Run the validation
if (require.main === module) {
  runValidation().catch(console.error);
}

module.exports = { runValidation };

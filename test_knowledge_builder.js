#!/usr/bin/env node

const { IterativeKnowledgeBuilder } = require('./iterative-knowledge-builder.js');
const fs = require('fs');

console.log('🧪 ITERATIVE KNOWLEDGE BUILDER - INTEGRATION TEST');
console.log('================================================');

async function runIntegrationTest() {
  const kb = new IterativeKnowledgeBuilder();

  // Load vault documents
  const files = fs.readdirSync('./vault').filter(f => f.endsWith('.md'));
  console.log('📁 Loading', files.length, 'documents from vault...');

  const documents = files.map(file => {
    const content = fs.readFileSync(`./vault/${file}`, 'utf8');
    return { id: file, content: content };
  });

  console.log('✅ Documents loaded');
  console.log('');

  // Run Phase 1
  console.log('🚀 Executing Phase 1: Rough Landscape Mapping');
  console.log('----------------------------------------------');
  const startTime = Date.now();

  try {
    const result = kb.phase1_roughMapping(documents);
    const endTime = Date.now();

    // Small delay to let async operations complete
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log('✅ Phase 1 completed in', (endTime - startTime), 'ms');
    console.log('');

    // Check final state
    console.log('📊 RESULTS SUMMARY');
    console.log('------------------');
    console.log('Documents processed:', kb.documents?.length || 0);
    console.log('Categories discovered:', kb.categories?.size || 0);
    console.log('Assignments made:', kb.assignments?.size || 0);
    console.log('');

    if (kb.categories && kb.categories.size > 0) {
      console.log('🏷️ DISCOVERED CATEGORIES:');
      let i = 1;
      for (const [id, cat] of kb.categories) {
        console.log(`${i}. ${cat.label} (confidence: ${cat.confidence.toFixed(2)})`);
        const termStrings = cat.topTerms?.map(t => typeof t === 'object' ? t.term : t) || [];
        console.log(`   Terms: ${termStrings.join(', ') || 'N/A'}`);
        i++;
      }
      console.log('');
    }

    if (kb.assignments && kb.assignments.size > 0) {
      console.log('📝 SAMPLE ASSIGNMENTS:');
      let count = 0;
      for (const [docId, assignment] of kb.assignments) {
        if (count >= 3) break;
        const category = kb.categories.get(assignment.categoryId);
        console.log(`• ${docId} → ${category?.label || 'Unknown'}`);
        console.log(`  Confidence: ${assignment.confidence.toFixed(2)} | Reason: ${assignment.reasoning}`);
        count++;
      }
      console.log('');
    }

    // Test export functionality
    console.log('💾 TESTING EXPORT/IMPORT');
    console.log('------------------------');
    const exported = kb.exportProgress();
    console.log('Export size:', JSON.stringify(exported).length, 'characters');

    // Test progress report
    const progress = kb.getProgressReport();
    console.log('Progress report keys:', Object.keys(progress));

    console.log('');
    console.log('🎉 Integration test completed successfully!');

  } catch (error) {
    console.error('❌ Error during testing:', error);
    console.error('Stack:', error.stack);
  }
}

runIntegrationTest().catch(console.error);

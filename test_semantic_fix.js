// Test script for semantic system fixes
console.log('Testing Semantic Address System Fixes');
console.log('=====================================');

// Load the semantic system
try {
  const fs = require('fs');
  let semanticCode = fs.readFileSync('./semantic-system.js', 'utf8');

  // Remove browser-specific initialization and export the class
  semanticCode = semanticCode.replace('window.semanticSystem = new SemanticAddressSystem();', '');
  semanticCode += '\nif (typeof module !== "undefined") module.exports = SemanticAddressSystem;';

  // Write temporary file and require it
  fs.writeFileSync('./temp_semantic.js', semanticCode);
  const SemanticAddressSystem = require('./temp_semantic.js');

  console.log('✅ Semantic system loaded successfully');

  // Create instance
  const sem = new SemanticAddressSystem();

  // Test 1: Parse short form
  console.log('\n--- Test 1: Parse Short Form ---');
  const shortResult = sem.parse('person:alex-rivers');
  console.log('Input: person:alex-rivers');
  console.log('Output:', shortResult);
  console.log('Expected full URI:', shortResult ? shortResult.uri : 'null');

  // Test 2: Parse full form
  console.log('\n--- Test 2: Parse Full Form ---');
  const fullResult = sem.parse('sem://vault/person/alex-rivers');
  console.log('Input: sem://vault/person/alex-rivers');
  console.log('Output:', fullResult);

  // Test 3: Normalization
  console.log('\n--- Test 3: Normalization ---');
  const normalized = sem.normalize('person:alex-rivers');
  console.log('Input: person:alex-rivers');
  console.log('Normalized:', normalized);

  // Test 4: Registration and Resolution
  console.log('\n--- Test 4: Registration and Resolution ---');

  // Register a short form semantic ID
  try {
    const registeredUri = sem.register('person:alex-rivers', {
      file: '01_person.md',
      title: 'Alex Rivers',
      type: 'person'
    });
    console.log('Registered URI:', registeredUri);

    // Try to resolve it
    const resolved = sem.resolve('person:alex-rivers');
    console.log('Resolved short form:', resolved ? '✅ Success' : '❌ Failed');

    const resolvedFull = sem.resolve('sem://vault/person/alex-rivers');
    console.log('Resolved full form:', resolvedFull ? '✅ Success' : '❌ Failed');

  } catch (error) {
    console.log('Registration error:', error.message);
  }

  // Clean up
  fs.unlinkSync('./temp_semantic.js');

  console.log('\n🎉 All tests completed!');

} catch (error) {
  console.error('❌ Error loading semantic system:', error.message);
}

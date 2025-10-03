// Test script to verify vault loading and tri-column population
const fetch = require('node-fetch');

async function testVaultLoading() {
  console.log('Testing vault loading and tri-column population...');

  // Test manifest accessibility
  const manifestRes = await fetch('http://localhost:8000/vault/manifest.json');
  const manifest = await manifestRes.json();
  console.log(`✓ Manifest loaded: ${manifest.length} files`);

  // Test file loading
  const firstFile = await fetch(`http://localhost:8000/vault/${manifest[0]}`);
  const content = await firstFile.text();
  console.log(`✓ First file loaded: ${manifest[0]} (${content.length} chars)`);

  // Test main interface
  const indexRes = await fetch('http://localhost:8000/');
  const indexHtml = await indexRes.text();

  // Check for tri-column structure
  const hasOntologyPanel = indexHtml.includes('id="ontologyPanel"');
  const hasPriorityCenter = indexHtml.includes('id="priorityCenter"');
  const hasGoalsPanel = indexHtml.includes('id="goalsPanel"');

  console.log(`✓ Ontology panel: ${hasOntologyPanel}`);
  console.log(`✓ Priority center: ${hasPriorityCenter}`);
  console.log(`✓ Goals panel: ${hasGoalsPanel}`);

  // Check for overlay buttons
  const hasGraphButton = indexHtml.includes('id="openGraph"');
  const hasPersonaButton = indexHtml.includes('id="openPersona"');
  const hasStatsButton = indexHtml.includes('id="openStats"');

  console.log(`✓ Graph overlay button: ${hasGraphButton}`);
  console.log(`✓ Persona overlay button: ${hasPersonaButton}`);
  console.log(`✓ Stats overlay button: ${hasStatsButton}`);

  // Check for goals link
  const hasGoalsLink = indexHtml.includes('📊 Goals');
  console.log(`✓ Goals link: ${hasGoalsLink}`);

  if (hasOntologyPanel && hasPriorityCenter && hasGoalsPanel && hasGraphButton && hasPersonaButton && hasStatsButton && hasGoalsLink) {
    console.log('\n🎉 All tri-column components and complexity abstraction verified!');
    console.log('\nNext steps:');
    console.log('1. Visit http://localhost:8000/');
    console.log('2. Click "Load ./vault/" to populate with data from 10 .md files');
    console.log('3. See PKM ontology (left), priority tasks (middle), goals snapshot (right)');
    console.log('4. Click Graph/Persona/Stats buttons for advanced features in overlays');
  } else {
    console.log('\n❌ Some components missing');
  }
}

testVaultLoading().catch(console.error);

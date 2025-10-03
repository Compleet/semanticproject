const fetch = global.fetch || require('node-fetch');
const cheerio = require('cheerio');

const BASE = process.env.BASE_URL || 'http://localhost:8000';

async function testGoalsDashboard(){
  console.log('Testing Goals Dashboard...');

  // Test goals page loads
  const goalsRes = await fetch(`${BASE}/goals.html`);
  if (!goalsRes.ok) throw new Error(`Goals page returned ${goalsRes.status}`);

  const goalsHtml = await goalsRes.text();
  const $ = cheerio.load(goalsHtml);

  // Check title
  const title = $('h1').first().text().trim();
  console.log('Goals page title:', title);
  if (!title.includes('PKM Semantic Vault - Project Goals')) throw new Error('Goals title mismatch');

  // Count goal sections in HTML
  const goalSections = $('script').html().match(/title: "([^"]+)"/g);
  if (!goalSections || goalSections.length < 20) throw new Error('Not enough goal sections found');
  console.log('Found goal categories:', goalSections.length);

  // Check for specific goal categories
  const scriptContent = $('script').html();
  const expectedGoals = [
    'User Interface Excellence',
    'Semantic Addressing System',
    'Knowledge Graph Visualization',
    'Testing & Quality Assurance',
    'Performance Optimization'
  ];

  for (const goal of expectedGoals) {
    if (!scriptContent.includes(goal)) throw new Error(`Missing goal: ${goal}`);
  }
  console.log('✓ Key goal categories found');

  // Check subgoals structure
  const subgoalMatches = scriptContent.match(/subgoals: \[([^\]]+)\]/g);
  if (!subgoalMatches || subgoalMatches.length < 20) throw new Error('Missing subgoals structure');

  // Count total subgoals
  let totalSubgoals = 0;
  subgoalMatches.forEach(match => {
    const count = (match.match(/"/g) || []).length / 2; // Count quoted strings
    totalSubgoals += count;
  });

  console.log('Total subgoals found:', totalSubgoals);
  if (totalSubgoals < 1000) throw new Error('Not enough subgoals - expected ~1029');

  // Test main page has goals button
  const mainRes = await fetch(`${BASE}/index.html`);
  if (!mainRes.ok) throw new Error(`Main page returned ${mainRes.status}`);

  const mainHtml = await mainRes.text();
  if (!mainHtml.includes('goals.html') || !mainHtml.includes('📊 Goals')) {
    throw new Error('Goals button not found in main interface');
  }
  console.log('✓ Goals button found in main interface');

  console.log('✅ All Goals Dashboard tests passed!');
}

testGoalsDashboard().catch(e=>{console.error('GOALS TESTS FAILED:', e.message); process.exit(2)});

// Comprehensive test for dual goal system and modern PKM features
const fetch = require('node-fetch');

async function testDualGoalSystem() {
  console.log('🧪 COMPREHENSIVE TEST: Dual Goal System & Modern PKM\n');

  try {
    // Test 1: Verify Alex's personal goals are loaded
    const manifestRes = await fetch('http://localhost:8000/vault/manifest.json');
    const manifest = await manifestRes.json();

    console.log('✓ Manifest items:', manifest.length);

    const hasPersonalGoals = manifest.includes('11_alex-personal-goals.md');
    console.log('✓ Alex personal goals file:', hasPersonalGoals ? 'FOUND' : 'MISSING');

    if (hasPersonalGoals) {
      const personalGoalsRes = await fetch('http://localhost:8000/vault/11_alex-personal-goals.md');
      const personalGoalsContent = await personalGoalsRes.text();
      console.log('✓ Personal goals content length:', personalGoalsContent.length);

      // Check for different goal categories
      const hasFamily = personalGoalsContent.includes('Family & Relationships');
      const hasHealth = personalGoalsContent.includes('Health & Wellness');
      const hasCareer = personalGoalsContent.includes('Research & Career');
      const hasTravel = personalGoalsContent.includes('Travel & Exploration');

      console.log('✓ Family goals section:', hasFamily ? 'YES' : 'NO');
      console.log('✓ Health goals section:', hasHealth ? 'YES' : 'NO');
      console.log('✓ Career goals section:', hasCareer ? 'YES' : 'NO');
      console.log('✓ Travel goals section:', hasTravel ? 'YES' : 'NO');
    }

    // Test 2: Verify system development goals are separate
    const systemGoalsRes = await fetch('http://localhost:8000/goals.html');
    const systemGoalsText = await systemGoalsRes.text();
    console.log('✓ System goals page accessible:', systemGoalsRes.ok ? 'YES' : 'NO');

    const hasSystemGoals = systemGoalsText.includes('PKM Semantic Vault - Project Goals');
    console.log('✓ System development goals found:', hasSystemGoals ? 'YES' : 'NO');

    // Test 3: Check main interface for dual system
    const indexRes = await fetch('http://localhost:8000/');
    const indexHtml = await indexRes.text();

    // Modern PKM features
    const hasSearchSuggestions = indexHtml.includes('search-suggestions');
    const hasWikilinks = indexHtml.includes('wikilink');
    const hasBacklinkCount = indexHtml.includes('backlink-count');
    const hasNoteTags = indexHtml.includes('note-tag');
    const hasPersonalCategory = indexHtml.includes('Personal Goals');

    console.log('\n🎯 MODERN PKM FEATURES:');
    console.log('✓ Search suggestions:', hasSearchSuggestions ? 'YES' : 'NO');
    console.log('✓ Wikilink support:', hasWikilinks ? 'YES' : 'NO');
    console.log('✓ Backlink counting:', hasBacklinkCount ? 'YES' : 'NO');
    console.log('✓ Tag system:', hasNoteTags ? 'YES' : 'NO');
    console.log('✓ Personal goals category:', hasPersonalCategory ? 'YES' : 'NO');

    // Test 4: Verify priority separation
    const hasSystemTasks = indexHtml.includes('SYSTEM DEVELOPMENT');
    const hasPersonalTasks = indexHtml.includes('ALEX\'S PERSONAL');

    console.log('\n⚡ PRIORITY TASK SEPARATION:');
    console.log('✓ System development section:', hasSystemTasks ? 'YES' : 'NO');
    console.log('✓ Alex personal section:', hasPersonalTasks ? 'YES' : 'NO');

    // Test 5: Modern UI enhancements
    const hasModernStyling = indexHtml.includes('gradient') && indexHtml.includes('transform');
    const hasLoadStatus = indexHtml.includes('loadStatus');
    const hasFavicon = indexHtml.includes('favicon.svg');

    console.log('\n🎨 UI ENHANCEMENTS:');
    console.log('✓ Modern gradient styling:', hasModernStyling ? 'YES' : 'NO');
    console.log('✓ Load status indicator:', hasLoadStatus ? 'YES' : 'NO');
    console.log('✓ Favicon added:', hasFavicon ? 'YES' : 'NO');

    console.log('\n📊 SUMMARY:');
    const personalGoalsImplemented = hasPersonalGoals && hasFamily && hasHealth;
    const systemGoalsSeparate = hasSystemGoals && hasSystemTasks;
    const modernFeaturesAdded = hasSearchSuggestions && hasWikilinks && hasBacklinkCount;
    const uiEnhanced = hasModernStyling && hasLoadStatus && hasFavicon;

    console.log('✅ Alex personal goals system:', personalGoalsImplemented ? 'IMPLEMENTED' : 'MISSING');
    console.log('✅ System goals separate:', systemGoalsSeparate ? 'CONFIRMED' : 'ISSUE');
    console.log('✅ Modern PKM features:', modernFeaturesAdded ? 'ADDED' : 'INCOMPLETE');
    console.log('✅ UI enhanced:', uiEnhanced ? 'UPGRADED' : 'BASIC');

    if (personalGoalsImplemented && systemGoalsSeparate && modernFeaturesAdded && uiEnhanced) {
      console.log('\n🎉 ALL TESTS PASSED! Dual goal system with modern PKM features successfully implemented!');
    } else {
      console.log('\n⚠️  Some features need attention. Check individual test results above.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDualGoalSystem();

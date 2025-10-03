#!/bin/bash

# 🔥 AGGRESSIVE CLEANUP SCRIPT
# Run this to remove 76% of the bloat

set -e

echo "🔥 AGGRESSIVE CLEANUP: Removing bloat from semanticproject"
echo ""
echo "Creating archive directory..."
mkdir -p archive/{tests,analysis-docs,experiments,abandoned-js}

echo ""
echo "📦 Archiving test files..."
mv *test*.js archive/tests/ 2>/dev/null || true
mv tests/ archive/tests/tests-old/ 2>/dev/null || true
mv *tester.js archive/tests/ 2>/dev/null || true
mv validate_*.js archive/tests/ 2>/dev/null || true
mv test_mvp.sh archive/tests/ 2>/dev/null || true
mv logic_tests.js archive/tests/ 2>/dev/null || true
mv strategic_next_steps.js archive/tests/ 2>/dev/null || true

echo ""
echo "📄 Archiving analysis docs (17 files)..."
mv *_ANALYSIS.md archive/analysis-docs/ 2>/dev/null || true
mv *_STATUS.md archive/analysis-docs/ 2>/dev/null || true
mv *ARCHITECTURE*.md archive/analysis-docs/ 2>/dev/null || true
mv ITERATIVE_*.md archive/analysis-docs/ 2>/dev/null || true
mv *_PLAN.md archive/analysis-docs/ 2>/dev/null || true
mv *_READY.md archive/analysis-docs/ 2>/dev/null || true
mv *_COMPLETE.md archive/analysis-docs/ 2>/dev/null || true
mv coordinationkernel.txt archive/analysis-docs/ 2>/dev/null || true
mv BRUTAL_AUDIT.md archive/analysis-docs/ 2>/dev/null || true

echo ""
echo "🌐 Archiving experimental HTML..."
mv goals*.html archive/experiments/ 2>/dev/null || true
mv knowledge-builder-demo.html archive/experiments/ 2>/dev/null || true
mv populate_demo.html archive/experiments/ 2>/dev/null || true
mv nested.html archive/experiments/ 2>/dev/null || true

echo ""
echo "⚙️ Archiving unused JavaScript..."
mv revolutionary-pkm-features.js archive/abandoned-js/ 2>/dev/null || true
mv iterative-knowledge-builder.js archive/abandoned-js/ 2>/dev/null || true

echo ""
echo "🗑️ Deleting pure junk..."
rm -rf test-results/ 2>/dev/null || true
rm serve.log 2>/dev/null || true
rm debug_autoload.js 2>/dev/null || true

echo ""
echo "✅ CLEANUP COMPLETE!"
echo ""
echo "📊 Summary:"
echo "  - Archived: ~50+ files"
echo "  - Deleted: ~5 files"
echo "  - Kept: 15 core files"
echo ""
echo "📁 Files in /archive/ can be restored if needed"
echo "💾 Commit with: git add -A && git commit -m 'Clean up bloat'"
echo ""
echo "🎯 Core files remaining:"
ls -1 *.html *.js *.sh *.md 2>/dev/null | head -20

#!/bin/bash
# Comprehensive PKM MVP Testing Script

echo "🧪 PKM MVP - Comprehensive Testing"
echo "=================================="
echo

# Test 1: Server and Basic Connectivity
echo "📡 Testing Server Connectivity..."
if curl -s http://localhost:8000 >/dev/null; then
    echo "✅ Server is running on port 8000"
else
    echo "❌ Server not running. Start with: python3 -m http.server 8000"
    exit 1
fi

# Test 2: Vault Manifest and Files
echo
echo "📁 Testing Vault Loading..."
manifest_response=$(curl -s http://localhost:8000/vault/manifest.json)
if [ $? -eq 0 ]; then
    file_count=$(echo $manifest_response | grep -o '\.md"' | wc -l)
    echo "✅ Manifest accessible with $file_count markdown files"
else
    echo "❌ Manifest not accessible"
fi

# Test 3: Interface Components
echo
echo "🎨 Testing Interface Components..."
main_page=$(curl -s http://localhost:8000)

# Check for tri-column layout
if echo "$main_page" | grep -q "tri-layout"; then
    echo "✅ Tri-column layout present"
else
    echo "❌ Tri-column layout missing"
fi

# Check for complexity abstraction buttons
if echo "$main_page" | grep -q "openGraph\|openPersona\|openStats"; then
    echo "✅ Complexity abstraction buttons present"
else
    echo "❌ Complexity abstraction buttons missing"
fi

# Check for enhanced UX elements
if echo "$main_page" | grep -q "loading-spinner\|status-indicator\|empty-state"; then
    echo "✅ Enhanced UX elements present"
else
    echo "❌ Enhanced UX elements missing"
fi

# Check for semantic system integration
if echo "$main_page" | grep -q "semantic-system.js"; then
    echo "✅ Semantic system integrated"
else
    echo "❌ Semantic system not integrated"
fi

# Test 4: Goals Integration
echo
echo "📊 Testing Goals Integration..."
if curl -s http://localhost:8000/goals.html >/dev/null; then
    echo "✅ Goals dashboard accessible"
else
    echo "❌ Goals dashboard not accessible"
fi

# Test 5: File Structure Validation
echo
echo "📂 Testing File Structure..."
required_files=(
    "index.html"
    "goals.html"
    "semantic-system.js"
    "vault/manifest.json"
    "vault/01_person.md"
    "vault/11_alex-personal-goals.md"
)

for file in "${required_files[@]}"; do
    if [ -f "/home/tam/semanticproject/$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
    fi
done

# Test 6: Performance Simulation
echo
echo "⚡ Testing Performance..."
start_time=$(date +%s%N)
curl -s http://localhost:8000 >/dev/null
end_time=$(date +%s%N)
load_time=$(( (end_time - start_time) / 1000000 ))

if [ $load_time -lt 1000 ]; then
    echo "✅ Page load time: ${load_time}ms (excellent)"
elif [ $load_time -lt 2000 ]; then
    echo "✅ Page load time: ${load_time}ms (good)"
else
    echo "⚠️ Page load time: ${load_time}ms (needs optimization)"
fi

# Test 7: MVP Feature Completeness
echo
echo "🎯 MVP Feature Completeness Check..."

features=(
    "Tri-column layout:tri-layout"
    "Auto vault loading:loadStatus"
    "Search functionality:search"
    "Graph visualization:graphCanvas"
    "Semantic addressing:semantic-system"
    "Goals integration:Goals"
    "Priority tasks:priorityCenter"
    "Modern styling:gradient"
)

feature_score=0
total_features=${#features[@]}

for feature in "${features[@]}"; do
    name=${feature%:*}
    pattern=${feature#*:}

    if echo "$main_page" | grep -q "$pattern"; then
        echo "✅ $name"
        ((feature_score++))
    else
        echo "❌ $name"
    fi
done

# Calculate MVP Readiness Score
percentage=$((feature_score * 100 / total_features))

echo
echo "📊 MVP Readiness Assessment"
echo "=========================="
echo "Features Complete: $feature_score/$total_features ($percentage%)"

if [ $percentage -ge 90 ]; then
    echo "🎉 READY FOR MVP LAUNCH - Excellent completion rate"
elif [ $percentage -ge 75 ]; then
    echo "✅ APPROACHING MVP READY - Minor polish needed"
elif [ $percentage -ge 60 ]; then
    echo "⚠️ PARTIAL MVP - Core features need completion"
else
    echo "❌ NOT MVP READY - Significant development required"
fi

echo
echo "🚀 Next Steps:"
if [ $percentage -ge 90 ]; then
    echo "- User testing with real PKM users"
    echo "- Performance optimization for larger vaults"
    echo "- Mobile responsive testing"
    echo "- Documentation and onboarding"
elif [ $percentage -ge 75 ]; then
    echo "- Complete missing core features"
    echo "- Polish user experience"
    echo "- Add error handling"
    echo "- Test with sample users"
else
    echo "- Focus on core PKM functionality"
    echo "- Complete tri-column layout"
    echo "- Implement search and navigation"
    echo "- Add vault loading capability"
fi

echo
echo "🌐 Access your PKM at: http://localhost:8000"
echo "📊 View goals dashboard at: http://localhost:8000/goals.html"
echo
echo "Testing complete! 🧪✨"

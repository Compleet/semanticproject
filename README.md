# Semantic PKM System 🧠

An intelligent Personal Knowledge Management (PKM) system with **two complementary interfaces**:

1. **`index.html`** - Enterprise-grade PKM with vault loading, semantic IDs, and knowledge graphs
2. **`streamline.html`** ⭐ **NEW** - Modern everyday-life dashboard with PARA methodology

Perfect for managing personal goals, family projects, home tasks, learning routines, and daily life organization.

**Live Demo**: `https://compleet.github.io/semanticproject/streamline.html`

---

## 🎯 Two Interfaces, One Vision

### 📊 **Enterprise PKM** (`index.html`)
Advanced knowledge management with automatic vault processing, multi-user support, and semantic relationship mapping.

**Best for:** Researchers, developers, knowledge workers managing large note collections.

### 🏠 **Streamline Dashboard** (`streamline.html`) ⭐ NEW
Beautiful, user-friendly interface for everyday life management using the PARA framework.

**Best for:** Regular people managing home projects, family coordination, health routines, and personal growth.

---

## ✨ Streamline Features (NEW!)

**Design Philosophy**: "Does my smart grandmother understand this?"

### 🏠 **Everyday Life Management**
- **PARA Framework**: Projects, Areas, Resources, Archives methodology
- **Real-Looking Content**: Garden projects, family reunions, health routines (not "Project Alpha")
- **Clickable Everything**: All items open in staging area with full details
- **Persistent AI Assistant**: Always-visible bottom chat panel for help
- **LocalStorage Persistence**: Your data saves automatically between sessions
- **Progress Tracking**: Visual bars and goal completion

### 🧠 **Intelligent Content Processing**
- **Automatic Goal Extraction**: Detects goals from any .md files using pattern recognition
- **Smart Categorization**: Classifies content by type (business, family, health, community, learning)
- **Priority Inference**: Automatically determines goal priorities from content
- **Entity Recognition**: Identifies people, projects, concepts, and tasks
- **Semantic Relationships**: Maps connections between content using semantic IDs

### 👥 **Multi-User Support**
- **Dual Personas**: Switch between Alex (developer) and Margaret (sewing business owner)
- **Vault Detection**: Automatically finds and loads multiple user vaults
- **User-Specific Goals**: Extracts and displays goals tailored to each persona
- **Content Adaptation**: UI adapts to reflect different user types and priorities

### 🎯 **Professional PKM Layout**
- **Tri-Column Design**: Knowledge Management | Tasks & Actions | Projects & Goals
- **Real-Time Search**: Instant filtering with wikilink and tag support
- **Task Highlighting**: Visual connections between PKM content and projects
- **Progress Tracking**: Intelligent progress calculation for goals and projects
- **Knowledge Graph**: Interactive visualization of content relationships

### 📊 **Development Dashboard**
- **Intelligence Metrics**: Real-time assessment of system capabilities
- **Goal Tracking**: Comprehensive development goals with 92% completion
- **Status Monitoring**: Live system health and feature availability
- **Progress Visualization**: Interactive subgoal grids and progress bars

## 🚀 Quick Start

### Option 1: Use Sample Vaults
1. Open `index.html` in Chrome/Edge (for File System Access API)
2. Server automatically detects and loads sample vaults
3. Use the header dropdown to switch between Alex and Margaret personas
4. Explore intelligent goal extraction and content organization

### Option 2: Your Own Files
1. Click "Choose Folder" and select your Markdown vault
2. System automatically extracts goals and categorizes content
3. View results in the professional tri-column layout

## 🏗️ System Architecture

### Vault Structure
```
vault/          # Alex's developer-focused PKM
vault2/         # Margaret's business & family PKM
manifest.json   # User metadata and goals
*.md files      # Rich content with frontmatter
```

### Content Intelligence
- **Frontmatter Processing**: YAML metadata extraction
- **Goal Patterns**: Regex-based goal detection from text
- **Category Classification**: Content-based type inference
- **Semantic IDs**: Unique addressing for all content
- **Bidirectional Linking**: [[wikilinks]] and backlink generation

## 🧪 Testing & Validation

The system includes comprehensive testing:
- **Intelligence Assessment**: 100% server functionality
- **Content Reflection**: Perfect structure processing
- **Multi-User Support**: Seamless persona switching
- **Goal Extraction**: Pattern recognition validation

## 🖥️ Serving Locally

### For Streamline Dashboard (Recommended)
```bash
# Simple Python server
python3 -m http.server 8000

# Or use serve.sh script
./serve.sh

# Open in browser
# Streamline: http://localhost:8000/streamline.html
# Main PKM: http://localhost:8000/index.html
```

### For Main PKM with Vaults
```bash
./serve.sh
```
Then open http://localhost:8000 in Chrome/Edge and click "Load ./vault/".

## 🎨 Customization

### Edit Streamline Data
Modify the `paraData` object in `streamline.html` (around line 450):
```javascript
const paraData = {
  projects: [
    { id:'proj-1', name:'Your Project', description:'...', progress:0.5, goals:[], status:'active' }
  ],
  // ... areas, resources, archives, ideas
};
```

### Theme Colors
Edit CSS custom properties (line ~50 in streamline.html):
```css
:root {
  --accent: #FF6B35;
  --bg: #0a0a0f;
  --text: #e8e8ea;
}
```

## 🗺️ Roadmap

### Completed ✅
- [x] Streamline dashboard with PARA methodology
- [x] Permanent AI assistant chat panel
- [x] Interactive project staging
- [x] Idea board & quick tags
- [x] Theme toggle (light/dark)
- [x] Command palette (Ctrl+K)
- [x] LocalStorage persistence

### Next Up 🚀
- [ ] Quick-add UI (tasks/ideas buttons)
- [ ] Mobile responsive improvements
- [ ] Export to markdown files
- [ ] Drag & drop PARA reordering
- [ ] Real AI integration (OpenAI/Gemini)
- [ ] Keyboard shortcuts help overlay

## 📄 License

MIT License - Use freely for personal or commercial projects.

---

**Made with ❤️ for people organizing their lives without engineering degrees.**

## Tech

- Vanilla JS, HTML, CSS
- [js-yaml](https://github.com/nodeca/js-yaml) for YAML parsing
- No backend, no build step

## Roadmap

- Add graph/ontology view (vis-network)
- Semantic search (embeddings)
- Tauri desktop app (optional)

---

This README will be updated as features are added.

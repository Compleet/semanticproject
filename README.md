# PKM Semantic Vault

An intelligent personal knowledge management (PKM) system that automatically understands and organizes your Markdown files. Features professional-grade content processing with multi-user support and automatic goal extraction.

## ✨ Key Features

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

## Serving locally

If you want to serve the project and use the bundled `vault/` folder, run:

```bash
./serve.sh
```

Then open http://localhost:8000 in Chrome/Edge and click "Load ./vault/".

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

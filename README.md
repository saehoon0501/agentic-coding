# Agentic Coding Tools Testing Repository

## Overview

This repository is designed for testing and comparing various agentic coding tools and their unique rule/instruction formats. The project serves as a practical testing ground to evaluate how different AI coding assistants handle project-specific guidelines and coding conventions.

## Tested Tools

### 1. **Codex**
- **Directory**: `codex/`
- **Rule Format**: Uses `AGENTS.md` files
- **Scope**: Instructions apply to the entire directory tree rooted at the folder containing the AGENTS.md file
- **Key Features**:
  - Can be placed anywhere in the filesystem (/, ~, Git repos)
  - Provides coding conventions, code organization info, and testing instructions
  - Supports programmatic checks that must be validated after changes
  - Nested AGENTS.md files take precedence over parent files
  - Direct system/user instructions override AGENTS.md instructions

### 2. **Claude (Claudia)**
- **Directory**: `claudia/`
- **Rule Format**: Uses `CLAUDE.md` files
- **Scope**: Automatically pulled into context when starting conversations
- **Key Features**:
  - Can be placed in repo root, parent directories, child directories, or home folder (~/.claude/)
  - Ideal for documenting common bash commands, core files, code style guidelines
  - Supports both checked-in (CLAUDE.md) and local (CLAUDE.local.md) variants
  - Automatically generates CLAUDE.md when using `/init` command
  - Optimizes context gathering and token usage

### 3. **Cursor**
- **Directory**: `cursor/`
- **Rule Format**: Uses `.cursor/rules` directory with `.mdc` files (MDC format)
- **Scope**: Can be scoped using path patterns and applied based on relevance
- **Key Features**:
  - Version-controlled rule files in `.cursor/rules` directories
  - Supports multiple rule types:
    - **Always**: Always included in model context
    - **Auto Attached**: Included when files matching glob patterns are referenced
    - **Agent Requested**: AI decides whether to include (requires description)
    - **Manual**: Only included when explicitly mentioned using @ruleName
  - Nested rules automatically attach when files in their directory are referenced
  - Supports metadata and content in MDC format

## Test Scenario

### 🛑 Task 1: Add Pause and Reset Controls

"Add a Pause and Reset button to the <TimeboxTimer /> component. The Pause button should stop the countdown, and the Reset button should clear the timer and allow the user to enter a new task."

### 🔔 Task 2: Play a Sound and Show an Alert When Time Is Up

"When the countdown reaches zero, play a short chime sound (local file) and show a modal or toast that says 'Timebox complete!' using mui components."

### 💾 Task 3: Store Timeboxes in LocalStorage

"Save completed timeboxes (task name, duration, and completion timestamp) to localStorage. Also, display a history of the last 5 timeboxes below the timer."

### 🎨 Task 4: Animate the Timer Countdown Circle

"Add a circular progress bar around the timer that visually counts down using SVG or canvas. Animate the circle to decrease smoothly in sync with the timer."

### 🌙 Task 5: Add Dark Mode Support

"Enable dark mode using Tailwind's built-in dark mode class and update mui theme config to support both light and dark styles. Add a toggle button at the top of the page."



## Project Structure

```
agentic_coding_test/
├── README.md                 # This overview document
├── AGENTS.md                 # Project Rule for Codex
├── .cursor/rules
|    ├── AGENTS.md                 # Project Rule for Cursor
├── .claude/
|    ├── CLAUDE.md                 # Project Rule for Claude Code
├── start_template/           # Base template for new tool tests
│   ├── src/
│   │   ├── app.jsx          # Main React application
│   │   ├── main.jsx         # React entry point
│   │   └── timeboxTimer.jsx # Sample component for testing
│   ├── package.json         # Dependencies and scripts
│   ├── vite.config.js       # Vite configuration
│   └── eslint.config.js     # ESLint configuration
├── codex/                   # Codex testing environment
├── claudia/                 # Claude testing environment
└── cursor/                  # Cursor testing environment
```

## Sample Application

All environments contain a consistent React application featuring:
- A timebox timer component for productivity tracking
- Modern React patterns and hooks
- Responsive design principles
- ESLint configuration for code quality

## Getting Started

### Prerequisites
- Node.js and npm installed
- Git for version control

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd agentic_coding_test
   ```

2. **Choose a testing environment**
   ```bash
   cd [codex|claudia|cursor]
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Run linting**
   ```bash
   npm run lint
   ```

## Testing Methodology

This repository enables systematic testing of:
- **Rule adherence**: How well each tool follows project-specific guidelines
- **Code quality**: Consistency in generated code across different tools
- **Integration**: How tools work with existing project structures
- **Performance**: Speed and efficiency of code generation and modification
- **Context understanding**: How well tools understand and apply project context
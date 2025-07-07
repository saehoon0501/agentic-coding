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

## Rule Format Comparison

| Tool | File Format | Location | Scope Control | Version Control | Auto-Discovery |
|------|-------------|----------|---------------|-----------------|-----------------|
| Codex | AGENTS.md | Flexible | Directory tree | Manual | Manual |
| Claude | CLAUDE.md | Multiple locations | Automatic | Optional | Automatic |
| Cursor | .mdc files | .cursor/rules | Pattern-based | Built-in | Automatic |

## Contributing

When adding new tools or test scenarios:
1. Create a new directory following the existing structure
2. Copy the `start_template/` as a base
3. Add tool-specific rule files according to the tool's format
4. Update this README with the new tool's specifications
5. Document any unique behaviors or limitations discovered

## Future Enhancements

- Add automated testing scripts for rule compliance
- Include performance benchmarking tools
- Expand sample applications for more complex scenarios
- Add integration tests for multi-tool workflows
- Document best practices for each tool based on testing results

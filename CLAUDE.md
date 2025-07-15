# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Agentic Coding Tools Testing Repository

This repository tests and compares various agentic coding tools and their rule/instruction formats. It contains multiple sub-projects for testing different AI coding assistants.

## Git Worktree Setup for Parallel Tasks

This repository is configured for parallel development using git worktrees. Each task has its own worktree directory:

- `/Users/clover/claudia-task-1` (branch: `claudia/task-1-pause-reset`) - Task 1: Add Pause and Reset controls
- `/Users/clover/claudia-task-2` (branch: `claudia/task-2-sound-alert`) - Task 2: Play sound and show alert when time is up
- `/Users/clover/claudia-task-3` (branch: `claudia/task-3-localstorage`) - Task 3: Store timeboxes in localStorage with history
- `/Users/clover/claudia-task-4` (branch: `claudia/task-4-countdown-animation`) - Task 4: Animate timer countdown circle
- `/Users/clover/claudia-task-5` (branch: `claudia/task-5-dark-mode`) - Task 5: Add dark mode support

**Primary working directory**: `claudia/` folder within each worktree

To work on a specific task:
```bash
cd /Users/clover/claudia-task-[1-5]/claudia
npm install
npm run dev
```

## Repository Structure

```
agentic-coding/
├── claudia/           # Primary development environment (Material-UI + Vite)
├── codex/             # Codex testing environment (not used for current tasks)
├── cursor/            # Cursor testing environment (not used for current tasks)
└── start_template/    # Base template (not used for current tasks)
```

## Development Commands (Within claudia/)

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Architecture Patterns

The claudia project uses:
- **React 19.1.0** with functional components and modern hooks
- **Vite** as build tool and dev server
- **Material-UI** (@mui/material, @mui/icons-material) for UI components
- **ESLint** for code quality
- **Inline styles** used throughout (not CSS modules or styled-components)
- **No external state management** - uses React state only

## Key Files Structure (claudia/)

- `src/main.jsx` - React entry point
- `src/app.jsx` - Root component
- `src/timeboxTimer.jsx` - Core timer component for testing
- `package.json` - Dependencies and scripts
- `vite.config.js` - Vite configuration
- `eslint.config.js` - ESLint rules

## Test Tasks

1. **Task 1**: Add Pause and Reset controls to TimeboxTimer
2. **Task 2**: Play sound and show alert when time is up
3. **Task 3**: Store timeboxes in localStorage with history display
4. **Task 4**: Animate timer countdown circle with SVG/canvas
5. **Task 5**: Add dark mode support with toggle

## Styling Guidelines

- **Primary approach**: Inline styles (existing pattern)
- **Material-UI components**: Use for UI elements when possible
- **Icons**: Must use Material-UI icons (@mui/icons-material)
- **Responsive design**: Ensure components work on mobile and desktop

## React Development Standards

- Use functional components with hooks
- Export default at the bottom of files
- Use descriptive component names in PascalCase
- Keep state as close to where it's used as possible
- Use controlled components for form inputs
- Include dependency arrays in useEffect
- Use arrow functions for event handlers

## Working with Worktrees

To check current worktrees:
```bash
git worktree list
```

To remove a worktree when done:
```bash
git worktree remove /Users/clover/claudia-task-[1-5]
```
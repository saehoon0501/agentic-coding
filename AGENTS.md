
# Project Structure Guide

This is a React + Vite project with Material-UI components. The main structure is:

## Entry Points
- The main entry point is [main.jsx](mdc:codex/src/main.jsx)
- The root component is [app.jsx](mdc:codex/src/app.jsx)
- The core feature is [timeboxTimer.jsx](mdc:codex/src/timeboxTimer.jsx)

## Configuration Files
- Build configuration: [vite.config.js](mdc:codex/vite.config.js)
- Package management: [package.json](mdc:codex/package.json)
- ESLint rules: [eslint.config.js](mdc:codex/eslint.config.js)

## Key Dependencies
- React 19.1.0 with modern hooks
- Material-UI (@mui/material, @mui/icons-material)
- Vite for build tooling
- ESLint for code quality

## Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Architecture Notes
- Uses functional components with hooks
- Inline styles are used throughout for styling
- Clean, minimal UI with focus on usability
- No external state management (uses React state)
- Must use Material-UI for any icons
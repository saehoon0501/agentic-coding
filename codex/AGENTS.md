
# React Development Standards

## Component Structure
- Use functional components with hooks
- Export default at the bottom of the file
- Import React at the top: `import React from 'react';`
- Use descriptive component names in PascalCase

## Hooks Usage
- Use `useState` for local component state
- Use `useEffect` for side effects and cleanup
- Use `useRef` for DOM references and mutable values
- Always include dependency arrays in useEffect

## Code Style
- Use arrow functions for event handlers
- Use template literals for string interpolation
- Use destructuring for props and state
- Keep components focused on a single responsibility

## State Management
- Keep state as close to where it's used as possible
- Use controlled components for form inputs
- Lift state up when multiple components need the same data
- Use callback functions to update parent state

## Performance
- Use React.memo for expensive components
- Use useMemo for expensive calculations
- Use useCallback for stable function references
- Avoid creating objects/arrays in render

## Example Pattern
```jsx
import React, { useState, useEffect, useRef } from 'react';

function MyComponent({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);
  const ref = useRef(null);

  useEffect(() => {
    // Side effect
    return () => {
      // Cleanup
    };
  }, [dependencies]);

  const handleClick = () => {
    setState(newValue);
  };

  return (
    <div>
      {/* JSX content */}
    </div>
  );
}

export default MyComponent;
```


# Material-UI Development Guidelines

## Import Patterns
- Import specific components: `import { Button, TextField } from '@mui/material';`
- Import icons: `import { PlayArrow } from '@mui/icons-material';`
- Import emotion for styled components: `import { styled } from '@mui/material/styles';`

## Component Usage
- Use Material-UI components when available instead of HTML elements
- Prefer `Button` over `<button>`
- Use `TextField` for form inputs
- Use `Box` for layout containers
- Use `Typography` for text styling

## Styling Approaches
1. **sx prop** for simple styles:
   ```jsx
   <Box sx={{ padding: 2, margin: 1 }}>
   ```

2. **styled() function** for reusable components:
   ```jsx
   const StyledButton = styled(Button)(({ theme }) => ({
     backgroundColor: theme.palette.primary.main,
   }));
   ```

3. **Inline styles** for dynamic styling (as used in timeboxTimer):
   ```jsx
   <div style={{ background: isActive ? '#fff' : '#f0f0f0' }}>
   ```

## Theme Integration
- Use theme spacing: `theme.spacing(1)` instead of hardcoded pixels
- Use theme palette: `theme.palette.primary.main`
- Use theme breakpoints: `theme.breakpoints.up('md')`

## Accessibility
- Use proper ARIA labels
- Ensure keyboard navigation works
- Use semantic HTML elements
- Provide alt text for images

## Performance
- Import only what you need
- Use dynamic imports for large components
- Consider bundle size impact

## Current Project Notes
- The project uses inline styles extensively in [timeboxTimer.jsx](mdc:start_template/src/timeboxTimer.jsx)
- Material-UI is installed but not heavily used yet
- Consider migrating inline styles to MUI components for consistency
- Must use Material-UI for any icons


# ESLint Compliance Guidelines

## Current ESLint Configuration
The project uses a modern ESLint setup as defined in [eslint.config.js](mdc:start_template/eslint.config.js):

- **Base**: `@eslint/js` recommended rules
- **React Hooks**: `eslint-plugin-react-hooks` recommended-latest
- **React Refresh**: `eslint-plugin-react-refresh` vite configuration
- **ECMAScript**: 2020 with latest features
- **Environment**: Browser globals

## Key Rules to Follow

### Variable Naming
- Use camelCase for variables and functions
- Use PascalCase for components and constructors
- Constants in UPPER_SNAKE_CASE are allowed (varsIgnorePattern: '^[A-Z_]')

### React Hooks Rules
- Call hooks only at the top level of functions
- Don't call hooks inside loops, conditions, or nested functions
- Use `useEffect` dependencies correctly
- Follow rules of hooks consistently

### React Refresh Rules
- Export components as default exports
- Ensure fast refresh works properly
- Avoid exporting non-component functions from component files

### Code Quality
- Remove unused variables (except those matching `^[A-Z_]` pattern)
- Use consistent indentation
- Prefer `const` over `let` when possible
- Use template literals for string concatenation

## Running ESLint
```bash
npm run lint          # Check for linting errors
npm run lint -- --fix # Auto-fix fixable errors
```

## Common Patterns to Avoid
```javascript
// ❌ Bad
let unused = 'value';
function MyComponent() {
  if (condition) {
    useEffect(() => {}, []); // Hooks in conditions
  }
}

// ✅ Good
const MY_CONSTANT = 'value'; // Uppercase constant
function MyComponent() {
  useEffect(() => {
    if (condition) {
      // Logic inside effect
    }
  }, [condition]);
}
```

## Integration with Cursor
- ESLint errors will show in the editor
- Use Cursor's quick fix suggestions
- Run linting before committing code
- Fix linting errors immediately when they appear


# Tailwind CSS Development Guidelines

## Setup and Configuration
- Tailwind CSS v4.1.11 is installed in the project
- Works alongside Material-UI - use strategically to avoid conflicts
- Import Tailwind directives in your main CSS file: `@tailwind base; @tailwind components; @tailwind utilities;`

## Core Principles
- **Utility-first approach**: Build designs using utility classes
- **Responsive design**: Use responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`)
- **Consistency**: Use Tailwind's design tokens for spacing, colors, and sizing

## Common Utility Patterns

### Layout & Spacing
```jsx
// Flexbox layouts
<div className="flex items-center justify-between">
<div className="flex flex-col space-y-4">

// Grid layouts
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Padding and margins
<div className="p-4 m-2">        // padding: 1rem, margin: 0.5rem
<div className="px-6 py-3">      // padding-x: 1.5rem, padding-y: 0.75rem
```

### Colors and Styling
```jsx
// Background colors
<div className="bg-blue-500 hover:bg-blue-600">
<div className="bg-gradient-to-r from-blue-500 to-purple-600">

// Text colors
<span className="text-gray-800 dark:text-gray-200">
<h1 className="text-3xl font-bold text-center">
```

### Responsive Design
```jsx
// Mobile-first responsive design
<div className="text-sm sm:text-base md:text-lg lg:text-xl">
<div className="hidden md:block">        // Hidden on mobile, visible on desktop
<div className="block md:hidden">        // Visible on mobile, hidden on desktop
```

## Integration with Material-UI
- **Coexistence strategy**: Use Tailwind for layout and spacing, Material-UI for complex components
- **Avoid conflicts**: Don't apply Tailwind classes that override Material-UI component styles
- **Utility classes**: Use Tailwind utilities for margin, padding, and positioning around MUI components

```jsx
// Good: Using Tailwind for layout around MUI components
<div className="flex items-center space-x-4 p-6">
  <Button variant="contained">MUI Button</Button>
  <TextField label="MUI Input" />
</div>

// Avoid: Overriding MUI component internals
<Button className="bg-red-500"> // This conflicts with MUI's styling
```

## Best Practices

### Performance
- Use PurgeCSS configuration to remove unused styles
- Group related utilities: `flex items-center justify-between` instead of scattered classes
- Use `@apply` directive for frequently repeated utility combinations

### Maintainability
- Create component classes for complex repeated patterns:
```css
.btn-primary {
  @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors;
}
```

### Accessibility
- Use semantic HTML with Tailwind classes
- Ensure proper color contrast: `bg-blue-500 text-white`
- Use focus utilities: `focus:ring-2 focus:ring-blue-500 focus:outline-none`

## Common Utility Classes

### Sizing
- `w-full`, `h-full`, `w-1/2`, `h-64`
- `max-w-md`, `max-w-lg`, `max-w-xl`
- `min-h-screen`, `min-w-0`

### Positioning
- `relative`, `absolute`, `fixed`, `sticky`
- `top-0`, `right-0`, `bottom-0`, `left-0`
- `z-10`, `z-20`, `z-50`

### Effects
- `shadow-sm`, `shadow-md`, `shadow-lg`
- `rounded`, `rounded-md`, `rounded-lg`, `rounded-full`
- `transition-all`, `duration-300`, `ease-in-out`

## Project Integration Notes
- Current project uses inline styles in [timeboxTimer.jsx](mdc:codex/src/timeboxTimer.jsx)
- Consider migrating repetitive inline styles to Tailwind utilities
- Use Tailwind for layout and spacing, Material-UI for interactive components
- Ensure responsive design for timer interface
- Apply consistent spacing and typography throughout the app

## Development Workflow
1. Start with Tailwind utilities for layout and basic styling
2. Use Material-UI components for complex interactive elements
3. Apply responsive design principles from mobile-first
4. Test across different screen sizes
5. Optimize for performance by removing unused styles

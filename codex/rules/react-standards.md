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

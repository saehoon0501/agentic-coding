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

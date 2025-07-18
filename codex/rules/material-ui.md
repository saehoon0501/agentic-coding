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

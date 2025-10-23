# Design Guidelines

This document outlines the design principles, color palette, typography, and component guidelines for Data Tools.

## Design Principles

### 1. Consistency
- Use the same components, colors, and spacing throughout
- Follow established patterns for similar interactions
- Maintain visual hierarchy across all tools

### 2. Clarity
- Keep interfaces clean and uncluttered
- Use clear, descriptive labels
- Provide helpful tooltips and descriptions

### 3. Responsiveness
- Design mobile-first
- Test on multiple screen sizes
- Ensure touch-friendly tap targets (minimum 44x44px)

### 4. Accessibility
- Maintain sufficient color contrast (WCAG AA minimum)
- Support keyboard navigation
- Include descriptive ARIA labels

## Color Palette

All colors are defined in `src/config/theme.js` and available as CSS variables.

### Primary Colors

```css
--primary: #6366f1        /* Indigo - Main brand color */
--primary-dark: #4f46e5   /* Darker indigo for hover states */
--primary-light: #818cf8  /* Lighter indigo for backgrounds */
```

**Usage**: Primary actions, links, active states

### Secondary Colors

```css
--secondary: #8b5cf6      /* Purple - Secondary actions */
--accent: #ec4899         /* Pink - Accent color */
```

**Usage**: Secondary buttons, highlights, decorative elements

### Semantic Colors

```css
--success: #10b981        /* Green - Success states */
--warning: #f59e0b        /* Amber - Warning states */
--error: #ef4444          /* Red - Error states */
--info: #3b82f6           /* Blue - Info states */
```

**Usage**: Status indicators, alerts, feedback messages

### Neutral Colors

```css
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-200: #e5e7eb
--gray-300: #d1d5db
--gray-400: #9ca3af
--gray-500: #6b7280
--gray-600: #4b5563
--gray-700: #374151
--gray-800: #1f2937
--gray-900: #111827
```

**Usage**: Text, borders, backgrounds

### Text Colors

```css
--text: #1f2937           /* Primary text */
--text-secondary: #6b7280 /* Secondary text */
--text-light: #9ca3af     /* Tertiary text */
```

### Backgrounds

```css
--background: #ffffff     /* Main background */
--surface: #f8fafc        /* Card/surface background */
```

## Typography

### Font Families

```css
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
--font-mono: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, monospace
```

**Usage**:
- `--font-sans`: Default for all text
- `--font-mono`: Code, data output, technical values

### Font Sizes

```css
--font-xs: 0.75rem    /* 12px */
--font-sm: 0.875rem   /* 14px */
--font-base: 1rem     /* 16px */
--font-lg: 1.125rem   /* 18px */
--font-xl: 1.25rem    /* 20px */
--font-2xl: 1.5rem    /* 24px */
--font-3xl: 1.875rem  /* 30px */
--font-4xl: 2.25rem   /* 36px */
--font-5xl: 3rem      /* 48px */
```

### Font Weights

```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### Heading Scale

```css
h1 { font-size: 3rem; font-weight: 600; }      /* 48px */
h2 { font-size: 2.25rem; font-weight: 600; }   /* 36px */
h3 { font-size: 1.875rem; font-weight: 600; }  /* 30px */
h4 { font-size: 1.5rem; font-weight: 600; }    /* 24px */
h5 { font-size: 1.25rem; font-weight: 600; }   /* 20px */
h6 { font-size: 1.125rem; font-weight: 600; }  /* 18px */
```

**Mobile adjustments**: Reduce heading sizes by 20-30% on screens < 768px

## Spacing

Use consistent spacing throughout your tools:

```css
--spacing-xs: 0.25rem    /* 4px */
--spacing-sm: 0.5rem     /* 8px */
--spacing-md: 1rem       /* 16px */
--spacing-lg: 1.5rem     /* 24px */
--spacing-xl: 2rem       /* 32px */
--spacing-2xl: 3rem      /* 48px */
--spacing-3xl: 4rem      /* 64px */
```

### Spacing Guidelines

- **Between sections**: `--spacing-2xl` or `--spacing-3xl`
- **Between elements**: `--spacing-lg` or `--spacing-xl`
- **Within components**: `--spacing-md`
- **Small gaps**: `--spacing-sm` or `--spacing-xs`

## Border Radius

```css
--radius-sm: 0.25rem     /* 4px */
--radius-md: 0.5rem      /* 8px */
--radius-lg: 0.75rem     /* 12px */
--radius-xl: 1rem        /* 16px */
--radius-2xl: 1.5rem     /* 24px */
--radius-full: 9999px    /* Fully rounded */
```

**Usage**:
- Cards: `--radius-lg` or `--radius-xl`
- Buttons: `--radius-md`
- Inputs: `--radius-md`
- Badges/Pills: `--radius-full`

## Shadows

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)
```

**Usage**:
- Cards: `--shadow-base`
- Hover states: `--shadow-lg`
- Modals/Overlays: `--shadow-xl`
- Subtle elevation: `--shadow-sm`

## Transitions

```css
--transition-fast: 150ms
--transition-base: 200ms
--transition-slow: 300ms
```

**Usage**:
- Hover effects: `--transition-base`
- Color changes: `--transition-fast`
- Transforms: `--transition-base`

**Example**:
```css
.button {
  transition: all var(--transition-base);
}
```

## Components

### Button

Available variants:
- `primary` - Main actions (gradient background)
- `secondary` - Secondary actions (purple gradient)
- `outline` - Tertiary actions (outlined)
- `ghost` - Subtle actions (transparent)

Available sizes:
- `sm` - Small (0.5rem 1rem padding)
- `md` - Medium (0.75rem 1.5rem padding)
- `lg` - Large (1rem 2rem padding)

**Example**:
```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

### Card

Simple container with shadow and rounded corners.

**Props**:
- `hover` - Adds hover effect (lift + shadow)

**Example**:
```jsx
<Card hover>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

### Input

Styled input with label and error support.

**Props**:
- `label` - Label text
- `type` - Input type (text, number, etc.)
- `error` - Error message (displays in red)

**Example**:
```jsx
<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={emailError}
/>
```

## Layout Patterns

### Page Structure

All tools should follow this structure:

```jsx
<div className="tool-name">
  <div className="container">
    {/* Page Header */}
    <div className="page-header">
      <h1>Tool Name</h1>
      <p className="page-description">Brief description</p>
    </div>

    {/* Controls */}
    <Card>
      <h2>Configuration</h2>
      {/* Inputs and controls */}
    </Card>

    {/* Visualization */}
    <Card>
      <h2>Results</h2>
      {/* Charts, outputs, etc. */}
    </Card>
  </div>
</div>
```

### Grid Layouts

Use CSS Grid for responsive layouts:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}
```

### Container

Use the `.container` class for consistent max-width and padding:

```css
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}
```

## Responsive Design

### Breakpoints

```css
--breakpoint-sm: 640px
--breakpoint-md: 768px
--breakpoint-lg: 1024px
--breakpoint-xl: 1280px
--breakpoint-2xl: 1536px
```

### Mobile-First Approach

Write styles for mobile first, then add media queries for larger screens:

```css
/* Mobile (default) */
.element {
  flex-direction: column;
  font-size: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .element {
    flex-direction: row;
    font-size: 1.125rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .element {
    font-size: 1.25rem;
  }
}
```

### Common Responsive Patterns

**Stack on mobile, side-by-side on desktop**:
```css
.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
}

@media (min-width: 768px) {
  .layout {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

**Hide on mobile**:
```css
.desktop-only {
  display: none;
}

@media (min-width: 768px) {
  .desktop-only {
    display: block;
  }
}
```

## Accessibility

### Color Contrast

Ensure text meets WCAG AA standards:
- Normal text: 4.5:1 minimum
- Large text (18px+): 3:1 minimum

### Focus States

Always provide visible focus indicators:
```css
.button:focus {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
```

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Use `tabIndex` appropriately
- Provide keyboard shortcuts where beneficial

### ARIA Labels

Add ARIA labels for screen readers:
```jsx
<button aria-label="Close modal">
  <X size={20} />
</button>
```

## Animation Guidelines

### Use Sparingly

Animate only when it enhances UX:
- State transitions
- Feedback responses
- Loading states

### Performance

- Use `transform` and `opacity` for animations (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`

### Example

```css
.card {
  transition: transform var(--transition-base);
}

.card:hover {
  transform: translateY(-4px);
}
```

## Data Visualization

### Chart Colors

Use colors from the theme palette:
```javascript
const chartColors = [
  '#6366f1',  // primary
  '#8b5cf6',  // secondary
  '#ec4899',  // accent
  '#10b981',  // success
  '#f59e0b',  // warning
];
```

### Chart Margins

Provide adequate spacing:
```javascript
<ResponsiveContainer width="100%" height={400}>
  <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
    {/* ... */}
  </LineChart>
</ResponsiveContainer>
```

### Responsive Charts

Always wrap charts in `ResponsiveContainer`:
```jsx
<ResponsiveContainer width="100%" height={400}>
  <YourChart />
</ResponsiveContainer>
```

## Best Practices Summary

1. **Always use theme variables** instead of hardcoded values
2. **Design mobile-first** then enhance for larger screens
3. **Test on multiple devices** before submitting
4. **Maintain consistency** with existing tools
5. **Keep it simple** - clarity over complexity
6. **Consider accessibility** in every design decision
7. **Use existing components** whenever possible
8. **Document custom patterns** if you create something new

## Need Help?

- Review existing tools for examples
- Check the [Adding Tools Guide](./ADDING_TOOLS.md)
- Open an issue on GitHub

---

Remember: Consistent design creates a better user experience!

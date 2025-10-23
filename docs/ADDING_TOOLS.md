# Adding a New Tool

This guide will walk you through the process of adding a new tool to the Data Tools collection.

## Overview

Each tool is a self-contained React component with its own folder. Tools are automatically registered in the landing page through a central registry.

## Step-by-Step Guide

### 1. Create Tool Folder

Create a new folder for your tool in `src/tools/`:

```bash
mkdir -p src/tools/your-tool-name
```

### 2. Create Tool Component

Create your main component file `src/tools/your-tool-name/YourToolName.jsx`:

```jsx
import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Input from '../../components/Input';
import './YourToolName.css';

const YourToolName = () => {
  const [value, setValue] = useState(0);

  return (
    <div className="your-tool-name">
      <div className="container">
        <div className="page-header">
          <h1>Your Tool Name</h1>
          <p className="page-description">
            Brief description of what your tool does.
          </p>
        </div>

        <Card>
          <h2>Controls</h2>
          <Input
            label="Parameter"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button onClick={() => console.log('Action')}>
            Do Something
          </Button>
        </Card>

        <Card>
          <h2>Results</h2>
          {/* Your visualization or results here */}
        </Card>
      </div>
    </div>
  );
};

export default YourToolName;
```

### 3. Create Tool Styles

Create `src/tools/your-tool-name/YourToolName.css`:

```css
.your-tool-name {
  padding: 3rem 0;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  margin-bottom: 0.5rem;
}

.page-description {
  color: var(--text-secondary);
  font-size: 1.125rem;
  max-width: 800px;
}

/* Add your custom styles here */

/* Mobile responsive styles */
@media (max-width: 768px) {
  .your-tool-name {
    padding: 2rem 0;
  }

  .page-header h1 {
    font-size: 2rem;
  }
}
```

### 4. Register Your Tool

Edit `src/config/tools.js` to register your tool:

```javascript
// 1. Import your component
import YourToolName from '../tools/your-tool-name/YourToolName';

// 2. Import an icon (from lucide-react)
import { YourIcon } from 'lucide-react';

// 3. Add to the tools array
export const tools = [
  // ... existing tools
  {
    id: 'your-tool-name',
    name: 'Your Tool Display Name',
    description: 'Brief description for the landing page card',
    icon: YourIcon,
    path: '/tools/your-tool-name',
    component: YourToolName,
    category: 'category-name', // e.g., 'statistics', 'visualization', 'data-processing'
    tags: ['tag1', 'tag2', 'tag3'], // Searchable tags
  },
];
```

### 5. Test Your Tool

1. Start the development server:
```bash
npm run dev
```

2. Navigate to your tool:
   - From the homepage, find your tool card
   - Or directly visit `http://localhost:5173/tools/your-tool-name`

3. Test on different screen sizes:
   - Desktop: Full width browser
   - Tablet: Resize to ~768px
   - Mobile: Resize to ~375px

## Best Practices

### Component Structure

1. **Use Reusable Components**: Import and use existing components (Button, Card, Input) for consistency
2. **Organize Your Code**: Separate logic, rendering, and styling
3. **State Management**: Use React hooks (useState, useMemo, useEffect) appropriately

### Styling

1. **Use Theme Variables**: Always use CSS variables from the theme
   ```css
   color: var(--primary);
   padding: var(--spacing-md);
   border-radius: var(--radius-md);
   ```

2. **Mobile First**: Design for mobile, then enhance for desktop
3. **Consistent Spacing**: Use spacing variables (--spacing-xs, --spacing-sm, etc.)

### Performance

1. **Memoize Expensive Calculations**: Use `useMemo` for heavy computations
2. **Optimize Re-renders**: Use `React.memo` when appropriate
3. **Lazy Load Heavy Dependencies**: Use dynamic imports for large libraries

### Accessibility

1. **Semantic HTML**: Use appropriate HTML elements (button, input, etc.)
2. **Labels**: Always provide labels for form inputs
3. **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
4. **ARIA Attributes**: Add aria-labels where needed

## Example: Data Transformation Tool

Here's a complete example of a simple data transformation tool:

### Component (`src/tools/data-transform/DataTransform.jsx`)

```jsx
import React, { useState, useMemo } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Download } from 'lucide-react';
import './DataTransform.css';

const DataTransform = () => {
  const [input, setInput] = useState('');

  const transformed = useMemo(() => {
    return input.toUpperCase();
  }, [input]);

  const handleDownload = () => {
    const blob = new Blob([transformed], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transformed.txt';
    a.click();
  };

  return (
    <div className="data-transform">
      <div className="container">
        <div className="page-header">
          <h1>Data Transform</h1>
          <p className="page-description">
            Transform your text data with simple operations.
          </p>
        </div>

        <div className="transform-grid">
          <Card>
            <h2>Input</h2>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text here..."
              rows={10}
              className="transform-textarea"
            />
          </Card>

          <Card>
            <h2>Output</h2>
            <textarea
              value={transformed}
              readOnly
              rows={10}
              className="transform-textarea"
            />
            <Button onClick={handleDownload}>
              <Download size={20} />
              Download
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataTransform;
```

### Styles (`src/tools/data-transform/DataTransform.css`)

```css
.data-transform {
  padding: 3rem 0;
  min-height: 100vh;
}

.transform-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.transform-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  margin-bottom: 1rem;
  resize: vertical;
}

.transform-textarea:focus {
  outline: none;
  border-color: var(--primary);
}

@media (max-width: 768px) {
  .transform-grid {
    grid-template-columns: 1fr;
  }
}
```

### Registration (`src/config/tools.js`)

```javascript
import { FileText } from 'lucide-react';
import DataTransform from '../tools/data-transform/DataTransform';

export const tools = [
  // ... other tools
  {
    id: 'data-transform',
    name: 'Data Transform',
    description: 'Transform your text data with simple operations.',
    icon: FileText,
    path: '/tools/data-transform',
    component: DataTransform,
    category: 'data-processing',
    tags: ['transform', 'text', 'processing'],
  },
];
```

## Categories

Use one of these standard categories:
- `statistics` - Statistical analysis tools
- `visualization` - Data visualization tools
- `data-processing` - Data transformation and processing
- `machine-learning` - ML and AI tools
- `utilities` - General utility tools

Or create a new category if none fit your tool.

## Icons

Browse available icons at [Lucide Icons](https://lucide.dev/icons/).

Import only the icons you need:
```javascript
import { IconName } from 'lucide-react';
```

## Need Help?

- Check existing tools in `src/tools/` for examples
- Review the [Design Guidelines](./DESIGN_GUIDELINES.md)
- Open an issue on GitHub for questions

## Checklist

Before submitting your tool:

- [ ] Component created in `src/tools/your-tool-name/`
- [ ] Styles follow theme guidelines
- [ ] Tool registered in `src/config/tools.js`
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] All interactive elements are keyboard accessible
- [ ] No console errors or warnings
- [ ] Tool works with production build (`npm run build`)

---

Happy coding! We're excited to see what you build!

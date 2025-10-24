// Tools Registry
// Add your tools here to register them in the landing page

import { Activity, Layers, Calculator } from 'lucide-react';

// Import tool components here
import NormalDistribution from '../tools/normal-distribution/NormalDistribution';
import EllipticalDistribution from '../tools/elliptical-distribution/EllipticalDistribution';
import CostAveraging from '../tools/cost-averaging/CostAveraging';

// Tool Registry
// Each tool should have:
// - id: unique identifier
// - name: display name
// - description: short description for the landing page
// - icon: Lucide React icon component
// - path: URL path for routing
// - component: React component
// - category: tool category (statistics, visualization, data-processing, etc.)
// - tags: array of searchable tags

export const tools = [
  {
    id: 'normal-distribution',
    name: 'Normal Distribution Explorer',
    description: 'Explore and visualize normal distributions with interactive controls. Generate, plot, and analyze distributions for 1, 2, and 3 variables.',
    icon: Activity,
    path: '/tools/normal-distribution',
    component: NormalDistribution,
    category: 'statistics',
    tags: ['statistics', 'probability', 'distribution', 'visualization', 'gaussian'],
  },
  {
    id: 'elliptical-distribution',
    name: 'Elliptical Distribution Explorer for MSPC',
    description: 'Interactive tool for exploring elliptical distributions with multivariate statistical process control. Visualize density functions, KDE, marginal distributions, and Hotelling T² monitoring.',
    icon: Layers,
    path: '/tools/elliptical-distribution',
    component: EllipticalDistribution,
    category: 'statistics',
    tags: ['statistics', 'multivariate', 'mspc', 'elliptical', 'hotelling', 'mahalanobis', 'spc', 'quality-control'],
  },
  {
    id: 'cost-averaging',
    name: 'Portfolio Averaging Tool',
    description: 'Smart calculator to find how many shares to buy to reach your target average price. Features smart defaults, quick adjustments, and mobile-friendly interface.',
    icon: Calculator,
    path: '/tools/cost-averaging',
    component: CostAveraging,
    category: 'utilities',
    tags: ['finance', 'stocks', 'investing', 'portfolio', 'calculator', 'averaging', 'shares', 'DCA'],
  },
  // Add more tools here as they are developed
  // Example:
  // {
  //   id: 'tool-name',
  //   name: 'Tool Display Name',
  //   description: 'Brief description of what this tool does',
  //   icon: IconComponent,
  //   path: '/tools/tool-name',
  //   component: ToolComponent,
  //   category: 'category-name',
  //   tags: ['tag1', 'tag2'],
  // },
];

// Get all unique categories
export const getCategories = () => {
  const categories = new Set(tools.map(tool => tool.category));
  return Array.from(categories);
};

// Get tools by category
export const getToolsByCategory = (category) => {
  return tools.filter(tool => tool.category === category);
};

// Search tools by query
export const searchTools = (query) => {
  const lowerQuery = query.toLowerCase();
  return tools.filter(tool =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export default tools;

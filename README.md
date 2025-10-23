# Data Tools

A modern collection of interactive data analysis and visualization tools built with React and Vite.

Live site: [data-tools.alabsi.space](https://data-tools.alabsi.space)

## Features

- Modern, responsive design that works on desktop and mobile
- Interactive data tools with real-time visualization
- Modular architecture for easy tool addition
- Consistent theming across all tools
- Automatic deployment via GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/data-tools.git
cd data-tools
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Available Tools

See available tools listed in the file [Tools.md](./Tools.md)

## Documentation

- [Adding a New Tool](./docs/ADDING_TOOLS.md) - Step-by-step guide to create and add new tools
- [Theme & Design Guidelines](./docs/DESIGN_GUIDELINES.md) - Design principles and styling guidelines

## Development Guidelines

### Adding a New Tool

See [docs/ADDING_TOOLS.md](./docs/ADDING_TOOLS.md) for detailed instructions on how to add a new tool to the collection.

### Theme and Styling

All tools should follow the theme and design guidelines documented in [docs/DESIGN_GUIDELINES.md](./docs/DESIGN_GUIDELINES.md).

Key principles:
- Use the theme configuration in `src/config/theme.js`
- Maintain consistent spacing and typography
- Ensure mobile responsiveness
- Follow the established color palette

## Deployment

The site automatically deploys to GitHub Pages when changes are pushed to the `main` branch.

### Manual Deployment

1. Ensure GitHub Pages is enabled in repository settings
2. Push to the `main` branch
3. GitHub Actions will automatically build and deploy

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **GitHub Actions** - CI/CD

## License

MIT License - feel free to use this project for your own purposes.

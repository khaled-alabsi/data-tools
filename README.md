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

### Normal Distribution Explorer

Explore and visualize normal (Gaussian) distributions with interactive controls:
- 1D and 2D distribution visualization
- Multiple distribution comparison
- Random sample generation
- Statistical analysis
- Correlation exploration

## Project Structure

```
data-tools/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── public/                     # Static assets
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Header.jsx
│   │   ├── Home.jsx           # Landing page
│   │   └── ToolCard.jsx
│   ├── config/
│   │   ├── theme.js           # Theme configuration
│   │   └── tools.js           # Tool registry
│   ├── styles/
│   │   └── index.css          # Global styles
│   ├── tools/                 # Tool implementations
│   │   └── normal-distribution/
│   │       ├── NormalDistribution.jsx
│   │       └── NormalDistribution.css
│   ├── App.jsx                # Main app component
│   └── main.jsx              # Entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

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

### Custom Domain Setup

To use a custom domain (data-tools.alabsi.space):

1. Add a CNAME record pointing to `yourusername.github.io`
2. Enable custom domain in GitHub Pages settings
3. Wait for DNS propagation

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **GitHub Actions** - CI/CD

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-tool`)
3. Follow the [tool development guide](./docs/ADDING_TOOLS.md)
4. Ensure your code follows the [design guidelines](./docs/DESIGN_GUIDELINES.md)
5. Commit your changes (`git commit -m 'Add amazing tool'`)
6. Push to the branch (`git push origin feature/amazing-tool`)
7. Open a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Built with ❤️ using React and Vite

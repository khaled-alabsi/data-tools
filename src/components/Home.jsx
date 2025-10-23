import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import ToolCard from './ToolCard';
import Input from './Input';
import { tools, searchTools, getCategories } from '../config/tools';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...getCategories()];

  const filteredTools = React.useMemo(() => {
    let result = tools;

    if (searchQuery) {
      result = searchTools(searchQuery);
    }

    if (selectedCategory !== 'all') {
      result = result.filter(tool => tool.category === selectedCategory);
    }

    return result;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Modern Data Analysis Tools</span>
            </div>
            <h1 className="hero-title">
              Powerful Tools for
              <br />
              <span className="hero-gradient">Data Analysis & Visualization</span>
            </h1>
            <p className="hero-description">
              A curated collection of interactive data tools built with modern web technologies.
              Explore, analyze, and visualize data right in your browser.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="tools-section">
        <div className="container">
          {/* Search and Filter */}
          <div className="tools-controls">
            <div className="search-wrapper">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="tools-grid">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No tools found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p className="footer-text">
            Built with React & Vite. Add your own tools and contribute!
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Card from './Card';
import './ToolCard.css';

const ToolCard = ({ tool }) => {
  const Icon = tool.icon;

  return (
    <Link to={tool.path} className="tool-card-link">
      <Card hover className="tool-card">
        <div className="tool-card-icon">
          <Icon size={32} />
        </div>
        <h3 className="tool-card-title">{tool.name}</h3>
        <p className="tool-card-description">{tool.description}</p>
        <div className="tool-card-footer">
          <div className="tool-card-tags">
            {tool.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="tool-card-tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="tool-card-arrow">
            <ArrowRight size={20} />
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ToolCard;

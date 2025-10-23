import React from 'react';
import './Card.css';

const Card = ({ children, className = '', hover = false, ...props }) => {
  const classNames = [
    'card',
    hover && 'card-hover',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
};

export default Card;

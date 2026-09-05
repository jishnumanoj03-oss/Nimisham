import React from 'react';

const DifficultyBadge = ({ level, className = '' }) => {
  const styles = {
    Beginner: 'bg-green-500/10 text-green-500 border-green-500/20',
    Intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    Advanced: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    Professional: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const style = styles[level] || styles.Beginner;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style} ${className}`}>
      {level || 'Beginner'}
    </span>
  );
};

export default DifficultyBadge;

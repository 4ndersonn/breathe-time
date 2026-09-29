import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2 } } : undefined}
      onClick={onClick}
      className={`rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </motion.div>
  );
};

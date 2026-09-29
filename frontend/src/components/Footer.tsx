import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-border/80 bg-card/40 backdrop-blur-md py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Breathe Time Analytics • Portfolio v1.0</span>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
          Desenvolvido para análise de comportamento e suporte social global.
        </div>
      </div>
    </footer>
  );
};

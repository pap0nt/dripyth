import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-primary/20 mt-16">
      <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center">
        <p className="text-sm text-gray-400">
          PIRB. All rights reserved 2024
        </p>
        <Link 
          to="https://temple.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          TEMPLE
        </Link>
      </div>
    </footer>
  );
}
import React from 'react';
import { TShirtModel, TSHIRT_MODELS } from '../types';
import { useDesignStore } from '../store';

export function ModelSelector() {
  const { selectedModel, setSelectedModel } = useDesignStore();

  return (
    <div className="p-6 border-b border-primary/20">
      <h2 className="text-lg font-michroma text-white mb-6">Model Selection</h2>
      
      <div className="space-y-6">
        {/* Style selector */}
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-3">Style</label>
          <div className="grid grid-cols-2 gap-3">
            {['oversized', 'slim'].map((style) => (
              <button
                key={style}
                onClick={() => {
                  const newModel = TSHIRT_MODELS.find(
                    m => m.style === style && m.color === selectedModel.color
                  );
                  if (newModel) setSelectedModel(newModel.id);
                }}
                className={`
                  relative px-4 py-3 rounded-lg border transition-all duration-300
                  ${selectedModel.style === style 
                    ? 'border-primary text-white bg-primary/10 shadow-[0_0_15px_rgba(109,40,217,0.2)]' 
                    : 'border-primary/20 text-gray-400 hover:border-primary/40 hover:bg-primary/5'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-mono">
                    {style}
                  </span>
                  {selectedModel.style === style && (
                    <div className="absolute inset-0 border-2 border-primary rounded-lg animate-pulse opacity-30" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Color selector */}
        <div>
          <label className="block text-sm font-mono text-gray-400 mb-3">Color</label>
          <div className="grid grid-cols-2 gap-3">
            {['white', 'black'].map((color) => (
              <button
                key={color}
                onClick={() => {
                  const newModel = TSHIRT_MODELS.find(
                    m => m.color === color && m.style === selectedModel.style
                  );
                  if (newModel) setSelectedModel(newModel.id);
                }}
                className={`
                  relative px-4 py-3 rounded-lg border transition-all duration-300
                  ${selectedModel.color === color 
                    ? 'border-primary text-white bg-primary/10 shadow-[0_0_15px_rgba(109,40,217,0.2)]' 
                    : 'border-primary/20 text-gray-400 hover:border-primary/40 hover:bg-primary/5'
                  }
                `}
              >
                <div className="flex flex-col items-center gap-2">
                  <div 
                    className={`w-4 h-4 rounded-full border ${
                      color === 'white' 
                        ? 'bg-white border-gray-300' 
                        : 'bg-black border-gray-700'
                    }`} 
                  />
                  <span className="text-xs uppercase tracking-wider font-mono">
                    {color}
                  </span>
                  {selectedModel.color === color && (
                    <div className="absolute inset-0 border-2 border-primary rounded-lg animate-pulse opacity-30" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
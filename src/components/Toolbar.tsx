import React, { useState } from 'react';
import { Save, RotateCcw, Trash2, FlipHorizontal, ArrowUp, ArrowDown, Type, RefreshCw } from 'lucide-react';
import { useDesignStore } from '../store';
import { SaveDesignModal } from './SaveDesignModal';

const FONTS = [
  { label: 'Arial', value: 'Arial' },
  { label: 'Times New Roman', value: 'Times New Roman' },
  { label: 'Courier New', value: 'Courier New' },
  { label: 'Georgia', value: 'Georgia' },
  { label: 'Verdana', value: 'Verdana' },
  { label: 'Impact', value: 'Impact' },
];

export function Toolbar() {
  const [isSaveModalOpen, setSaveModalOpen] = useState(false);
  const { 
    selectedId, 
    layers, 
    isBackView, 
    updateLayer, 
    removeLayer, 
    resetLayers, 
    addLayer, 
    toggleSide 
  } = useDesignStore();

  const currentLayers = isBackView ? layers.back : layers.front;
  const selectedLayer = selectedId ? currentLayers.find(l => l.id === selectedId) : null;

  const handleFlip = () => {
    if (!selectedId) return;
    const layer = currentLayers.find(l => l.id === selectedId);
    if (layer) {
      updateLayer(selectedId, { 
        flipped: !layer.flipped,
        x: layer.x + (layer.flipped ? -1 : 1) * layer.width * layer.scaleX
      }, isBackView ? 'back' : 'front');
    }
  };

  const handleLayerOrder = (direction: 'up' | 'down') => {
    if (!selectedId) return;
    const currentIndex = currentLayers.findIndex(l => l.id === selectedId);
    
    if (direction === 'up' && currentIndex < currentLayers.length - 1) {
      const newLayers = [...currentLayers];
      [newLayers[currentIndex], newLayers[currentIndex + 1]] = 
      [newLayers[currentIndex + 1], newLayers[currentIndex]];
      
      useDesignStore.setState({ 
        layers: {
          ...layers,
          [isBackView ? 'back' : 'front']: newLayers
        }
      });
    } else if (direction === 'down' && currentIndex > 0) {
      const newLayers = [...currentLayers];
      [newLayers[currentIndex], newLayers[currentIndex - 1]] = 
      [newLayers[currentIndex - 1], newLayers[currentIndex]];
      
      useDesignStore.setState({ 
        layers: {
          ...layers,
          [isBackView ? 'back' : 'front']: newLayers
        }
      });
    }
  };

  const handleAddText = () => {
    const newId = Date.now().toString();
    addLayer({
      id: newId,
      type: 'text',
      text: 'PYTH',
      fontSize: 24,
      fontFamily: 'Arial',
      fill: '#ffffff',
      x: 400,
      y: 500,
      width: 100,
      height: 30,
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      zIndex: currentLayers.length,
      flipped: false,
    }, isBackView ? 'back' : 'front');
  };

  return (
    <>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-[#1a1a24] rounded-full shadow-[0_0_20px_rgba(109,40,217,0.3)] px-6 py-3 flex gap-4">
        <button
          onClick={() => setSaveModalOpen(true)}
          className="p-2 hover:bg-primary/20 rounded-full transition-colors text-[#fff]"
          title="Save Design"
        >
          <Save className="w-5 h-5" />
        </button>
        
        <button
          onClick={resetLayers}
          className="p-2 hover:bg-primary/20 rounded-full transition-colors text-[#fff]"
          title="Reset Canvas"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={handleAddText}
          className="p-2 hover:bg-primary/20 rounded-full transition-colors text-[#fff]"
          title="Add Text"
        >
          <Type className="w-5 h-5" />
        </button>

        <button
          onClick={toggleSide}
          className="p-2 hover:bg-primary/20 rounded-full transition-colors text-[#fff]"
          title={isBackView ? "Show Front" : "Show Back"}
        >
          <RefreshCw className="w-5 h-5" />
        </button>

        {selectedId && (
          <>
            <div className="w-px h-6 bg-primary/20 my-auto" />
            
            {selectedLayer?.type === 'text' && (
              <div className="flex items-center gap-2">
                <select
                  value={selectedLayer.fontFamily}
                  onChange={(e) => updateLayer(selectedId, { fontFamily: e.target.value }, isBackView ? 'back' : 'front')}
                  className="bg-transparent border border-primary/20 rounded px-2 py-1 text-white text-sm"
                  title="Font Family"
                >
                  {FONTS.map((font) => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.label}
                    </option>
                  ))}
                </select>
                <input
                  type="color"
                  value={selectedLayer.fill}
                  onChange={(e) => updateLayer(selectedId, { fill: e.target.value }, isBackView ? 'back' : 'front')}
                  className="w-8 h-8 rounded-full overflow-hidden cursor-pointer [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full"
                  title="Text Color"
                />
                <input
                  type="number"
                  value={selectedLayer.fontSize}
                  onChange={(e) => updateLayer(selectedId, { fontSize: Number(e.target.value) }, isBackView ? 'back' : 'front')}
                  className="w-16 bg-transparent border border-primary/20 rounded px-2 py-1 text-white"
                  min="8"
                  max="200"
                  title="Font Size"
                />
              </div>
            )}

            {selectedLayer?.type === 'image' && (
              <button
                onClick={handleFlip}
                className="p-2 hover:bg-primary/20 rounded-full transition-colors text-[#fff]"
                title="Flip Horizontally"
              >
                <FlipHorizontal className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => handleLayerOrder('up')}
              className="p-2 hover:bg-primary/20 rounded-full transition-colors text-[#fff]"
              title="Move Layer Up"
            >
              <ArrowUp className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleLayerOrder('down')}
              className="p-2 hover:bg-primary/20 rounded-full transition-colors text-[#fff]"
              title="Move Layer Down"
            >
              <ArrowDown className="w-5 h-5" />
            </button>

            <button
              onClick={() => selectedId && removeLayer(selectedId, isBackView ? 'back' : 'front')}
              className="p-2 hover:bg-primary/20 rounded-full transition-colors text-[#FF0000]"
              title="Delete Layer"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      <SaveDesignModal 
        isOpen={isSaveModalOpen}
        onClose={() => setSaveModalOpen(false)}
      />
    </>
  );
}
import React, { useRef, useEffect, useState } from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { useDesignStore } from '../store';
import { useCartStore } from '../store/cartStore';
import { DESIGN_AREA } from './Canvas';
import { TShirtPreview } from './TShirtPreview';
import Konva from 'konva';

interface SaveDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SaveDesignModal({ isOpen, onClose }: SaveDesignModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [designName, setDesignName] = useState('');
  const [previewUrls, setPreviewUrls] = useState<{ front: string; back: string }>({ front: '', back: '' });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [savedDesignId, setSavedDesignId] = useState<string | null>(null);
  const { layers, selectedModel } = useDesignStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (!showConfirmation) {
          onClose();
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      generatePreviews();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, showConfirmation]);

  const generatePreviews = async () => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const stages = {
      front: new Konva.Stage({
        container: container,
        width: DESIGN_AREA.width,
        height: DESIGN_AREA.height,
      }),
      back: new Konva.Stage({
        container: container,
        width: DESIGN_AREA.width,
        height: DESIGN_AREA.height,
      })
    };

    const urls: { front: string; back: string } = { front: '', back: '' };

    for (const side of ['front', 'back'] as const) {
      const stage = stages[side];
      const layer = new Konva.Layer();
      stage.add(layer);

      const currentLayers = layers[side];
      
      await Promise.all(currentLayers.map((designLayer) => {
        return new Promise((resolve) => {
          if (designLayer.type === 'text') {
            const text = new Konva.Text({
              text: designLayer.text,
              x: designLayer.x - DESIGN_AREA.x,
              y: designLayer.y - DESIGN_AREA.y,
              fontSize: designLayer.fontSize,
              fontFamily: designLayer.fontFamily,
              fill: designLayer.fill,
              scaleX: designLayer.scaleX,
              scaleY: designLayer.scaleY,
              rotation: designLayer.rotation,
            });
            layer.add(text);
            resolve(true);
            return;
          }

          const img = new window.Image();
          img.crossOrigin = 'anonymous';
          img.src = designLayer.src!;
          img.onload = () => {
            const image = new Konva.Image({
              image: img,
              x: designLayer.x - DESIGN_AREA.x,
              y: designLayer.y - DESIGN_AREA.y,
              width: designLayer.width,
              height: designLayer.height,
              scaleX: designLayer.scaleX * (designLayer.flipped ? -1 : 1),
              scaleY: designLayer.scaleY,
              rotation: designLayer.rotation,
            });
            layer.add(image);
            resolve(true);
          };
        });
      }));

      urls[side] = stage.toDataURL({
        pixelRatio: 1,
        mimeType: 'image/png',
      });
    }

    setPreviewUrls(urls);

    // Cleanup
    Object.values(stages).forEach(stage => stage.destroy());
    container.remove();
  };

  const handleSave = () => {
    if (!designName.trim()) return;

    const designId = Date.now().toString();
    const design = {
      id: designId,
      name: designName,
      timestamp: new Date().toISOString(),
      layers: layers,
      previews: previewUrls,
      model: {
        style: selectedModel.style,
        color: selectedModel.color
      }
    };

    const savedDesigns = JSON.parse(localStorage.getItem('savedDesigns') || '[]');
    savedDesigns.push(design);
    localStorage.setItem('savedDesigns', JSON.stringify(savedDesigns));

    setSavedDesignId(designId);
    setShowConfirmation(true);
  };

  const handleAddToCart = () => {
    if (!savedDesignId) return;

    addItem({
      id: savedDesignId,
      name: designName,
      preview: previewUrls.front,
      price: 29.99,
      quantity: 1,
      model: {
        style: selectedModel.style,
        color: selectedModel.color
      }
    });

    setShowConfirmation(false);
    onClose();
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div 
        ref={modalRef}
        className="bg-[#1a1a24] rounded-2xl w-full max-w-2xl p-6 shadow-[0_0_30px_rgba(109,40,217,0.3)] relative"
      >
        {showConfirmation ? (
          <div className="text-center py-6">
            <h3 className="text-xl font-michroma text-white mb-4">Design Saved Successfully!</h3>
            <p className="text-gray-400 mb-8">Would you like to add it to your cart?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleAddToCart}
                className="px-6 py-3 bg-primary text-white rounded-lg font-michroma flex items-center gap-2 hover:bg-primary/80 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              <button
                onClick={handleCloseConfirmation}
                className="px-6 py-3 border border-primary/20 text-white rounded-lg font-michroma hover:bg-primary/20 transition-colors"
              >
                No, thanks
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-michroma text-white mb-6">Save Design</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Design Name
                </label>
                <input
                  type="text"
                  value={designName}
                  onChange={(e) => setDesignName(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ''))}
                  className="w-full px-3 py-2 bg-black/30 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
                  placeholder="Enter design name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Preview
                </label>
                <TShirtPreview
                  frontPreview={previewUrls.front}
                  backPreview={previewUrls.back}
                />
              </div>

              <div className="flex gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Style
                  </label>
                  <div className="px-3 py-2 bg-black/30 border border-primary/20 rounded-lg text-white capitalize">
                    {selectedModel.style}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Color
                  </label>
                  <div className="px-3 py-2 bg-black/30 border border-primary/20 rounded-lg text-white capitalize">
                    {selectedModel.color}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                disabled={!designName.trim()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-michroma"
              >
                Save Design
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
import React from 'react';
import { useDesignStore } from '../store';

const SAMPLE_ASSETS = [
  'https://images.unsplash.com/photo-1599583863916-e06c29087f51?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1533450718592-29d45635f0a9?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1560850038-f95de6e715b3?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1546768292-fb12f6c92568?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1544568100-847a948585b9?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1599583863916-e06c29087f51?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1533450718592-29d45635f0a9?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1560850038-f95de6e715b3?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1546768292-fb12f6c92568?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1544568100-847a948585b9?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&h=200&fit=crop',
];

export function AssetGallery() {
  const addLayer = useDesignStore((state) => state.addLayer);

  const handleDragStart = (e: React.DragEvent, src: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ src }));
  };

  return (
    <div className="grid grid-cols-3 gap-2 p-4 overflow-y-auto">
      {SAMPLE_ASSETS.map((src, index) => (
        <div
          key={index}
          className="aspect-square rounded-lg overflow-hidden shadow-[0_0_10px_rgba(184,41,227,0.2)] hover:shadow-[0_0_15px_rgba(184,41,227,0.4)] cursor-move transition-all duration-300 border border-[#6d28d9]/20"
          draggable
          onDragStart={(e) => handleDragStart(e, src)}
        >
          <img
            src={src}
            alt={`Asset ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
import React from 'react';
import { useDesignStore } from '../store';

const SAMPLE_ASSETS = [
  "/assets/gallery/Custom_AYO_Pythmet_profile.png",
  "/assets/gallery/Custom_Ayo_Pythmet.png",
  "/assets/gallery/flock.png",
  "/assets/gallery/pythit.png",
  "/assets/gallery/ZARPYTHIA_CHAD_FRONT.png",
  "/assets/gallery/ZARPYTHIA_Profile.png",
  "/assets/gallery/Pyth_Logomark_Light.svg"
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
import React from 'react';

export function TShirtPreview({ frontPreview, backPreview }: { frontPreview: string; backPreview: string }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="aspect-square bg-black/30 rounded-lg overflow-hidden p-4">
        <div className="w-full h-full relative flex items-center justify-center">
          <img
            src={frontPreview}
            alt="Front preview"
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute inset-0 pointer-events-none border border-[#6d28d9]/20 rounded-lg" />
          <span className="absolute bottom-2 left-2 text-sm text-gray-400">Front</span>
        </div>
      </div>
      
      <div className="aspect-square bg-black/30 rounded-lg overflow-hidden p-4">
        <div className="w-full h-full relative flex items-center justify-center">
          <img
            src={backPreview}
            alt="Back preview"
            className="max-w-full max-h-full object-contain"
          />
          <div className="absolute inset-0 pointer-events-none border border-[#6d28d9]/20 rounded-lg" />
          <span className="absolute bottom-2 left-2 text-sm text-gray-400">Back</span>
        </div>
      </div>
    </div>
  );
}
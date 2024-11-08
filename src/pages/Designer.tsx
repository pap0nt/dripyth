import React from 'react';
import { AssetGallery } from '../components/AssetGallery';
import { DesignCanvas } from '../components/Canvas';
import { Toolbar } from '../components/Toolbar';
import { Navbar } from '../components/Navbar';
import { ModelSelector } from '../components/ModelSelector';

export function Designer() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-black">
      <Navbar />
      
      <div className="flex-1 flex mt-16">
        {/* Left Sidebar */}
        <div className="w-72 bg-black border-r border-[#b829e3]/20 flex flex-col">
          <ModelSelector />
          <div className="flex-1 overflow-y-auto">
            <AssetGallery />
          </div>
        </div>

        {/* Design Canvas */}
        <div className="flex-1 relative bg-black">
          <DesignCanvas />
          <Toolbar />
        </div>
      </div>
    </div>
  );
}
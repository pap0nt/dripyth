import React, { useState } from 'react';
import { Pencil, Trash2, Palette, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import { SavedDesign } from '../../types/design';

interface DesignGridProps {
  designs: SavedDesign[];
  onDesignsChange: (designs: SavedDesign[]) => void;
}

export function DesignGrid({ designs, onDesignsChange }: DesignGridProps) {
  const [editingDesign, setEditingDesign] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const { addItem } = useCartStore();

  const handleRename = (id: string, newName: string) => {
    const updatedDesigns = designs.map(design => 
      design.id === id ? { ...design, name: newName } : design
    );
    localStorage.setItem('savedDesigns', JSON.stringify(updatedDesigns));
    onDesignsChange(updatedDesigns);
    setEditingDesign(null);
  };

  const handleDelete = (id: string) => {
    const updatedDesigns = designs.filter(design => design.id !== id);
    localStorage.setItem('savedDesigns', JSON.stringify(updatedDesigns));
    onDesignsChange(updatedDesigns);
  };

  const handleAddToCart = (design: SavedDesign) => {
    addItem({
      id: design.id,
      name: design.name,
      preview: design.previews.front,
      price: 29.99,
      quantity: 1,
      model: design.model || { style: 'oversized', color: 'white' }
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {designs.map((design) => (
        <div
          key={design.id}
          className="group relative bg-[#1a1a24] rounded-xl overflow-hidden border border-primary/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(109,40,217,0.2)]"
        >
          <div className="aspect-square">
            <div className="absolute inset-0 p-4">
              <div className="w-full h-full bg-black/30 rounded-lg overflow-hidden">
                <img
                  src={design.previews.front}
                  alt={design.name}
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                />
                <img
                  src={design.previews.back}
                  alt={`${design.name} back`}
                  className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
            <div className="flex items-center justify-between mb-3">
              {editingDesign === design.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value.replace(/[^a-zA-Z0-9 ]/g, ''))}
                  onBlur={() => handleRename(design.id, editingName)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRename(design.id, editingName)}
                  className="bg-black/30 px-2 py-1 rounded border border-primary/20 text-white w-full"
                  autoFocus
                />
              ) : (
                <h3 className="font-michroma text-lg">{design.name}</h3>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setEditingDesign(design.id);
                  setEditingName(design.name);
                }}
                className="p-2 hover:bg-primary/20 rounded-lg transition-colors text-gray-400 hover:text-white"
                title="Rename"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <Link
                to="/"
                className="p-2 hover:bg-primary/20 rounded-lg transition-colors text-gray-400 hover:text-white"
                title="Edit in Designer"
              >
                <Palette className="w-4 h-4" />
              </Link>
              <button
                onClick={() => handleAddToCart(design)}
                className="p-2 hover:bg-primary/20 rounded-lg transition-colors text-gray-400 hover:text-white"
                title="Add to Cart"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(design.id)}
                className="p-2 hover:bg-primary/20 rounded-lg transition-colors text-red-500 hover:text-red-400"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {designs.length === 0 && (
        <div className="col-span-3 text-center py-12 text-gray-400">
          No saved designs yet
        </div>
      )}
    </div>
  );
}
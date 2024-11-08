import React, { useState } from 'react';
import { Package, ShoppingCart } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { useLikeStore } from '../store/likeStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { LoginModal } from '../components/auth/LoginModal';

interface TopDesign {
  id: string;
  name: string;
  author: string;
  likes: number;
  model: {
    style: 'oversized' | 'slim';
    color: 'white' | 'black';
  };
  previews: {
    front: string;
    back: string;
  };
}

// Test data with 10 designs
const TOP_DESIGNS: TopDesign[] = [
  {
    id: '1',
    name: 'Mojo`s seedphrase',
    author: 'Mojo',
    likes: 2847,
    model: { style: 'oversized', color: 'black' },
    previews: {
      front: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop',
      back: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&h=500&fit=crop'
    }
  },
  {
    id: '2',
    name: 'Rookie',
    author: 'planck',
    likes: 2456,
    model: { style: 'slim', color: 'white' },
    previews: {
      front: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop',
      back: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=500&h=500&fit=crop'
    }
  },
  {
    id: '3',
    name: 'Degen',
    author: 'Southgarden',
    likes: 2154,
    model: { style: 'oversized', color: 'white' },
    previews: {
      front: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=500&h=500&fit=crop',
      back: 'https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=500&h=500&fit=crop'
    }
  },
  {
    id: '4',
    name: 'Oracle',
    author: 'Chop',
    likes: 1987,
    model: { style: 'slim', color: 'black' },
    previews: {
      front: 'https://images.unsplash.com/photo-1606787619248-f301830a5a57?w=500&h=500&fit=crop',
      back: 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=500&h=500&fit=crop'
    }
  },
  {
    id: '5',
    name: 'Ruged',
    author: 'planck',
    likes: 1876,
    model: { style: 'oversized', color: 'black' },
    previews: {
      front: 'https://images.unsplash.com/photo-1583744946564-b52d01a7f418?w=500&h=500&fit=crop',
      back: 'https://images.unsplash.com/photo-1583744946564-b52d01a7f418?w=500&h=500&fit=crop'
    }
  }
];

export function Chart() {
  const { toggleLike, isLiked } = useLikeStore();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [designLikes, setDesignLikes] = useState<{ [key: string]: number }>(
    TOP_DESIGNS.reduce((acc, design) => ({ ...acc, [design.id]: design.likes }), {})
  );

  const handleAddToCart = (design: TopDesign) => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    addItem({
      id: design.id,
      name: design.name,
      preview: design.previews.front,
      price: 29.99, // Example price
      quantity: 1,
      model: design.model
    });
  };

  const handleLike = (designId: string) => {
    toggleLike(designId);
    setDesignLikes(prev => ({
      ...prev,
      [designId]: prev[designId] + (isLiked(designId) ? -1 : 1)
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-michroma text-white">
            Top Designs
          </h1>
          <div className="text-sm text-gray-400 font-jetbrains">
            Updated hourly
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOP_DESIGNS.map((design, index) => (
            <div
              key={design.id}
              className="bg-[#1a1a24] rounded-xl overflow-hidden border border-primary/20 transition-transform hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(190,177,246,0.2)]"
            >
              <div className="relative">
                <div className="absolute top-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-sm font-jetbrains">
                  #{index + 1}
                </div>
                
                <div className="aspect-square relative group">
                  <div className="absolute inset-0 p-4">
                    <div className="w-full h-full bg-black/30 rounded-lg overflow-hidden">
                      <img
                        src={design.previews.front}
                        alt={`${design.name} front`}
                        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                      />
                      <img
                        src={design.previews.back}
                        alt={`${design.name} back`}
                        className="w-full h-full object-cover absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-6 right-6 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-sm font-jetbrains transition-opacity duration-300">
                    <span className="group-hover:hidden">Front</span>
                    <span className="hidden group-hover:inline">Back</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-primary/20">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-jetbrains text-lg">{design.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-400 capitalize font-jetbrains">{design.model.style}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-400 capitalize font-jetbrains">{design.model.color}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddToCart(design)}
                    className="px-4 py-2 rounded-lg bg-primary text-white font-jetbrains flex items-center gap-2 hover:bg-primary/80 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400 font-jetbrains">
                    by {design.author}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
}
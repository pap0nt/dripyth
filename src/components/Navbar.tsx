import React, { useState, useRef, useEffect } from 'react';
import { LogIn, X, Wallet, ShoppingCart, Trash2, Package, LogOut } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { LoginModal } from './auth/LoginModal';
import { auth } from '../config/firebase';

export function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { items, removeItem, getTotalItems, getTotalPrice } = useCartStore();
  const { user, clearAuth } = useAuthStore();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setShowCart(false);
      }
    }

    if (showModal || showCart) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal, showCart]);

  const handleOrder = () => {
    if (!user) {
      setShowModal(true);
      return;
    }
    setShowCart(false);
    navigate('/checkout');
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      clearAuth();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-black/50 backdrop-blur-md border-b border-primary/20 z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="logo font-michroma text-2xl tracking-wider text-white relative"
              data-text="PYTH DRIP"
            >
              PYTH DRIP
            </Link>
            <div className="flex items-center space-x-4">
              {location.pathname === '/chart' && (
                <Link 
                  to="/" 
                  className="text-white/70 hover:text-white transition-colors font-michroma tracking-wide"
                >
                  Designer
                </Link>
              )}
              {location.pathname !== '/chart' && (
                <Link 
                  to="/chart" 
                  className="text-white/70 hover:text-white transition-colors font-michroma tracking-wide"
                >
                  Chart
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowCart(!showCart)}
                  className="relative p-2 text-white/70 hover:text-white transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>

                {showCart && (
                  <div
                    ref={cartRef}
                    className="absolute right-0 mt-2 w-80 bg-[#1a1a24] rounded-xl shadow-lg border border-primary/20 overflow-hidden"
                  >
                    <div className="p-4 border-b border-primary/20">
                      <h3 className="font-michroma text-white">Shopping Cart</h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {items.length === 0 ? (
                        <div className="p-4 text-center text-gray-400">
                          Your cart is empty
                        </div>
                      ) : (
                        <div className="divide-y divide-primary/20">
                          {items.map((item) => (
                            <div key={item.id} className="p-4 flex items-center gap-3">
                              <img
                                src={item.preview}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium">{item.name}</h4>
                                <div className="text-sm text-gray-400">
                                  {item.model.style}, {item.model.color}
                                </div>
                                <div className="text-sm text-primary">
                                  ${item.price} × {item.quantity}
                                </div>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-2 hover:bg-primary/20 rounded-lg transition-colors text-red-500 hover:text-red-400"
                                title="Remove Item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {items.length > 0 && (
                      <div className="p-4 border-t border-primary/20 space-y-4">
                        <div className="flex justify-between items-center font-michroma">
                          <span>Total</span>
                          <span>${getTotalPrice().toFixed(2)}</span>
                        </div>
                        <button
                          onClick={handleOrder}
                          className="w-full py-2 px-4 bg-primary text-white rounded-lg font-michroma flex items-center justify-center gap-2 hover:bg-primary/80 transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          Order Now
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-[#0ff4c6] p-0.5">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || user.email || 'Profile'}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-white text-sm font-medium">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="text-white/70 group-hover:text-white transition-colors">
                    {user.displayName || user.email?.split('@')[0] || 'User'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-white/50 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="relative group px-6 py-2 overflow-hidden"
              >
                <div className="absolute inset-0 border border-primary group-hover:border-white transition-colors duration-300 rounded-lg" />
                <div className="absolute inset-[1px] bg-black rounded-lg" />
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-colors duration-300 rounded-lg" />
                <div className="relative flex items-center gap-2 font-michroma tracking-wide text-white/90 group-hover:text-white">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </div>
              </button>
            )}
          </div>
        </div>
      </nav>

      <LoginModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
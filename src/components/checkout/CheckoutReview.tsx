import React from 'react';
import { ChevronLeft, Package, Trash2 } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

interface CheckoutReviewProps {
  formData: {
    firstName: string;
    lastName: string;
    country: string;
    address1: string;
    address2: string;
    postalCode: string;
  };
  onBack: () => void;
  onComplete: () => void;
}

export function CheckoutReview({
  formData,
  onBack,
  onComplete
}: CheckoutReviewProps) {
  const { items, getTotalPrice, removeItem } = useCartStore();

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-michroma mb-6">Review Order</h2>

      {/* Shipping Information */}
      <div>
        <h3 className="text-lg font-michroma mb-4">Shipping Information</h3>
        <div className="bg-black/30 rounded-lg p-4 space-y-2">
          <p>
            {formData.firstName} {formData.lastName}
          </p>
          <p>{formData.address1}</p>
          {formData.address2 && <p>{formData.address2}</p>}
          <p>
            {formData.postalCode}, {formData.country}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h3 className="text-lg font-michroma mb-4">Order Items</h3>
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Your cart is empty
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="bg-black/30 rounded-lg p-4 flex items-center gap-4"
              >
                <img
                  src={item.preview}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <div className="text-sm text-gray-400">
                    <p>Quantity: {item.quantity}</p>
                    <p className="capitalize">
                      {item.model.style}, {item.model.color}
                    </p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <p className="text-primary font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 hover:bg-primary/20 rounded-lg transition-colors text-red-500 hover:text-red-400"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div>
        <h3 className="text-lg font-michroma mb-4">Order Summary</h3>
        <div className="bg-black/30 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="font-michroma">Total</span>
            <span className="text-xl font-michroma text-primary">
              ${getTotalPrice().toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-primary/20 text-white rounded-lg font-michroma flex items-center gap-2 hover:bg-primary/20 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onComplete}
          disabled={items.length === 0}
          className="px-6 py-3 bg-primary text-white rounded-lg font-michroma flex items-center gap-2 hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Package className="w-4 h-4" />
          Complete Order
        </button>
      </div>
    </div>
  );
}
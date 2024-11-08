import React from 'react';
import { CheckCircle } from 'lucide-react';

export function CheckoutConfirmation() {
  return (
    <div className="text-center py-8">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
      </div>
      <h2 className="text-2xl font-michroma mb-4">Order Confirmed!</h2>
      <p className="text-gray-400 mb-8">
        Thank you for your order. You will be redirected to your orders page shortly.
      </p>
      <div className="w-16 h-16 mx-auto">
        <div className="w-full h-full border-4 border-t-primary border-r-primary/30 border-b-primary/30 border-l-primary/30 rounded-full animate-spin" />
      </div>
    </div>
  );
}
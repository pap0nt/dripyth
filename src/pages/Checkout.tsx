import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { CheckoutInformation } from '../components/checkout/CheckoutInformation';
import { CheckoutReview } from '../components/checkout/CheckoutReview';
import { CheckoutConfirmation } from '../components/checkout/CheckoutConfirmation';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';

const STEPS = ['Information', 'Review', 'Confirmation'];

export function Checkout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    address1: '',
    address2: '',
    postalCode: ''
  });
  
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Create new order
    const orderId = `ORD-${Date.now()}`;
    addOrder({
      id: orderId,
      date: new Date().toISOString(),
      status: 'processing',
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        preview: item.preview,
        quantity: item.quantity,
        price: item.price
      }))
    });

    // Clear cart
    clearCart();

    // Show success step
    setCurrentStep(2);

    // Redirect to orders after 3 seconds
    setTimeout(() => {
      navigate('/profile');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <React.Fragment key={step}>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep
                        ? 'bg-primary text-white'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <span className="ml-2 font-michroma text-sm">
                    {step}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div
                      className={`h-px ${
                        index < currentStep
                          ? 'bg-primary'
                          : 'bg-gray-800'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-[#1a1a24] rounded-xl border border-primary/20 p-6">
          {currentStep === 0 && (
            <CheckoutInformation
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 1 && (
            <CheckoutReview
              formData={formData}
              onBack={handleBack}
              onComplete={handleComplete}
            />
          )}
          
          {currentStep === 2 && (
            <CheckoutConfirmation />
          )}
        </div>
      </div>
    </div>
  );
}
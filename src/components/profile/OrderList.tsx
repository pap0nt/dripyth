import React from 'react';
import { Order } from '../../types/order';
import { useOrderStore } from '../../store/orderStore';

interface OrderListProps {
  orders: Order[];
}

export function OrderList() {
  const { orders } = useOrderStore();

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'processing':
        return 'text-yellow-500';
      case 'shipped':
        return 'text-blue-500';
      case 'delivered':
        return 'text-green-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          No orders yet
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-[#1a1a24] rounded-xl overflow-hidden border border-primary/20"
          >
            <div className="p-4 border-b border-primary/20">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-michroma text-lg">Order {order.id}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`capitalize font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <img
                    src={item.preview}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-gray-400">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
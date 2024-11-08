import { Order } from '../types/order';

export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ORD-001',
    date: '2024-03-15',
    status: 'processing',
    items: [
      {
        id: '1',
        name: 'Cosmic Dreams',
        preview: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop',
        quantity: 1,
        price: 29.99
      }
    ]
  },
  {
    id: 'ORD-002',
    date: '2024-03-10',
    status: 'shipped',
    items: [
      {
        id: '2',
        name: 'Digital Rain',
        preview: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop',
        quantity: 2,
        price: 29.99
      }
    ]
  }
];
export interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered';
  items: {
    id: string;
    name: string;
    preview: string;
    quantity: number;
    price: number;
  }[];
}
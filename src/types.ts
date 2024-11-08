export interface DesignLayer {
  id: string;
  type: 'image' | 'text';
  src?: string;
  text?: string;
  fontSize?: number;
  fill?: string;
  fontFamily?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  zIndex: number;
  flipped: boolean;
}

export interface TShirtModel {
  id: string;
  name: string;
  style: 'oversized' | 'slim';
  color: 'white' | 'black';
  previews: {
    front: string;
    back: string;
  };
}

export const TSHIRT_MODELS: TShirtModel[] = [
  {
    id: 'oversized-white',
    name: 'Oversized White',
    style: 'oversized',
    color: 'white',
    previews: {
      front: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&fit=crop',
      back: 'https://images.unsplash.com/photo-1523585298601-d46ae038d7d3?w=800&fit=crop'
    }
  },
  {
    id: 'oversized-black',
    name: 'Oversized Black',
    style: 'oversized',
    color: 'black',
    previews: {
      front: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&fit=crop',
      back: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&fit=crop'
    }
  },
  {
    id: 'slim-white',
    name: 'Slim White',
    style: 'slim',
    color: 'white',
    previews: {
      front: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&fit=crop',
      back: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&fit=crop'
    }
  },
  {
    id: 'slim-black',
    name: 'Slim Black',
    style: 'slim',
    color: 'black',
    previews: {
      front: 'https://images.unsplash.com/photo-1503341960582-b45751874cf0?w=800&fit=crop',
      back: 'https://images.unsplash.com/photo-1503341960582-b45751874cf0?w=800&fit=crop'
    }
  }
];
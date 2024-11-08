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
      front: './assets/white/oversized/front.png',
      back: './assets/white/oversized/back.png'
    }
  },
  {
    id: 'oversized-black',
    name: 'Oversized Black',
    style: 'oversized',
    color: 'black',
    previews: {
      front: './assets/black/oversized/front.png',
      back: './assets/black/oversized/back.png'
    }
  },
  {
    id: 'slim-white',
    name: 'Slim White',
    style: 'slim',
    color: 'white',
    previews: {
      front: './assets/white/slim/front.png',
      back: './assets/white/slim/back.png'
    }
  },
  {
    id: 'slim-black',
    name: 'Slim Black',
    style: 'slim',
    color: 'black',
    previews: {
      front: './assets/black/slim/front.png',
      back: './assets/black/slim/back.png'
    }
  }
];
export interface SavedDesign {
  id: string;
  name: string;
  timestamp: string;
  layers: {
    front: any[];
    back: any[];
  };
  previews: {
    front: string;
    back: string;
  };
  model?: {
    style: 'oversized' | 'slim';
    color: 'white' | 'black';
  };
}
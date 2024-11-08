import { create } from 'zustand';
import { persist as zustandPersist } from 'zustand/middleware';
import { DesignLayer, TShirtModel, TSHIRT_MODELS } from './types';

interface HistoryEntry {
  layers: {
    front: DesignLayer[];
    back: DesignLayer[];
  };
  timestamp: number;
}

interface DesignStore {
  layers: {
    front: DesignLayer[];
    back: DesignLayer[];
  };
  selectedId: string | null;
  isBackView: boolean;
  history: HistoryEntry[];
  currentHistoryIndex: number;
  selectedModel: TShirtModel;
  addLayer: (layer: DesignLayer, side: 'front' | 'back') => void;
  updateLayer: (id: string, updates: Partial<DesignLayer>, side: 'front' | 'back') => void;
  removeLayer: (id: string, side: 'front' | 'back') => void;
  setSelectedId: (id: string | null) => void;
  resetLayers: () => void;
  toggleSide: () => void;
  undo: () => void;
  addToHistory: () => void;
  setSelectedModel: (modelId: string) => void;
}

const MAX_HISTORY = 50;

const initialState = {
  layers: {
    front: [],
    back: []
  },
  selectedId: null,
  isBackView: false,
  history: [],
  currentHistoryIndex: -1,
  selectedModel: TSHIRT_MODELS[0]
};

type StorageState = {
  layers: {
    front: DesignLayer[];
    back: DesignLayer[];
  };
  isBackView: boolean;
  selectedModel: TShirtModel;
  version?: number;
};

export const useDesignStore = create<DesignStore>()(
  zustandPersist(
    (set, get) => ({
      ...initialState,
      addLayer: (layer, side) => {
        const state = get();
        state.addToHistory();
        set((state) => ({
          layers: {
            ...state.layers,
            [side]: [...state.layers[side], layer]
          }
        }));
      },
      updateLayer: (id, updates, side) => {
        const state = get();
        state.addToHistory();
        set((state) => ({
          layers: {
            ...state.layers,
            [side]: state.layers[side].map((layer) =>
              layer.id === id ? { ...layer, ...updates } : layer
            )
          }
        }));
      },
      removeLayer: (id, side) => {
        const state = get();
        state.addToHistory();
        set((state) => ({
          layers: {
            ...state.layers,
            [side]: state.layers[side].filter((layer) => layer.id !== id)
          },
          selectedId: state.selectedId === id ? null : state.selectedId,
        }));
      },
      setSelectedId: (id) => set({ selectedId: id }),
      resetLayers: () => {
        const state = get();
        state.addToHistory();
        set(initialState);
      },
      toggleSide: () => set((state) => ({ isBackView: !state.isBackView })),
      addToHistory: () => {
        const state = get();
        const newEntry: HistoryEntry = {
          layers: JSON.parse(JSON.stringify(state.layers)),
          timestamp: Date.now()
        };

        set((state) => {
          const newHistory = [
            ...state.history.slice(0, state.currentHistoryIndex + 1),
            newEntry
          ].slice(-MAX_HISTORY);

          return {
            history: newHistory,
            currentHistoryIndex: newHistory.length - 1
          };
        });
      },
      undo: () => {
        const state = get();
        if (state.currentHistoryIndex > 0) {
          const previousState = state.history[state.currentHistoryIndex - 1];
          set({
            layers: previousState.layers,
            currentHistoryIndex: state.currentHistoryIndex - 1
          });
        }
      },
      setSelectedModel: (modelId) => {
        const model = TSHIRT_MODELS.find(m => m.id === modelId);
        if (model) {
          set({ selectedModel: model });
        }
      }
    }),
    {
      name: 'design-store',
      version: 2,
      migrate: (persistedState: any, version: number): StorageState => {
        if (version === 0) {
          return {
            layers: {
              front: Array.isArray(persistedState.layers) ? persistedState.layers : [],
              back: []
            },
            isBackView: false,
            selectedModel: TSHIRT_MODELS[0],
            version: 2
          };
        }
        if (version === 1) {
          return {
            ...persistedState,
            selectedModel: TSHIRT_MODELS[0],
            version: 2
          };
        }
        return persistedState as StorageState;
      },
      partialize: (state): StorageState => ({
        layers: state.layers,
        isBackView: state.isBackView,
        selectedModel: state.selectedModel,
        version: 2
      })
    }
  )
);
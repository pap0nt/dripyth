import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LikeStore {
  likedDesigns: Set<string>;
  toggleLike: (designId: string) => void;
  isLiked: (designId: string) => boolean;
}

export const useLikeStore = create<LikeStore>()(
  persist(
    (set, get) => ({
      likedDesigns: new Set<string>(),
      toggleLike: (designId: string) => {
        set((state) => {
          const newLikedDesigns = new Set(state.likedDesigns);
          if (newLikedDesigns.has(designId)) {
            newLikedDesigns.delete(designId);
          } else {
            newLikedDesigns.add(designId);
          }
          return { likedDesigns: newLikedDesigns };
        });
      },
      isLiked: (designId: string) => get().likedDesigns.has(designId),
    }),
    {
      name: 'likes-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          return {
            state: {
              ...state,
              likedDesigns: new Set(state.likedDesigns),
            },
          };
        },
        setItem: (name, value) => {
          const { state } = value;
          const serializedState = {
            state: {
              ...state,
              likedDesigns: Array.from(state.likedDesigns),
            },
          };
          localStorage.setItem(name, JSON.stringify(serializedState));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
import { create } from 'zustand';
const useStore = create((set) => ({
  count: 0,
  server:"http://localhost:3000/api/",
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

export default useStore;
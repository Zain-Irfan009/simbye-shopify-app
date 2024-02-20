import { create } from 'zustand';

const useStore = create((set) => ({
  barInfo: {},
  barDesign: {},
  formContent: {},
  sucessContent: {},
  
  setBarInfo: (object) => set({ barInfo: object }),
  setBarDesign: (object) => set({ barDesign: object }),
  setFormContent: (object) => set({ formContent: object }),
  setSucessContent: (object) => set({ sucessContent: object }),
}));

export default useStore;

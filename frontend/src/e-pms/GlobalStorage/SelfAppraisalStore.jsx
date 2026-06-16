import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      // Existing state
      overallEmpStatusId: null,
      setOverallEmpStatusId: (value) => set({ overallEmpStatusId: value }),

      // New state for savedAppraiseeGoals and savedDevelopmentGoals
      savedAppraiseeGoals: [],
      savedDevelopmentGoals: [],

      setSavedAppraiseeGoals: (goals) => set({ savedAppraiseeGoals: goals }),
      setSavedDevelopmentGoals: (goals) =>
        set({ savedDevelopmentGoals: goals }),
    }),
    {
      name: "employee-data",
      storage: createJSONStorage(() => sessionStorage), // or localStorage
    }
  )
);

export { useStore };

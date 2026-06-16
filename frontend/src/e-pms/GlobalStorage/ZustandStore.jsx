import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useStore = create((set) => ({
  data: {},
  setData: (newData) => set((state) => ({ data: newData })),
  viewData: {},
  setViewData: (newViewData) => set((state) => ({ viewData: newViewData })),
}));

// sid

const useStoreSID = create(
  persist(
    (set) => ({
      sid: "",
      setSID: (value) => set({ sid: value }),
    }),
    {
      name: "sid",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// empId

const useStoreEmpId = create(
  persist(
    (set) => ({
      empId: "",
      setEmpId: (value) => set({ empId: value }),
    }),
    {
      name: "empId",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);



const useStoreTabStatus= create(
  persist(
    (set) => ({
      tabStatus: "one",
      setTabStatus: (value) => set({ tabStatus: value }),
    }),
    {
      name: "tab-status",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);



const useStoreManagerScreenSubmitStatus= create(
  persist(
    (set) => ({
      submitStatus: false,
      setSubmitStatus: (value) => set({ submitStatus: value }),
    }),
    {
      name: "manager-screen-submit-status",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);



const useStoreManagerId= create(
  persist(
    (set) => ({
      mgrId: false,
      setMgrId: (value) => set({ mgrId: value }),
    }),
    {
      name: "managerstore-id",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);





const useStoreEmployeeStatusId= create(
  persist(
    (set) => ({
      empStatusId: 0,
      setEmpStatusId: (value) => set({ mgrId: value }),
    }),
    {
      name: "employee-status-id",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);



// const useDevGoals = create(
//   persist(
//     (set) => ({
//       devGoalsStore: [],
//       setDevGoalsStore: (value) => set({ devGoalsStore: value }),
//     }),
//     {
//       name: "empId",
//       storage: createJSONStorage(() => localStorage),
//     }
//   )
// );

export { useStore, useStoreSID, useStoreEmpId ,useStoreTabStatus,useStoreManagerScreenSubmitStatus,useStoreManagerId,useStoreEmployeeStatusId};

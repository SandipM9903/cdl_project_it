
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useStore1 = create(
  persist(
    (set) => ({
      expType: 'exp',
      editInfo: false,
      viewDetailsBtnInfo: false,
      setExpType: (newExpType) => set({ expType: newExpType }),
      setEditInfo: (newEditInfo) => set({ editInfo: newEditInfo}),
      setViewDetailsBtnInfo: (newViewDetailsBtnInfo) => set({ viewDetailsBtnInfo: newViewDetailsBtnInfo}),
    }),
    {
      name: "expTypeStore", 
      getStorage: () => sessionStorage,
    }
  )
);

const useStore2 = create((set) => ({
  expenseTotals: {
    approved: 0,
    claimed: 0,
    rejected: 0,
    pending: 0,
  },
  advanceTotals: {
    approved: 0,
    claimed: 0,
    rejected: 0,
    pending: 0,
  },
  selectedYear: new Date().getFullYear().toString(),
  setExpenseTotals: (totals) => set({ expenseTotals: totals }),
  setAdvanceTotals: (totals) => set({ advanceTotals: totals }),
  setSelectedYear: (year) => set({ selectedYear: year }),
}));




const useStore3 = create((set) => ({
  newEditClaim: {},
  tabIndex: 0,
  newWithdrawClaim: {},
  totalClaims: 0,
  reimbursementRecord: [],
  advTotalClaims: 0,
  advReimbursementRecord: [],
  claimStatus: '',
  exitRecord: [],
  exitTotalClaims: 0,

  // newPendingClaim: {},
  setNewEditClaim: (claim) => set({ newEditClaim: claim }),
  setTabIndex: (tabIndex) => set({ tabIndex }),
  setNewWithdrawClaim: (claim) => set({ newWithdrawClaim: claim}),
  setTotalClaims: (count) => set({totalClaims: count}),
  setReimbursementRecord: (records) => set({ reimbursementRecord: records }),
  setAdvTotalClaims: (count) => set({advTotalClaims: count}),
  setAdvReimbursementRecord: (records) => set({ advReimbursementRecord: records }),
  setClaimStatus: (status) => set({ claimStatus: status }),
  setExitRecord: (records) => set({ exitRecord: records }),
  setExitTotalClaims: (count) => set({exitTotalClaims: count}),
  // setNewPendingClaim: (claim) => set({ newPendingClaim: claim }),
}));

export {useStore1, useStore2, useStore3 };


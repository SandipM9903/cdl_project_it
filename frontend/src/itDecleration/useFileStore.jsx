import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// ============================================== FOR FILES AND ATTACHMENT =============================================

// Zustand store for managing files and itDecId state
const useFileStore = create((set) => ({
  files: [], // Global file list
  itDecId: [], // List to store itDecId values

  // Methods for managing files
  addFiles: (newFiles) =>
    set((state) => ({ files: [...state.files, ...newFiles] })),
  removeFile: (fileName) =>
    set((state) => ({
      files: state.files.filter((file) => file.name !== fileName),
    })),
  clearFiles: () => set({ files: [] }),

  // Methods for managing itDecId
  addItDecId: (id) => set((state) => ({ itDecId: [...state.itDecId, id] })),
  removeItDecId: (id) =>
    set((state) => ({
      itDecId: state.itDecId.filter((existingId) => existingId !== id),
    })),
  clearItDecIds: () => set({ itDecId: [] }),

  // Resetting both files and itDecId
  resetStore: () => set({ files: [], itDecId: [] }),
}));

export default useFileStore;

const useStore = create(
  persist(
    (set) => ({
      submitFileStatus: false,
      setSubmitFileStatus: (value) => set({ submitFileStatus: value }),
    }),
    {
      name: "submit-file-status",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

const useStoreFinancialYear = create(
  persist(
    (set) => ({
      submitFinancialYear: "",
      setSubmitFinancialYear: (value) => set({ submitFinancialYear: value }),
    }),
    {
      name: "financial-year",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

const useStoreSaveStatusSection80c = create(
  persist(
    (set) => ({
      saveStatusSection80C: "",
      setSaveStatusSection80C: (value) => set({ saveStatusSection80C: value }),
    }),
    {
      name: "savestatus80c",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

const useStoreRegime = create(
  persist(
    (set) => ({
      regime: "",
      setRegime: (value) => set({ regime: value }),
    }),
    {
      name: "regime",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

const useStoreSubmitStatusRedirect = create(
  persist(
    (set) => ({
      saveStatus: "false",
      setSaveStatus: (value) => set({ saveStatus: value }),
    }),
    {
      name: "submit-proof-status",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

const useStoreSaveStatus80c = create(
  persist(
    (set) => ({
      saveStatus80c: "false",
      setSaveStatus80c: (value) => set({ saveStatus80c: value }),
    }),
    {
      name: "save-status80c",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

const useStoreSaveStatus80d = create(
  persist(
    (set) => ({
      saveStatus80d: "false",
      setSaveStatus80d: (value) => set({ saveStatus80d: value }),
    }),
    {
      name: "save-status80d",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

const useStoreSaveStatus80e = create(
  persist(
    (set) => ({
      saveStatus80e: "false",
      setSaveStatus80e: (value) => set({ saveStatus80e: value }),
    }),
    {
      name: "save-status80e",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// ======================================================== UPDATE ===================================================
// update section 80c,80d,80e

const useStoreUpdateSaveStatus80c = create(
  persist(
    (set) => ({
      updateSaveStatus80c: "false",
      setUpdateSaveStatus80c: (value) => set({ updateSaveStatus80c: value }),
    }),
    {
      name: "update-save-status80c",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

const useStoreUpdateSaveStatus80d = create(
  persist(
    (set) => ({
      updateSaveStatus80d: "false",
      setUpdateSaveStatus80d: (value) => set({ updateSaveStatus80d: value }),
    }),
    {
      name: "update-save-status80d",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

const useStoreUpdateSaveStatus80e = create(
  persist(
    (set) => ({
      updateSaveStatus80e: "false",
      setUpdateSaveStatus80e: (value) => set({ updateSaveStatus80e: value }),
    }),
    {
      name: "update-save-status80e",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// const useStoreAttachmentStatusAfterSubmit = create(
//   persist(
//     (set) => ({
//       attachmentStatusAfterSubmit: true,
//       setAttachmentStatusAfterSubmit: (value) =>
//         set({ attachmentStatusAfterSubmit: value }),
//     }),
//     {
//       name: "attachment-status-after-submit",
//       storage: createJSONStorage(() => sessionStorage),
//     }
//   )
// );


const useStoreAttachmentStatusAfterSubmit = create((set) => ({
  attachmentStatusAfterSubmit: true,
  setAttachmentStatusAfterSubmit: (value) => set({ attachmentStatusAfterSubmit: value }),
}));

// ============================================  ADMIN PAGE =================================

// ========================================================= DEPARTMENT ================================================

// ========================================================= INCOME TAX

// department

const useStoreTotalDepartment = create((set) => ({
  totalDepartmentNumber: 0,
  setTotalDepartmentNumber: (value) => set({ totalDepartmentNumber: value }),
}));

const useStoreTotalFilteredDepartment = create((set) => ({
  totalFilteredDepartmentNumber: 0,
  setTotalFilteredDepartmentNumber: (value) =>
    set({ totalFilteredDepartmentNumber: value }),
}));

const useStoreSelectedDepartment = create((set) => ({
  selectedDepartment: [],
  setSelectedDepartment: (value) => set({ selectedDepartment: value }),
}));

// =============================================================  PROOF

// proof of investment

const useStoreTotalFilteredProofDepartment = create((set) => ({
  totalFilteredProofDepartmentNumber: 0,
  setTotalFilteredProofDepartmentNumber: (value) =>
    set({ totalFilteredProofDepartmentNumber: value }),
}));

const useStoreSelectedProofDepartment = create((set) => ({
  selectedProofDepartment: [],
  setSelectedProofDepartment: (value) =>
    set({ selectedProofDepartment: value }),
}));

// ======================================  POSITION ====================================================================

// ================================= INCOME TAX

// for position

const useStoreTotalPosition = create((set) => ({
  totalPositionNumber: 0,
  setTotalPositionNumber: (value) => set({ totalPositionNumber: value }),
}));

const useStoreTotalFilteredPosition = create((set) => ({
  totalFilteredPositionNumber: 0,
  setTotalFilteredPositionNumber: (value) =>
    set({ totalFilteredPositionNumber: value }),
}));

const useStoreSelectedPosition = create((set) => ({
  selectedPosition: [],
  setSelectedPosition: (value) => set({ selectedPosition: value }),
}));

// ================================================== PROOF

const useStoreTotalFilteredProofPosition = create((set) => ({
  totalFilteredProofPositionNumber: 0,
  setTotalFilteredProofPositionNumber: (value) =>
    set({ totalFilteredProofPositionNumber: value }),
}));

const useStoreSelectedProofPosition = create((set) => ({
  selectedProofPosition: [],
  setSelectedProofPosition: (value) => set({ selectedProofPosition: value }),
}));

// =========================================================  PROJECT ==================================================

// ============================ INCOME TAX

// for project

const useStoreTotalProject = create((set) => ({
  totalProjectNumber: 0,
  setTotalProjectNumber: (value) => set({ totalProjectNumber: value }),
}));

const useStoreTotalFilteredProject = create((set) => ({
  totalFilteredProjectNumber: 0,
  setTotalFilteredProjectNumber: (value) =>
    set({ totalFilteredProjectNumber: value }),
}));

const useStoreSelectedProject = create((set) => ({
  selectedProject: [],
  setSelectedProject: (value) => set({ selectedProject: value }),
}));

// ==================================================== PROOF

const useStoreTotalFilteredProofProject = create((set) => ({
  totalFilteredProofProjectNumber: 0,
  setTotalFilteredProofProjectNumber: (value) =>
    set({ totalFilteredProofProjectNumber: value }),
}));

const useStoreSelectedProofProject = create((set) => ({
  selectedProofProject: [],
  setSelectedProofProject: (value) => set({ selectedProofProject: value }),
}));

// ===================================================== LOCATION ======================================================

// ===================================================== INCOME TAX

// for location

const useStoreTotalLocation = create((set) => ({
  totalLocationNumber: 0,
  setTotalLocationNumber: (value) => set({ totalLocationNumber: value }),
}));

const useStoreTotalFilteredLocation = create((set) => ({
  totalFilteredLocationNumber: 0,
  setTotalFilteredLocationNumber: (value) =>
    set({ totalFilteredLocationNumber: value }),
}));

const useStoreSelectedLocation = create((set) => ({
  selectedLocation: [],
  setSelectedLocation: (value) => set({ selectedLocation: value }),
}));

// ================================================================  PROOF
const useStoreTotalFilteredProofLocation = create((set) => ({
  totalFilteredProofLocationNumber: 0,
  setTotalFilteredProofLocationNumber: (value) =>
    set({ totalFilteredProofLocationNumber: value }),
}));

const useStoreSelectedProofLocation = create((set) => ({
  selectedProofLocation: [],
  setSelectedProofLocation: (value) => set({ selectedProofLocation: value }),
}));

// ========================================================= EMPLOYEE =================================================

// ========================================================= INCOME TAX
// for employee

const useStoreTotalEmployee = create((set) => ({
  totalEmployeeNumber: 0,
  setTotalEmployeeNumber: (value) => set({ totalEmployeeNumber: value }),
}));

const useStoreTotalFilteredEmployee = create((set) => ({
  totalFilteredEmployeeNumber: 0,
  setTotalFilteredEmployeeNumber: (value) =>
    set({ totalFilteredEmployeeNumber: value }),
}));

const useStoreSelectedEmployee = create((set) => ({
  selectedEmployee: [],
  setSelectedEmployee: (value) => set({ selectedEmployee: value }),
}));

// ============================================================ PROOF
const useStoreTotalFilteredProofEmployee = create((set) => ({
  totalFilteredProofEmployeeNumber: 0,
  setTotalFilteredProofEmployeeNumber: (value) =>
    set({ totalFilteredProofEmployeeNumber: value }),
}));

const useStoreSelectedProofEmployee = create((set) => ({
  selectedProofEmployee: [],
  setSelectedProofEmployee: (value) => set({ selectedProofEmployee: value }),
}));

// ================================================== START STATUS ===========================================================

// it declaration admin start it declaration for financial year and start status

const useStoreITDeclarationStartFinancialYearStatus = create((set) => ({
  itDeclarationStartFinancialYearStatus: "",
  setItDeclarationStartFinancialYearStatus: (value) =>
    set({ itDeclarationStartFinancialYearStatus: value }),
}));

const useStoreITDeclarationStartStatus = create((set) => ({
  itDeclarationStartStatus: "false",
  setItDeclarationStartStatus: (value) =>
    set({ itDeclarationStartStatus: value }),
}));

// proof of investment admin start it declaration for financial year and start status

const useStoreProofOfInvestmentStartFinancialYearStatus = create((set) => ({
  proofOfInvestmentStartFinancialYearStatus: "",
  setProofOfInvestmentStartFinancialYearStatus: (value) =>
    set({ proofOfInvestmentStartFinancialYearStatus: value }),
}));

const useStoreProofOfInvestmentStartStatus = create((set) => ({
  proofOfInvestmentStartStatus: "false",
  setProofOfInvestmentStartStatus: (value) =>
    set({ proofOfInvestmentStartStatus: value }),
}));

// it-declaration start status with local storage

const useStoreITDeclarationStartFinancialYearStatusStorage = create(
  persist(
    (set) => ({
      itDeclarationStartFinancialYearStatusStorage: "",
      setItDeclarationStartFinancialYearStatusStorage: (value) =>
        set({ itDeclarationStartFinancialYearStatusStorage: value }),
    }),
    {
      name: "it-declaration-financial-year-start-status-Storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// INCOME-TAX  STORAGE

const useStoreITDeclarationStartStatusStorage = create(
  persist(
    (set) => ({
      itDeclarationStartStatusStorage: "",
      setItDeclarationStartStatusStorage: (value) =>
        set({ itDeclarationStartStatusStorage: value }),
    }),
    {
      name: "it-declaration-start-status-Storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// INCOME-TAX CUTOFF DATE

// it cut off date

const useStoreITDeclarationITCutOffDate = create(
  persist(
    (set) => ({
      itDeclarationITCutOffStorage: "",
      setItDeclarationCutOffStorage: (value) =>
        set({ itDeclarationITCutOffStorage: value }),
    }),
    {
      name: "it-cut-off-date",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// PROOF-OF-INVESTMENT  STORAGE

const useStoreProofOfInvestmentStartStatusStorage = create(
  persist(
    (set) => ({
      proofOfInvestmentStartStatusStorage: "",
      setProofOfInvestmentStartStatusStorage: (value) =>
        set({ proofOfInvestmentStartStatusStorage: value }),
    }),
    {
      name: "proof-of-investment-start-status-Storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

const useStoreProofOfInvestmentCutOffDate = create(
  persist(
    (set) => ({
      proofDateCutOffStorage: "",
      setProofDateCutOffStorage: (value) =>
        set({ proofDateCutOffStorage: value }),
    }),
    {
      name: "proof-cut-of-date",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

const useStoreTabStatus = create(
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
export {
  useFileStore,
  useStore,
  useStoreAttachmentStatusAfterSubmit,
  useStoreFinancialYear,
  useStoreITDeclarationITCutOffDate,
  useStoreITDeclarationStartFinancialYearStatus,
  useStoreITDeclarationStartFinancialYearStatusStorage,
  useStoreITDeclarationStartStatus,
  useStoreITDeclarationStartStatusStorage,
  useStoreProofOfInvestmentCutOffDate,
  useStoreProofOfInvestmentStartFinancialYearStatus,
  useStoreProofOfInvestmentStartStatus,
  useStoreProofOfInvestmentStartStatusStorage,
  useStoreRegime,
  useStoreSaveStatus80c,
  useStoreSaveStatus80d,
  useStoreSaveStatus80e,
  useStoreSaveStatusSection80c,
  useStoreSelectedDepartment,
  useStoreSelectedEmployee,
  useStoreSelectedLocation,
  useStoreSelectedPosition,
  useStoreSelectedProject,
  useStoreSelectedProofDepartment,
  useStoreSelectedProofEmployee,
  useStoreSelectedProofLocation,
  useStoreSelectedProofPosition,
  useStoreSelectedProofProject,
  useStoreSubmitStatusRedirect,
  useStoreTabStatus,
  useStoreTotalDepartment,
  useStoreTotalEmployee,
  useStoreTotalFilteredDepartment,
  useStoreTotalFilteredEmployee,
  useStoreTotalFilteredLocation,
  useStoreTotalFilteredPosition,
  useStoreTotalFilteredProject,
  useStoreTotalFilteredProofDepartment,
  useStoreTotalFilteredProofEmployee,
  useStoreTotalFilteredProofLocation,
  useStoreTotalFilteredProofPosition,
  useStoreTotalFilteredProofProject,
  useStoreTotalLocation,
  useStoreTotalPosition,
  useStoreTotalProject,
  useStoreUpdateSaveStatus80c,
  useStoreUpdateSaveStatus80d,
  useStoreUpdateSaveStatus80e,
};

import {create} from "zustand"
import {createJSONStorage,persist} from "zustand/middleware"

const useUpdateRfpDocs= create(
    persist(
      (set) => ({
        docsUpdateStatus: false,
        opportunity:"",
        setDocsUpdateStatus: (value) => set({ docsUpdateStatus: value }),
        setOpportunity: (value) => set({ opportunity: value }),

      }),
      {
        name: "doc-update-status",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  );

  const removePersistence = () => {
    sessionStorage.removeItem("doc-update-status");
  };

  const removeSubmitStatus=()=>{
    sessionStorage.removeItem("refresh-status");

  }
export {useUpdateRfpDocs,removePersistence,removeSubmitStatus}


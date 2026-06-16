import { createContext, useContext, useState } from "react";

const SortContext = createContext();

export const SortProvider = ({ children }) => {
  const [sortOrder, setSortOrder] = useState("asc");

  return (
    <SortContext.Provider value={{ sortOrder, setSortOrder }}>
      {children}
    </SortContext.Provider>
  );
};

export const useSort = () => useContext(SortContext);
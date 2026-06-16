import { createContext, useContext } from 'react';

// 1️⃣ Create context
export const EmployeeContext = createContext();

// 2️⃣ Hook to use it easily
export const useEmployee = () => useContext(EmployeeContext);
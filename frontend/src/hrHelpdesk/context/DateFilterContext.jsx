import { createContext, useContext, useState } from 'react';

export const DateFilterContext = createContext();

export const useDateFilter = () => useContext(DateFilterContext);

export const DateFilterProvider = ({ children }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  return (
    <DateFilterContext.Provider value={{ fromDate, toDate, setFromDate, setToDate }}>
      {children}
    </DateFilterContext.Provider>
  );
};
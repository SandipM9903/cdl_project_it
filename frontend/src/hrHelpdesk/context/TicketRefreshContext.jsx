import { createContext, useContext, useState } from 'react';

const TicketRefreshContext = createContext();

export const TicketRefreshProvider = ({ children }) => {
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const triggerRefresh = () => {
    setRefreshTrigger(prev => !prev);
  };

  return (
    <TicketRefreshContext.Provider value={{ refreshTrigger, triggerRefresh }}>
      {children}
    </TicketRefreshContext.Provider>
  );
};

export const useTicketRefresh = () => useContext(TicketRefreshContext);

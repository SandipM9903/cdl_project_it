import { createContext, useContext, useState } from 'react';

// Create the context
export const SearchContext = createContext();

// Custom hook to use search value
export const useSearch = () => useContext(SearchContext);

// Provider to wrap around App
export const SearchProvider = ({ children }) => {
  const [searchInput, setSearchInput] = useState('');

  return (
    <SearchContext.Provider value={{ searchInput, setSearchInput }}>
      {children}
    </SearchContext.Provider>
  );
};

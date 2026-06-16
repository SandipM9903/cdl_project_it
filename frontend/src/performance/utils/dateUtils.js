export const getCurrentFinancialYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // Jan = 1

  // Financial year starts from April
  if (month >= 4) {
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};

export const generateFinancialYears = (count = 3) => {
  const currentFY = getCurrentFinancialYear();
  const startYear = parseInt(currentFY.split("-")[0]);

  const years = [];

  for (let i = count - 1; i >= 0; i--) {
    years.push(`${startYear - i}-${startYear - i + 1}`);
  }

  return years;
};

export const getPreviousFinancialYear = (financialYear) => {
  if (!financialYear) return null;
  const [startYear] = financialYear.split('-');
  const previousStartYear = parseInt(startYear) - 1;
  return `${previousStartYear}-${previousStartYear + 1}`;
};

export const getNextFinancialYear = (financialYear) => {
  if (!financialYear) return null;
  const [startYear] = financialYear.split('-');
  const nextStartYear = parseInt(startYear) + 1;
  return `${nextStartYear}-${nextStartYear + 1}`;
};

// Helper to extract starting year from financial year string
export const extractStartYear = (financialYear) => {
  if (!financialYear) return null;
  return parseInt(financialYear.split('-')[0]);
};

// Helper to extract ending year from financial year string
export const extractEndYear = (financialYear) => {
  if (!financialYear) return null;
  return parseInt(financialYear.split('-')[1]);
};
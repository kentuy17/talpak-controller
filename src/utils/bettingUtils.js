
// Constants
export const COMMISSION = 5;

// Utility functions
export const calculatePayout = (bet, total) => {
  if (bet == 0) return parseFloat(0).toFixed(2);
  const comm = (total) => (total * Number.parseFloat(COMMISSION)) / 100;
  const win = total - comm(total);
  return ((win / parseInt(bet)) * 100).toFixed(2);
};

export const formatMoney = (amount) =>
  amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

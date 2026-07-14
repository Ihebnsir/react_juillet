export const formatPriceTND = (value, options = {}) => {
  const amount = Number(value);
  if (Number.isNaN(amount)) return "";

  const { currency = "TND", minimumFractionDigits = 2, maximumFractionDigits = 2 } = options;

  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
};


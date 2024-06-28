export const formatPrice = (price: number) => {
  return price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
};

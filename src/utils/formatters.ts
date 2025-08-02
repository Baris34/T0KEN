export const formatPara = (amount: number): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₺0';
  }
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatSayi = (num: number): string => {
  if (num === undefined || num === null || isNaN(num)) {
    return '0';
  }
  return new Intl.NumberFormat('tr-TR').format(num);
};

export const formatYuzde = (value: number): string => {
  if (value === undefined || value === null || isNaN(value)) {
    return '0.0%';
  }
  return `${value.toFixed(1)}%`;
}; 
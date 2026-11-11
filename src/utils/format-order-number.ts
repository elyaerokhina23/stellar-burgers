const orderNumberLength = 6;

export const formatOrderNumber = (orderNumber: number | string): string =>
  `#${String(orderNumber).padStart(orderNumberLength, '0')}`;

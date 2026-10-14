export type CalculateShippingFeeItem = {
  variantId: string;
  quantity: number;
};

export type CalculateShippingFeeInput = {
  addressId: string;
  deliveryDate: string;
  items: CalculateShippingFeeItem[];
};

export type ShippingFeeQuote = {
  zoneId: string;
  zoneName: string;
  fee: number;
  isFreeShip: boolean;
  amountToFreeShip: number | null;
  subtotal: number;
  chargeableWeight: number;
  estimatedDaysMin: number | null;
  estimatedDaysMax: number | null;
};

/** Line item sent to Paymob during order registration (Step 2). */
export interface PaymobItem {
  name: string;
  amount_cents: number; // unit price in piasters
  description: string;
  quantity: number;
}

/** Billing data required for the payment key request (Step 3). */
export interface PaymobBillingData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  apartment: string; // "NA" when not applicable
  floor: string; // "NA" when not applicable
  street: string;
  building: string; // "NA" when not applicable
  shipping_method: string; // "PKG"
  postal_code: string;
  city: string;
  country: string;
  state: string;
}

export interface InitiatePaymentResult {
  paymobOrderId: number;
  paymentKey: string;
}

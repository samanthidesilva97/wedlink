import crypto from 'crypto'

// ─── Config ──────────────────────────────────────────────────────────────────
export const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID!
export const PAYHERE_MERCHANT_SECRET = process.env.PAYHERE_MERCHANT_SECRET!
export const PAYHERE_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://www.payhere.lk'
    : 'https://sandbox.payhere.lk'

// ─── Commission ───────────────────────────────────────────────────────────────
export const COMMISSION_RATE = 0.1 // 10% platform fee

export function calculateCommission(amountLKR: number) {
  return Math.round(amountLKR * COMMISSION_RATE)
}

export function calculateVendorPayout(amountLKR: number) {
  return amountLKR - calculateCommission(amountLKR)
}

// ─── Hash Helpers ─────────────────────────────────────────────────────────────

/**
 * Generate the payment hash for the PayHere checkout form.
 * Formula: MD5( merchant_id + order_id + amount + currency + MD5(merchant_secret).toUpperCase() ).toUpperCase()
 */
export function generateCheckoutHash(
  orderId: string,
  amount: number,
  currency: string = 'LKR'
): string {
  const secretHash = crypto
    .createHash('md5')
    .update(PAYHERE_MERCHANT_SECRET)
    .digest('hex')
    .toUpperCase()

  const raw = `${PAYHERE_MERCHANT_ID}${orderId}${amount.toFixed(2)}${currency}${secretHash}`
  return crypto.createHash('md5').update(raw).digest('hex').toUpperCase()
}

/**
 * Verify the IPN (Instant Payment Notification) signature from PayHere.
 * Formula: MD5( merchant_id + order_id + payhere_amount + payhere_currency + status_code + MD5(merchant_secret).toUpperCase() ).toUpperCase()
 */
export function verifyIPNSignature(params: {
  merchant_id: string
  order_id: string
  payhere_amount: string
  payhere_currency: string
  status_code: string
  md5sig: string
}): boolean {
  const secretHash = crypto
    .createHash('md5')
    .update(PAYHERE_MERCHANT_SECRET)
    .digest('hex')
    .toUpperCase()

  const raw = `${params.merchant_id}${params.order_id}${params.payhere_amount}${params.payhere_currency}${params.status_code}${secretHash}`
  const computed = crypto.createHash('md5').update(raw).digest('hex').toUpperCase()
  return computed === params.md5sig
}

// ─── IPN Status Codes ────────────────────────────────────────────────────────
export const PAYHERE_STATUS = {
  SUCCESS: '2',      // Payment successful
  PENDING: '0',      // Payment pending
  CANCELLED: '-1',   // Cancelled by user
  FAILED: '-2',      // Failed
  CHARGEDBACK: '-3', // Charged back
} as const

// ─── Checkout Payload Builder ─────────────────────────────────────────────────

export interface PayHereCheckoutParams {
  orderId: string          // booking id
  amount: number           // in LKR
  description: string
  customerFirstName: string
  customerLastName: string
  customerEmail: string
  customerPhone: string
  notifyUrl: string        // your IPN endpoint
  returnUrl: string        // success redirect
  cancelUrl: string        // cancel redirect
  currency?: string
}

export function buildCheckoutPayload(params: PayHereCheckoutParams) {
  const currency = params.currency ?? 'LKR'
  const hash = generateCheckoutHash(params.orderId, params.amount, currency)

  return {
    merchant_id: PAYHERE_MERCHANT_ID,
    return_url: params.returnUrl,
    cancel_url: params.cancelUrl,
    notify_url: params.notifyUrl,
    order_id: params.orderId,
    items: params.description,
    currency,
    amount: params.amount.toFixed(2),
    first_name: params.customerFirstName,
    last_name: params.customerLastName,
    email: params.customerEmail,
    phone: params.customerPhone,
    address: 'N/A',
    city: 'Colombo',
    country: 'Sri Lanka',
    hash,
  }
}

// ─── Recurring / Preapproval Payload Builder ─────────────────────────────────

export interface PayHereRecurringParams {
  orderId: string           // unique subscription id
  amount: number            // in LKR (monthly subscription price)
  description: string
  customerFirstName: string
  customerLastName: string
  customerEmail: string
  customerPhone: string
  notifyUrl: string
  returnUrl: string
  cancelUrl: string
  recurrenceMonths?: number // default 1 (monthly)
  durationMonths?: number   // 0 = forever, otherwise N months
  currency?: string
}

export function buildRecurringPayload(params: PayHereRecurringParams) {
  const currency = params.currency ?? 'LKR'
  const hash = generateCheckoutHash(params.orderId, params.amount, currency)

  return {
    merchant_id: PAYHERE_MERCHANT_ID,
    return_url: params.returnUrl,
    cancel_url: params.cancelUrl,
    notify_url: params.notifyUrl,
    order_id: params.orderId,
    items: params.description,
    currency,
    amount: params.amount.toFixed(2),
    first_name: params.customerFirstName,
    last_name: params.customerLastName,
    email: params.customerEmail,
    phone: params.customerPhone,
    address: 'N/A',
    city: 'Colombo',
    country: 'Sri Lanka',
    recurrence: `${params.recurrenceMonths ?? 1} Month`,
    duration: params.durationMonths ? `${params.durationMonths} Month` : 'Forever',
    hash,
  }
}

// ─── Subscription pricing in LKR ─────────────────────────────────────────────
// Approximate conversion — update to your preferred fixed rate or use live FX
export const PREMIUM_MONTHLY_LKR = 4500   // ~$15 USD at ~300 LKR/USD
export const PREMIUM_YEARLY_LKR  = 45000  // ~$150 USD

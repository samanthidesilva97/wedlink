export type UserRole = 'couple' | 'vendor' | 'admin'

export type VendorStatus = 'pending' | 'approved' | 'rejected' | 'suspended'

export type BookingStatus =
  | 'inquiry'
  | 'negotiating'
  | 'awaiting_payment'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'expired'
  | 'refunded'
  | 'disputed'

export type SubscriptionTier = 'free' | 'premium'

export interface User {
  id: string
  email: string
  role: UserRole
  full_name: string
  phone?: string
  avatar_url?: string
  locale: 'en' | 'si' | 'ta'
  created_at: string
}

export interface CoupleProfile {
  id: string
  user_id: string
  partner1_name: string
  partner2_name: string
  wedding_date?: string
  wedding_location?: string
  total_budget?: number
  guest_count?: number
  created_at: string
}

export interface VendorProfile {
  id: string
  user_id: string
  business_name: string
  category: VendorCategory
  description: string
  location: string
  city: string
  district: string
  price_min: number
  price_max: number
  is_verified: boolean
  status: VendorStatus
  subscription_tier: SubscriptionTier
  subscription_payment_id?: string      // last PayHere recurring payment_id
  subscription_expires_at?: string      // ISO date of next billing / expiry
  portfolio_images: string[]
  video_url?: string
  website_url?: string
  instagram_url?: string
  facebook_url?: string
  payhere_merchant_id?: string          // vendor's own PayHere merchant id (future)
  payout_enabled: boolean               // true once admin approves payout
  avg_rating: number
  review_count: number
  profile_completeness: number
  created_at: string
}

export type VendorCategory =
  | 'venue'
  | 'photography'
  | 'videography'
  | 'catering'
  | 'florist'
  | 'music_dj'
  | 'hair_makeup'
  | 'attire'
  | 'cake'
  | 'transport'
  | 'decor'
  | 'invitations'
  | 'officiant'
  | 'planning'
  | 'other'

export interface Booking {
  id: string
  couple_id: string
  vendor_id: string
  vendor_profile?: VendorProfile
  couple_profile?: CoupleProfile
  status: BookingStatus
  event_date: string
  service_description: string
  estimated_guests?: number
  agreed_price?: number                 // in LKR
  deposit_amount?: number               // in LKR
  payhere_payment_id?: string           // PayHere payment_id from IPN
  payhere_payment_method?: string       // e.g. "VISA", "MASTER", "eZ Cash"
  invoice_url?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  booking_id: string
  sender_id: string
  sender_name: string
  content: string
  attachment_url?: string
  attachment_type?: 'image' | 'pdf'
  is_read: boolean
  created_at: string
}

export interface Review {
  id: string
  booking_id: string
  vendor_id: string
  couple_id: string
  couple_name: string
  overall_rating: number
  quality_rating: number
  communication_rating: number
  value_rating: number
  punctuality_rating: number
  comment: string
  photos?: string[]
  vendor_reply?: string
  status: 'pending' | 'approved' | 'flagged' | 'removed'
  sentiment_score?: number
  positive_themes?: string[]
  negative_themes?: string[]
  created_at: string
}

export interface Guest {
  id: string
  couple_id: string
  full_name: string
  email?: string
  phone?: string
  rsvp_status: 'pending' | 'confirmed' | 'declined'
  meal_preference?: string
  dietary_restrictions?: string
  has_plus_one: boolean
  plus_one_name?: string
  side: "bride's" | "groom's" | 'mutual'
  table_id?: string
  group_label?: string
  rsvp_token?: string
  created_at: string
}

export interface SeatingTable {
  id: string
  couple_id: string
  name: string
  shape: 'round' | 'rectangular' | 'head'
  capacity: number
  position_x: number
  position_y: number
  guests: Guest[]
}

export interface ChecklistItem {
  id: string
  couple_id: string
  title: string
  category: string
  due_date?: string
  is_completed: boolean
  is_overdue: boolean
  vendor_category?: VendorCategory
  recommended_months_before: number
  notes?: string
}

export interface BudgetCategory {
  id: string
  couple_id: string
  name: string
  estimated_amount: number
  actual_amount: number
  vendor_category?: VendorCategory
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'message' | 'booking' | 'payment' | 'review' | 'checklist' | 'milestone' | 'rsvp' | 'admin'
  is_read: boolean
  action_url?: string
  created_at: string
}

export interface VendorAvailability {
  id: string
  vendor_id: string
  date: string
  is_available: boolean
}

export interface SavedVendor {
  couple_id: string
  vendor_id: string
  vendor_profile?: VendorProfile
  saved_at: string
}

export interface MoodBoardItem {
  id: string
  couple_id: string
  image_url: string
  position_x: number
  position_y: number
  width: number
  label?: string
}

export interface TimelineEvent {
  id: string
  couple_id: string
  time: string
  title: string
  description?: string
  vendor_type?: VendorCategory
  is_manual: boolean
}

export interface Dispute {
  id: string
  booking_id: string
  initiated_by: string
  reason: string
  description: string
  status: 'open' | 'investigating' | 'resolved' | 'closed'
  resolution?: string
  created_at: string
}

export const VENDOR_CATEGORIES = [
  { value: 'venue', label: 'Venue' },
  { value: 'photography', label: 'Photography' },
  { value: 'videography', label: 'Videography' },
  { value: 'catering', label: 'Catering' },
  { value: 'florist', label: 'Florist & Flowers' },
  { value: 'music_dj', label: 'Music & DJ' },
  { value: 'hair_makeup', label: 'Hair & Makeup' },
  { value: 'attire', label: 'Bridal Attire' },
  { value: 'cake', label: 'Wedding Cake' },
  { value: 'transport', label: 'Transport' },
  { value: 'decor', label: 'Decoration' },
  { value: 'invitations', label: 'Invitations' },
  { value: 'officiant', label: 'Officiant' },
  { value: 'planning', label: 'Wedding Planning' },
  { value: 'other', label: 'Other' },
] as const

export const SRI_LANKA_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
  'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
  'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
  'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
  'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya',
]

export const SEED_TASKS = [
  { title: 'Set your wedding date', category: 'Planning', months: 18 },
  { title: 'Create your budget', category: 'Finance', months: 18 },
  { title: 'Book your venue', category: 'Venue', months: 12 },
  { title: 'Book your photographer', category: 'Photography', months: 12 },
  { title: 'Book your videographer', category: 'Videography', months: 10 },
  { title: 'Book your caterer', category: 'Catering', months: 10 },
  { title: 'Book hair & makeup artist', category: 'Hair & Makeup', months: 8 },
  { title: 'Book your florist', category: 'Florist', months: 8 },
  { title: 'Book your DJ / band', category: 'Music', months: 8 },
  { title: 'Book your transport', category: 'Transport', months: 6 },
  { title: 'Order wedding cake', category: 'Cake', months: 3 },
  { title: 'Send invitations', category: 'Invitations', months: 2 },
  { title: 'Create guest list', category: 'Guests', months: 6 },
  { title: 'Send RSVP requests', category: 'Guests', months: 3 },
  { title: 'Finalise seating plan', category: 'Planning', months: 1 },
  { title: 'Plan your honeymoon', category: 'Honeymoon', months: 6 },
  { title: 'Book hotel for wedding night', category: 'Accommodation', months: 4 },
  { title: 'Purchase wedding rings', category: 'Attire', months: 4 },
  { title: 'Schedule dress fittings', category: 'Attire', months: 6 },
  { title: 'Create day-of timeline', category: 'Planning', months: 1 },
]

export const BUDGET_CATEGORIES = [
  'Venue',
  'Catering',
  'Photography',
  'Videography',
  'Attire',
  'Flowers',
  'Music',
  'Cake',
  'Invitations',
  'Transport',
  'Honeymoon',
  'Decoration',
  'Accommodation',
  'Miscellaneous',
]

export const PREMIUM_PLAN_PRICE = 15 // USD per month
export const PREMIUM_PLAN_YEARLY = 150 // USD per year

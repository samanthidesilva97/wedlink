import { Resend } from 'resend'
export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendBookingInquiryEmail(to: string, coupleNames: string, vendorName: string, date: string) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `New Booking Inquiry — ${coupleNames}`,
    html: `<h2>New inquiry from ${coupleNames} for ${date}</h2>
           <a href="${process.env.NEXT_PUBLIC_APP_URL}/vendor/bookings">View →</a>`,
  })
}

export async function sendRSVPEmail(to: string, guestName: string, coupleNames: string, rsvpLink: string) {
  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject: `RSVP — ${coupleNames}'s Wedding`,
    html: `<p>Dear ${guestName},</p>
           <a href="${rsvpLink}" style="background:#C21A6B;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">RSVP Now</a>`,
  })
}

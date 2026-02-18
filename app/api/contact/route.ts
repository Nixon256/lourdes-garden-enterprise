import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Rate limiting: simple in-memory store
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()
const RATE_LIMIT_MAX = 100 // max 100 submissions (increased for testing)
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // per hour

function isRateLimited(ip: string): boolean {
    const now = Date.now()
    const record = rateLimitMap.get(ip)

    if (!record || now - record.lastReset > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(ip, { count: 1, lastReset: now })
        return false
    }

    if (record.count >= RATE_LIMIT_MAX) {
        return true
    }

    record.count++
    return false
}

// Sanitize input to prevent XSS
function sanitize(input: string): string {
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim()
}

export async function POST(request: NextRequest) {
    try {
        const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'

        // Rate limiting
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Too many submissions. Please try again later.' },
                { status: 429 }
            )
        }

        const body = await request.json()
        const { name, email, phone, subject, message } = body

        // Validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: 'Name, email, subject, and message are required.' },
                { status: 400 }
            )
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Please provide a valid email address.' },
                { status: 400 }
            )
        }

        // Length validation
        if (name.length > 100 || email.length > 255 || message.length > 5000) {
            return NextResponse.json(
                { error: 'Input exceeds maximum length.' },
                { status: 400 }
            )
        }

        // Store in database
        const submission = await prisma.contactSubmission.create({
            data: {
                name: sanitize(name),
                email: sanitize(email),
                phone: phone ? sanitize(phone) : null,
                subject: sanitize(subject),
                message: sanitize(message),
                ipAddress: ip,
            },
        })

        // Try to send email notification (non-blocking)
        try {
            await sendEmailNotification({
                name: sanitize(name),
                email: sanitize(email),
                phone: phone ? sanitize(phone) : undefined,
                subject: sanitize(subject),
                message: sanitize(message),
            })
        } catch (emailError) {
            console.error('Email notification failed:', emailError)
            // Don't fail the submission if email fails
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Your message has been sent successfully! We will get back to you soon.',
                id: submission.id,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Contact form error:', error)
        return NextResponse.json(
            { error: 'An unexpected error occurred. Please try again.' },
            { status: 500 }
        )
    }
}

// GET: Fetch all submissions (admin only - future use)
export async function GET(request: NextRequest) {
    try {
        const submissions = await prisma.contactSubmission.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50,
        })

        return NextResponse.json({ submissions })
    } catch (error) {
        console.error('Error fetching submissions:', error)
        return NextResponse.json(
            { error: 'Failed to fetch submissions.' },
            { status: 500 }
        )
    }
}

// Email notification helper
async function sendEmailNotification(data: {
    name: string
    email: string
    phone?: string
    subject: string
    message: string
}) {
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    const ADMIN_EMAIL = 'lourdesgarden.odc@gmail.com'

    if (!RESEND_API_KEY || RESEND_API_KEY === 'your-resend-api-key') {
        console.log('📧 Email notification (Resend not configured):')
        console.log(`   From: ${data.name} <${data.email}>`)
        console.log(`   Subject: ${data.subject}`)
        console.log(`   Message: ${data.message}`)
        return
    }

    // Send to admin
    console.log('📤 Attempting to send email via Resend API...')
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
            from: 'Lourdes Garden <onboarding@resend.dev>',
            to: [ADMIN_EMAIL],
            subject: `New Contact: ${data.subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #16a34a; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                        <h2 style="margin: 0;">🌿 New Contact Form Submission</h2>
                    </div>
                    <div style="padding: 24px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 8px 0; font-weight: bold; width: 100px;">Name:</td><td>${data.name}</td></tr>
                            <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td><a href="mailto:${data.email}">${data.email}</a></td></tr>
                            ${data.phone ? `<tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td><a href="tel:${data.phone}">${data.phone}</a></td></tr>` : ''}
                            <tr><td style="padding: 8px 0; font-weight: bold;">Subject:</td><td>${data.subject}</td></tr>
                        </table>
                        <hr style="margin: 16px 0; border: none; border-top: 1px solid #e5e7eb;" />
                        <h3 style="color: #374151;">Message:</h3>
                        <p style="color: #4b5563; line-height: 1.6;">${data.message}</p>
                    </div>
                </div>
            `,
        }),
    })

    const result = await res.json()
    if (!res.ok) {
        console.error('❌ Resend API Error:', result)
    }
}

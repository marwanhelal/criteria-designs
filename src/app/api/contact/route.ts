import { NextRequest, NextResponse } from 'next/server'

// POST /api/contact - Handle contact form submissions
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Log the contact form submission (in production, send email or store in DB)
    console.log('Contact form submission:', {
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      subject: data.subject,
      message: data.message,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, message: 'Message received' })
  } catch (error) {
    console.error('Error handling contact form:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // Check if setup already done
    const existingUser = await prisma.user.findFirst()
    if (existingUser) {
      return NextResponse.json({
        message: 'Setup already completed',
        status: 'exists'
      })
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.create({
      data: {
        email: 'admin@criteriadesigns.com',
        name: 'Admin',
        password: hashedPassword,
        role: 'ADMIN',
      },
    })

    // Create default site settings
    await prisma.siteSettings.create({
      data: {
        id: 'main',
        companyNameEn: 'Criteria Designs',
        companyNameAr: 'كرايتيريا للتصميم',
        email: 'info@criteriadesigns.com',
      },
    })

    return NextResponse.json({
      message: 'Setup completed successfully!',
      admin: admin.email,
      status: 'created'
    })
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json({
      error: 'Setup failed'
    }, { status: 500 })
  }
}

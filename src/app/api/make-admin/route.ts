import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await prisma.user.update({
      where: { email: 'alif63341f@gmail.com' },
      data: { role: 'ADMIN' },
    })
    
    return NextResponse.json({
      success: true,
      message: 'User successfully updated to ADMIN',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Failed to make user admin:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}

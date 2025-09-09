import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/users - Starting user creation')
    
    // Check database connection
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
    
    const body = await request.json()
    const { name } = body

    console.log('Request body:', { name })

    // Validate required fields
    if (!name || !name.trim()) {
      console.log('Validation failed: name is required')
      return NextResponse.json(
        { error: 'User name is required' },
        { status: 400 }
      )
    }

    console.log('Attempting to create user with name:', name.trim())

    // Create the user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
      }
    })

    console.log('User created successfully:', user.id)

    return NextResponse.json({
      user,
      message: 'User created successfully'
    })

  } catch (error) {
    console.error('Create user error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('GET /api/users - Starting user fetch')
    console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
    
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })

    console.log('Users fetched successfully:', users.length)

    // Add "(Deleted User)" tag to deleted users
    const usersWithDeletedTag = users.map(user => ({
      ...user,
      name: user.deletedAt ? `${user.name} (Deleted User)` : user.name
    }))

    return NextResponse.json({ users: usersWithDeletedTag })
  } catch (error) {
    console.error('Get users error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, name, qrCode, totalOwed, totalOwing } = body

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Update the user
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(qrCode !== undefined && { qrCode }),
        ...(totalOwed !== undefined && { totalOwed: parseFloat(totalOwed) || 0 }),
        ...(totalOwing !== undefined && { totalOwing: parseFloat(totalOwing) || 0 })
      }
    })

    return NextResponse.json({
      user,
      message: 'User updated successfully'
    })

  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if user is already deleted
    if (user.deletedAt) {
      return NextResponse.json(
        { error: 'User is already deleted' },
        { status: 400 }
      )
    }

    // Soft delete the user (set deletedAt timestamp)
    await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() }
    })

    return NextResponse.json({
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

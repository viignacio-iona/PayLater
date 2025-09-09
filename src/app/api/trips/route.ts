import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, startDate, endDate, createdBy } = body

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Trip name is required' },
        { status: 400 }
      )
    }

    if (!createdBy) {
      return NextResponse.json(
        { error: 'Trip organizer is required' },
        { status: 400 }
      )
    }

    // Verify the user exists
    const creatorUser = await prisma.user.findUnique({
      where: { id: createdBy }
    })

    if (!creatorUser) {
      return NextResponse.json(
        { error: 'Invalid trip organizer' },
        { status: 400 }
      )
    }

    // Create the trip
    const trip = await prisma.trip.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        createdBy: creatorUser.id,
        isActive: true,
      },
      include: {
        creator: true,
        members: {
          include: {
            user: true
          }
        }
      }
    })

    // Add the creator as a member
    await prisma.tripMember.create({
      data: {
        tripId: trip.id,
        userId: creatorUser.id,
        role: 'CREATOR'
      }
    })

    return NextResponse.json({
      trip,
      message: 'Trip created successfully'
    })

  } catch (error) {
    console.error('Create trip error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const trips = await prisma.trip.findMany({
      where: { isActive: true },
      include: {
        creator: true,
        members: {
          include: {
            user: true
          }
        },
        expenses: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ trips })
  } catch (error) {
    console.error('Get trips error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

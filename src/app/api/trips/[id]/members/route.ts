import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Check if trip exists
    const trip = await prisma.trip.findUnique({
      where: { id }
    })

    if (!trip) {
      return NextResponse.json(
        { error: "Trip not found" },
        { status: 404 }
      )
    }

    // Check if user is already a member
    const existingMember = await prisma.tripMember.findFirst({
      where: {
        tripId: id,
        userId: userId
      }
    })

    if (existingMember) {
      return NextResponse.json(
        { error: "User is already a member of this trip" },
        { status: 400 }
      )
    }

    // Add user to trip
    const tripMember = await prisma.tripMember.create({
      data: {
        tripId: id,
        userId: userId,
        role: 'MEMBER'
      },
      include: {
        user: true
      }
    })

    return NextResponse.json({
      message: "User added to trip successfully",
      member: tripMember
    })
  } catch (error) {
    console.error("Error adding user to trip:", error)
    return NextResponse.json(
      { error: "Failed to add user to trip" },
      { status: 500 }
    )
  }
}

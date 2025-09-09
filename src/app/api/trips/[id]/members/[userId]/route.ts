import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; userId: string }> }
) {
  try {
    const { id, userId } = await params

    // Check if trip member exists
    const tripMember = await prisma.tripMember.findFirst({
      where: {
        tripId: id,
        userId: userId
      }
    })

    if (!tripMember) {
      return NextResponse.json(
        { error: "User is not a member of this trip" },
        { status: 404 }
      )
    }

    // Don't allow removing the creator
    if (tripMember.role === 'CREATOR') {
      return NextResponse.json(
        { error: "Cannot remove the trip creator" },
        { status: 400 }
      )
    }

    // Remove user from trip
    await prisma.tripMember.delete({
      where: {
        id: tripMember.id
      }
    })

    return NextResponse.json({
      message: "User removed from trip successfully"
    })
  } catch (error) {
    console.error("Error removing user from trip:", error)
    return NextResponse.json(
      { error: "Failed to remove user from trip" },
      { status: 500 }
    )
  }
}

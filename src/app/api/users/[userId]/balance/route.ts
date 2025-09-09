import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { calculateUserTotalBalance } from '@/lib/balance-calculator'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Get all trips where the user is a member
    const userTrips = await prisma.tripMember.findMany({
      where: { userId },
      include: {
        trip: {
          include: {
            expenses: {
              include: {
                splits: true
              }
            }
          }
        }
      }
    })

    // Calculate total balance across all trips
    let totalOwed = 0
    let totalOwing = 0
    const tripBalances: Array<{
      tripId: string
      tripName: string
      totalOwed: number
      totalOwing: number
    }> = []

    for (const userTrip of userTrips) {
      const trip = userTrip.trip
      const expenses = trip.expenses

      // Calculate balance for this specific trip
      const tripBalance = calculateUserTotalBalance(userId, expenses.map(expense => ({
        amount: Number(expense.amount),
        paidBy: expense.paidBy,
        splits: expense.splits.map(split => ({
          userId: split.userId,
          amount: Number(split.amount)
        }))
      })))

      // Add to totals
      totalOwed += tripBalance.totalOwed
      totalOwing += tripBalance.totalOwing

      // Store trip-specific balance (only if there are outstanding amounts)
      if (tripBalance.totalOwed > 0 || tripBalance.totalOwing > 0) {
        tripBalances.push({
          tripId: trip.id,
          tripName: trip.name,
          totalOwed: tripBalance.totalOwed,
          totalOwing: tripBalance.totalOwing
        })
      }
    }

    const netBalance = totalOwing - totalOwed

    return NextResponse.json({
      userId,
      youOwe: totalOwed,
      youAreOwed: totalOwing,
      netBalance,
      tripBalances: tripBalances.map(trip => ({
        tripId: trip.tripId,
        tripName: trip.tripName,
        youOwe: trip.totalOwed,
        youAreOwed: trip.totalOwing
      }))
    })

  } catch (error) {
    console.error('Error calculating user balance:', error)
    return NextResponse.json(
      { error: 'Failed to calculate user balance' },
      { status: 500 }
    )
  }
}

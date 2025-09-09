import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        creator: true,
        members: {
          include: {
            user: true
          }
        },
        expenses: {
          include: {
            payer: true,
            splits: {
              include: {
                user: true
              }
            }
          },
          orderBy: { date: 'desc' }
        }
      }
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ trip })
  } catch (error) {
    console.error('Get trip error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, description, startDate, endDate } = body

    const trip = await prisma.trip.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
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

    return NextResponse.json({
      trip,
      message: 'Trip updated successfully'
    })

  } catch (error) {
    console.error('Update trip error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // First, check if trip exists and get its data
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: true
          }
        },
        expenses: {
          include: {
            payer: true,
            splits: {
              include: {
                user: true
              }
            }
          }
        }
      }
    })

    if (!trip) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      )
    }

    // Check for unsettled amounts (positive amounts owed)
    const { calculateBalances } = await import('@/lib/balance-calculator')
    
    const balances = calculateBalances(
      trip.expenses.map(expense => ({
        id: expense.id,
        amount: parseFloat(expense.amount.toString()),
        paidBy: expense.paidBy,
        splits: expense.splits.map(split => ({
          userId: split.userId,
          amount: parseFloat(split.amount.toString())
        }))
      })),
      trip.members.map(member => ({
        id: member.user.id,
        name: member.user.name
      }))
    )

    // Check if any user has a negative net balance (someone owes money)
    const hasUnsettledAmounts = balances.some(balance => balance.netBalance < 0)

    if (hasUnsettledAmounts) {
      return NextResponse.json(
        { 
          error: 'Cannot delete trip with unsettled amounts. Please settle all debts before deleting the trip.',
          code: 'UNSETTLED_AMOUNTS'
        },
        { status: 400 }
      )
    }

    // Delete trip (members and expenses will be deleted automatically due to cascade)
    await prisma.trip.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Trip deleted successfully'
    })

  } catch (error) {
    console.error('Delete trip error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

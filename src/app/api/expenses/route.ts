import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { SplitType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      tripId, 
      title, 
      description, 
      amount, 
      paidBy, 
      splitType = 'EQUAL',
      splits = [] // Array of { userId, amount } objects
    } = body

    // Validate required fields
    if (!tripId || !title || !amount || !paidBy) {
      return NextResponse.json(
        { error: 'Trip ID, title, amount, and paid by are required' },
        { status: 400 }
      )
    }

    // Validate amount is positive
    if (parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Create the expense with splits in a transaction
    const expense = await prisma.$transaction(async (tx) => {
      // Create the expense
      const newExpense = await tx.expense.create({
        data: {
          tripId,
          title: title.trim(),
          description: description?.trim(),
          amount: parseFloat(amount),
          paidBy,
          splitType: splitType as SplitType,
        },
        include: {
          payer: true,
          trip: true,
        }
      })

      // Create expense splits
      if (splits.length > 0) {
        await tx.expenseSplit.createMany({
          data: splits.map((split: { userId: string; amount: string | number }) => ({
            expenseId: newExpense.id,
            userId: split.userId,
            amount: parseFloat(split.amount.toString()),
          }))
        })
      }

      // Return expense with splits
      return await tx.expense.findUnique({
        where: { id: newExpense.id },
        include: {
          payer: true,
          trip: true,
          splits: {
            include: {
              user: true
            }
          }
        }
      })
    })

    return NextResponse.json({
      expense,
      message: 'Expense created successfully'
    })

  } catch (error) {
    console.error('Create expense error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tripId = searchParams.get('tripId')

    if (!tripId) {
      return NextResponse.json(
        { error: 'Trip ID is required' },
        { status: 400 }
      )
    }

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      include: {
        payer: true,
        splits: {
          include: {
            user: true
          }
        }
      },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json({ expenses })
  } catch (error) {
    console.error('Get expenses error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

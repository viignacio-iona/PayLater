import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { SplitType } from '@prisma/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const expense = await prisma.expense.findUnique({
      where: { id },
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

    if (!expense) {
      return NextResponse.json(
        { error: 'Expense not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ expense })
  } catch (error) {
    console.error('Get expense error:', error)
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
    const { 
      title, 
      description, 
      amount, 
      date,
      paidBy, 
      splitType,
      splits = []
    } = body

    // Validate amount if provided
    if (amount && parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Update expense and splits in a transaction
    const expense = await prisma.$transaction(async (tx) => {
      // Update the expense
      await tx.expense.update({
        where: { id },
        data: {
          ...(title && { title: title.trim() }),
          ...(description !== undefined && { description: description?.trim() }),
          ...(amount && { amount: parseFloat(amount) }),
          ...(date && { date: new Date(date) }),
          ...(paidBy && { paidBy }),
          ...(splitType && { splitType: splitType as SplitType }),
        },
        include: {
          payer: true,
          trip: true,
        }
      })

      // Update splits if provided
      if (splits.length > 0) {
        // Delete existing splits
        await tx.expenseSplit.deleteMany({
          where: { expenseId: id }
        })

        // Create new splits
        await tx.expenseSplit.createMany({
          data: splits.map((split: { userId: string; amount: string | number }) => ({
            expenseId: id,
            userId: split.userId,
            amount: parseFloat(split.amount.toString()),
          }))
        })
      }

      // Return updated expense with splits
      return await tx.expense.findUnique({
        where: { id },
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
      message: 'Expense updated successfully'
    })

  } catch (error) {
    console.error('Update expense error:', error)
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
    // Delete expense (splits will be deleted automatically due to cascade)
    await prisma.expense.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Expense deleted successfully'
    })

  } catch (error) {
    console.error('Delete expense error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

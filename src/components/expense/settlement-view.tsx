"use client"

import { useState, useEffect, useCallback } from "react"
import { Receipt, User, ChevronUp, ChevronRight, QrCode, Check, CheckCircle } from "lucide-react"
import { formatCurrency } from "@/lib/balance-calculator"

interface User {
  id: string
  name: string
  avatar?: string
  qrCode?: string
  totalOwed: number
  totalOwing: number
  createdAt: string
}

interface Expense {
  id: string
  title: string
  description?: string
  amount: number
  date: string
  paidBy: string
  splitType: string
  payer: {
    id: string
    name: string
  }
  splits: Array<{
    id: string
    amount: number
    user: {
      id: string
      name: string
    }
  }>
}

interface UserExpenseBreakdown {
  userId: string
  userName: string
  totalOwed: number
  paidByBreakdown: Array<{
    paidBy: string
    paidByName: string
    totalPaidForUser: number
    expenses: Array<{
      expenseId: string
      expenseTitle: string
      expenseAmount: number
      userShare: number
      date: string
    }>
  }>
}

interface SettlementViewProps {
  users: User[]
  expenses: Expense[]
  onShowQrCode: (user: User) => void
}

export function SettlementView({ users, expenses, onShowQrCode }: SettlementViewProps) {
  const [userBreakdowns, setUserBreakdowns] = useState<UserExpenseBreakdown[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedPayers, setExpandedPayers] = useState<Set<string>>(new Set())
  const [paidStatus, setPaidStatus] = useState<Set<string>>(new Set())

  const togglePayerExpanded = (payerKey: string) => {
    setExpandedPayers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(payerKey)) {
        newSet.delete(payerKey)
      } else {
        newSet.add(payerKey)
      }
      return newSet
    })
  }

  const togglePaidStatus = (payerKey: string) => {
    setPaidStatus(prev => {
      const newSet = new Set(prev)
      if (newSet.has(payerKey)) {
        newSet.delete(payerKey)
      } else {
        newSet.add(payerKey)
      }
      return newSet
    })
  }

  const showQrCode = (user: User) => {
    onShowQrCode(user)
  }

  const calculateUserBreakdowns = useCallback(() => {
    if (!expenses.length || !users.length) {
      setUserBreakdowns([])
      return
    }

    const breakdowns: UserExpenseBreakdown[] = users.map(user => {
      // Get all expenses the user is part of, but exclude self-payments
      const userExpenses = expenses
        .filter(expense => 
          expense.splits.some(split => split.user.id === user.id) &&
          expense.paidBy !== user.id // Exclude expenses where user paid for themselves
        )
        .map(expense => {
          const userSplit = expense.splits.find(split => split.user.id === user.id)
          return {
            expenseId: expense.id,
            expenseTitle: expense.title,
            expenseAmount: parseFloat(expense.amount.toString()),
            userShare: userSplit ? parseFloat(userSplit.amount.toString()) : 0,
            paidBy: expense.paidBy,
            paidByName: expense.payer.name,
            date: expense.date
          }
        })

      // Group expenses by who paid them
      const paidByMap = new Map<string, {
        paidBy: string
        paidByName: string
        totalPaidForUser: number
        expenses: Array<{
          expenseId: string
          expenseTitle: string
          expenseAmount: number
          userShare: number
          date: string
        }>
      }>()

      userExpenses.forEach(expense => {
        const key = expense.paidBy
        if (!paidByMap.has(key)) {
          paidByMap.set(key, {
            paidBy: expense.paidBy,
            paidByName: expense.paidByName,
            totalPaidForUser: 0,
            expenses: []
          })
        }
        
        const paidByEntry = paidByMap.get(key)!
        paidByEntry.totalPaidForUser += expense.userShare
        paidByEntry.expenses.push({
          expenseId: expense.expenseId,
          expenseTitle: expense.expenseTitle,
          expenseAmount: expense.expenseAmount,
          userShare: expense.userShare,
          date: expense.date
        })
      })

      const totalOwed = userExpenses.reduce((total, exp) => total + exp.userShare, 0)
      const paidByBreakdown = Array.from(paidByMap.values())

      // Sort by total paid for user (descending)
      paidByBreakdown.sort((a, b) => b.totalPaidForUser - a.totalPaidForUser)

      return {
        userId: user.id,
        userName: user.name,
        totalOwed,
        paidByBreakdown
      }
    })

    // Sort by total owed (descending)
    breakdowns.sort((a, b) => b.totalOwed - a.totalOwed)
    setUserBreakdowns(breakdowns)
  }, [expenses, users])

  useEffect(() => {
    setIsLoading(true)
    calculateUserBreakdowns()
    setIsLoading(false)
  }, [calculateUserBreakdowns])



  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Calculating settlement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Settlement</h2>
      </div>

      {/* Individual Breakdowns */}
      <div className="space-y-4 sm:space-y-6">
        
        {userBreakdowns.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Receipt className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">No expenses to settle yet</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Add some expenses to see the breakdown</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {userBreakdowns.map((breakdown) => (
              <div key={breakdown.userId} className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20">
                {/* User Header - Always Visible */}
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base sm:text-lg font-bold text-gray-900 truncate">{breakdown.userName}</h4>
                      <p className="text-xs text-gray-600">
                        {breakdown.paidByBreakdown.reduce((total, group) => total + group.expenses.length, 0)} expense{breakdown.paidByBreakdown.reduce((total, group) => total + group.expenses.length, 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg sm:text-xl font-bold text-gray-900">
                      ₱ {formatCurrency(breakdown.paidByBreakdown.reduce((total, group) => {
                        const payerKey = `${breakdown.userId}-${group.paidBy}`
                        return paidStatus.has(payerKey) ? total : total + group.totalPaidForUser
                      }, 0))}
                    </p>
                    <p className="text-xs text-gray-500">Total Owed</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200/50 my-3"></div>

                {/* Settlement Details */}
                {breakdown.paidByBreakdown.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">No expenses found</p>
                ) : (
                                      <div className="space-y-0">
                      {breakdown.paidByBreakdown.map((paidByGroup, index) => {
                        const payerKey = `${breakdown.userId}-${paidByGroup.paidBy}`
                        const isExpanded = expandedPayers.has(payerKey)
                        const isPaid = paidStatus.has(payerKey)
                        const isEven = index % 2 === 0
                        
                        return (
                          <div key={paidByGroup.paidBy} className={`space-y-2 ${isEven ? 'bg-gray-100/50' : 'bg-white'} rounded-lg p-2`}>
                            {/* Payer Header - Compact */}
                            <div 
                              className="flex items-center justify-between cursor-pointer sm:hover:border-2 sm:hover:border-blue-300 sm:hover:border-dashed rounded-lg p-2 -m-2 transition-all duration-200"
                              onClick={() => togglePayerExpanded(payerKey)}
                            >
                            <div className="flex items-center min-w-0 flex-1">
                              <div className="flex items-center space-x-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  isPaid ? 'bg-green-100' : 'bg-blue-100'
                                }`}>
                                  {isPaid ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <User className="h-3 w-3 text-blue-600" />
                                  )}
                                </div>
                                <div>
                                  <h5 className={`text-sm font-medium ${
                                    isPaid ? 'text-green-700 line-through' : 'text-gray-900'
                                  }`}>
                                    Owes {paidByGroup.paidByName}
                                  </h5>
                                  <p className="text-xs text-gray-500">
                                    {paidByGroup.expenses.length} expense{paidByGroup.expenses.length !== 1 ? 's' : ''}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-0 sm:space-x-2">
                              <div className="text-right min-w-0 flex-shrink-0">
                                <p className={`text-sm font-bold truncate ${
                                  isPaid ? 'text-green-600 line-through' : 'text-gray-900'
                                }`}>
                                  ₱ {formatCurrency(paidByGroup.totalPaidForUser)}
                                </p>
                              </div>
                              <div className="flex items-center flex-shrink-0">
                                {/* QR Code Button */}
                                {!isPaid && (() => {
                                  const payerUser = users.find(u => u.id === paidByGroup.paidBy)
                                  return payerUser?.qrCode ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        showQrCode(payerUser)
                                      }}
                                      className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-100/50 rounded-full transition-colors duration-200 -mr-1 sm:mr-0"
                                      title="Show QR Code"
                                    >
                                      <QrCode className="h-4 w-4" />
                                    </button>
                                  ) : null
                                })()}
                                
                                {/* Paid Status Toggle */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    togglePaidStatus(payerKey)
                                  }}
                                  className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition-colors duration-200 -mr-1 sm:mr-0 hover:bg-gray-100/50"
                                  title={isPaid ? 'Mark as unpaid' : 'Mark as paid'}
                                >
                                  <Check className={`h-4 w-4 ${isPaid ? 'text-green-500' : 'text-gray-400'}`} />
                                </button>
                                
                                {/* Expand/Collapse Button */}
                                <div className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                                  {isExpanded ? (
                                    <ChevronUp className="h-4 w-4 text-gray-400" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-gray-400" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Individual Expenses - Collapsible */}
                          {isExpanded && (
                            <div className={`pt-3 mt-3 ml-8 sm:ml-10 ${isPaid ? 'opacity-50' : ''}`}>
                              <div className="space-y-1">
                                {paidByGroup.expenses.map((expense) => (
                                  <div key={expense.expenseId} className="flex items-center text-sm sm:hover:bg-gray-50 sm:hover:rounded-lg sm:hover:px-2 sm:hover:-mx-2 transition-all duration-200">
                                    <span className={`flex-shrink-0 ${
                                      isPaid ? 'text-gray-500' : 'text-gray-600'
                                    }`}>
                                      {expense.expenseTitle}
                                    </span>
                                    <div className="flex-1 mx-2 border-b border-dotted border-gray-300 min-h-[1px]"></div>
                                    <span className={`font-medium flex-shrink-0 pr-8 sm:pr-10 ${
                                      isPaid ? 'text-gray-500' : 'text-gray-900'
                                    }`}>
                                      ₱ {formatCurrency(expense.userShare)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>


    </div>
  )
}
import Transaction from '../models/Transaction'

interface CreateTransactionDTO {
  title: string
  value: number
  type: 'income' | 'outcome'
}

interface Balance {
  income: number
  outcome: number
  total: number
}

class TransactionsRepository {
  private transactions: Transaction[]

  constructor() {
    this.transactions = []
  }

  public all(): Transaction[] {
    const transactions = this.transactions

    return transactions
  }

  public getBalance(): Balance {
    const { income, outcome } = this.transactions.reduce(
      (preVal, elem) => {
        if (elem.type === 'income') {
          preVal.income += elem.value
        } else if (elem.type === 'outcome') {
          preVal.outcome += elem.value
        }

        return preVal
      },
      {
        income: 0,
        outcome: 0,
      },
    )

    return { income, outcome, total: income - outcome }
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type })

    if (type === 'outcome') {
      const { total } = this.getBalance()

      if (value > total) {
        throw Error('You do not have this amount')
      }
    }

    this.transactions.push(transaction)

    return transaction
  }
}

export default TransactionsRepository

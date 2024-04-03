
const transactionsUl = document.querySelector('#transactions')
const displayBalance = document.querySelector('#balance')
const displayExpense = document.querySelector('#money-minus')
const displayIncome = document.querySelector('#money-plus')
const form = document.querySelector('form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')


const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    transactions = transactions.filter(transaction => transaction.id !== ID)
    updateLocalStorage()
    init()
}

const addTransactionsIntoDOM = ({ amount, name, id }) => {
    const operator = amount < 0 ? '-': '+';
    const CSSclass = amount < 0 ? 'minus': 'plus'; 
    const amoutWithoutOperator = Math.abs(amount);
    const li = document.createElement('li')

    li.classList.add(CSSclass)
    li.innerHTML = `
    ${name} <span>${operator} R$ ${amoutWithoutOperator}</span><button class="delete-btn"
     onClick="removeTransaction(${id})">x</button>
    `
    transactionsUl.prepend(li)
}

const getExpenses = transactionsAmounts => Math.abs(transactionsAmounts
    .filter(value => value < 0)
    .reduce((acc, value) => acc + value , 0))
    .toFixed(2)

const getIncome = transactionsAmounts => transactionsAmounts
    .filter(value => value > 0)
    .reduce((acc, value) => acc + value , 0)
    .toFixed(2)

const getTotalAmount = transactionsAmounts => transactionsAmounts
    .reduce((acc, transaction) => acc + transaction , 0)
    .toFixed(2)

const updateBalanceValues = () => {
    const transactionsAmounts = transactions.map(({ amount }) => amount )
    const totalAmount = getTotalAmount(transactionsAmounts)
    const expense = getExpenses(transactionsAmounts)
    const income = getIncome(transactionsAmounts)
        
    displayBalance.textContent = `R$ ${totalAmount}`;
    displayIncome.textContent = `R$ ${income}`;
    displayExpense.textContent = `R$ ${expense}`;
}

const init = () => {
    transactionsUl.innerHTML = ''
    transactions.forEach(addTransactionsIntoDOM)
    updateBalanceValues()
}

init()

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
}

const idGenerator = () => Math.round(Math.random() * 100)

const addToTransactionsArray = (transactionName,transactionAmount) => {
    transactions.push({
        id: idGenerator(),
        name: transactionName, 
        amount: Number(transactionAmount) 
    })
}

const cleanInputs = () => {
    inputTransactionAmount.value = ''
    inputTransactionName.value = ''
}

const handleFormSubmit = e => {
    e.preventDefault()
    const transactionName = inputTransactionName.value.trim()
    const transactionAmount = inputTransactionAmount.value.trim()
    const isSomeInputEmpty = transactionAmount === '' || transactionName === ''
    
    if(isSomeInputEmpty){
        alert('Por favor, preencha todos os campos')
        return
    }

    addToTransactionsArray(transactionName, transactionAmount)
    init()
    updateLocalStorage()
    cleanInputs()
}

form.addEventListener('submit', handleFormSubmit)
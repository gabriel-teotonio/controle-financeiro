
const transactionsUl = document.querySelector('#transactions')
const displayBalance = document.querySelector('#balance')
const displayExpense = document.querySelector('#money-minus')
const displayIncome = document.querySelector('#money-plus')
const form = document.querySelector('form')
const inputTransactionName = document.querySelector('#text')
const inputTransactionAmount = document.querySelector('#amount')
const transactionTypes = document.querySelectorAll('input[name="transaction-type"]');

const localStorageTransactions = JSON.parse(localStorage
    .getItem('transactions'))
let transactions = localStorage
    .getItem('transactions') !== null ? localStorageTransactions : []

const removeTransaction = ID => {
    transactions = transactions.filter(transaction => transaction.id !== ID)
    updateLocalStorage()
    init()
}

const addTransactionsIntoDOM = ({ amount, name, id, transactionType }) => {
    const CSSclass = transactionType === 'expense' ? 'minus': 'plus'; 
    const li = document.createElement('li')

    li.classList.add(CSSclass)
    li.innerHTML = `
    ${name} <span> R$ ${amount}</span><button class="delete-btn"
     onClick="removeTransaction(${id})">x</button>
    `
    transactionsUl.prepend(li)
}

const getExpenses = expenseTransactions => (expenseTransactions
    .reduce((acc, value) => acc + value , 0))
    .toFixed(2)

const getIncome = transactionsAmounts => transactionsAmounts
    .reduce((acc, value) => acc + value , 0)
    .toFixed(2)

const updateBalanceValues = () => {
    const expenseTransactions = transactions
    .filter(item => item.transactionType === 'expense')
    .map(item => item.amount)

    const incomeTransactions = transactions
    .filter(item => item.transactionType === 'income')
    .map(item => item.amount)

    const expense = getExpenses(expenseTransactions)
    const income = getIncome(incomeTransactions)
        
    displayBalance.textContent = `R$ ${income - expense}`;
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

const addToTransactionsArray = (transactionName,transactionAmount, transactionType) => {
    transactions.push({
        id: idGenerator(),
        name: transactionName, 
        amount: Number(transactionAmount),
        transactionType
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
    let selectedType = '';

    transactionTypes.forEach(type => {
        if(type.checked){
            selectedType = type.value
        }
    })

    const isSomeInputEmpty = transactionAmount === '' || transactionName === '' || selectedType === '';
    
    if(isSomeInputEmpty){
        alert('Por favor, preencha todos os campos')
        return
    }

    addToTransactionsArray(transactionName, transactionAmount, selectedType)
    init()
    updateLocalStorage()
    cleanInputs()
}

form.addEventListener('submit', handleFormSubmit)


// modal js
const openModalBtn = document.getElementById('open-modal-btn');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close-btn');

openModalBtn.addEventListener('click', function() {
  modal.style.display = 'block';
});

closeBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});

window.addEventListener('click', function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});

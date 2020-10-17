import { format, isToday} from 'date-fns';

const currentDate  = Date.now()
 let lastTransaction: Transaction;
const date = document.getElementById("date");
const calories_plus = document.getElementById("calories-plus");
const calories_minus = document.getElementById("calories-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = <HTMLInputElement>document.getElementById("text");
const amount = <HTMLInputElement>document.getElementById("amount");

interface Transaction {
  amount: number;
  date: number;
  id: number;
  text: string;
}

interface Transactions extends Array<Transaction> {}

// Get any previous transactions from local storage
const localStorageTransactions: Transactions = JSON.parse(
  localStorage.getItem("transactions")
);
let transactions =
  localStorageTransactions !== null ? localStorageTransactions : [];

// Get most recent transaction
const getLastTransaction = (transactionItems: Transactions) => {
  if (transactionItems.length >= 1) {
    lastTransaction =
      localStorageTransactions[localStorageTransactions.length - 1];
  }
};

// Add transaction and update local storage and UI
const addTransaction = (e: Event) => {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add a text and amount");
  } else {
    const transaction: Transaction = {
      id: generateID(),
      date: Date.now(),
      text: text.value,
      amount: +amount.value,
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    text.value = "";
    amount.value = "";
  }
};

// Generate random ID
const generateID = () => {
  return Math.floor(Math.random() * 100000000);
};

// Add transactions to DOM list
const addTransactionDOM = (transaction: Transaction) => {
  const item = document.createElement("li");

  // Add class based on value
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
const button = document.createElement('button')
button.type = 'button'
button.className = 'delete-btn'
button.textContent = 'x'

button.onclick = function () {
  removeTransaction(transaction.id)
}

  item.innerHTML = `${transaction.text} <span>${Math.abs(
    transaction.amount
  )}</span>`;
  item.appendChild(button)
  list.appendChild(item);
};

// Update the DOM values
const updateValues = () => {
  const amounts = transactions.map((transaction) => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc -= item), 2000);

  const addition = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0);

  const subtraction = total <= 0 ? 0 : total;

  date.innerText = `${format(currentDate, "MMMM do yyyy")}`;
  calories_plus.innerText = `${addition}`;
  calories_minus.innerText = `${subtraction}`;
};

// Remove transaction by ID
function removeTransaction(id: number) {
  transactions = transactions.filter((transaction) => transaction.id !== id);

  updateLocalStorage();

  init();
};

// Update local storage transactions
const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

// Initialize app and clear transactions if new date
const init = () => {
  list.innerHTML = "";
  getLastTransaction(transactions)
  if (transactions.length > 0) {
    const today = isToday(lastTransaction.date)
    if (!today) {
      localStorage.clear();
      transactions = []
      list.innerHTML = "";
      transactions.forEach(addTransactionDOM);
    }
  }

  transactions.forEach(addTransactionDOM);

  updateValues();
}

init();

form.addEventListener("submit", addTransaction);
'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// display movenments 
const displayMovements = function (movements ,sort = false){

  containerMovements.innerHTML = ''
 const movs = sort ? movements.slice().sort((a,b) => a-b) : movements;

movs.forEach( function( move , i ){
        const type = move > 0 ?'deposit' : 'withdrawal';

  const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}"> ${i+1} ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${move} €</div>
        </div>`;
  containerMovements.insertAdjacentHTML ('afterbegin',html)
})

}

// create the user name 
const createUserNames = function(accs){
accs.forEach( acc => 
  acc.userName = acc.owner.toLowerCase()
.split(' ')
.map(user => user[0])
.join('')
  )

}
createUserNames(accounts)
// Display balance function
const calcBalance = function(acc){
 acc.balance = acc.movements.reduce(( accum, mov) =>accum + mov ,0)
 labelBalance.textContent = ` ${acc.balance} €`;
} 

// calc Display Summary function 
const displaySummary  = function(acc){
  const income = acc.movements
  .filter( mov => mov > 0) 
  .reduce((acc , mov ) => acc+ mov ,0);
  labelSumIn.textContent = `${income} €`;
  const outCome =  acc.movements.filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov , 0);
  labelSumOut.textContent = `${Math.abs(outCome)} €`;
  const interst = acc.movements.filter( mov => mov > 0) 
  .map( deposite => (deposite * acc.interestRate)/100 )
  .filter( int => int >= 1)
  .reduce((acc, interest) => acc + interest , 0)

  labelSumInterest.textContent = `${interst} €`

}
// calc all deposite 
const eurToUsd = 1.1;
const calcAllDeposite = function (movements){
  const result = movements.filter( mov => mov > 0)
  .map((mov ,i,arr) => mov * eurToUsd)
  .reduce((acc,mov)=> acc + mov , 0 )
}
calcAllDeposite( account1.movements) 

const updateUi = function(acc){
   displayMovements(acc.movements);

      //Display Balance 
      calcBalance(acc)
    // Display summary
      displaySummary(acc);
}
// login function 
let currentAccount ;
btnLogin.addEventListener('click' , function(e){
  e.preventDefault();
 currentAccount = accounts.find( acc => acc.userName === inputLoginUsername.value);
 if(currentAccount?.pin === Number(inputLoginPin.value)){
      // clear values of inputs 
        inputLoginUsername.value =   inputLoginPin.value = ''; 
        inputLoginPin.blur();

      // Display Welcome message
      labelWelcome.textContent = ` Welcome back , ${currentAccount.owner.split(' ')[0] }`;
      containerApp.style.opacity = 100;
      updateUi(currentAccount);


 } else {
  alert('User Name or Password Not correct')
 }


})

btnTransfer.addEventListener('click' , function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find( acc => acc.userName === inputTransferTo.value);
  if(amount > 0
    && reciverAcc
    && reciverAcc?.userName !== currentAccount.userName
    && currentAccount.balance >= amount
    ){
      currentAccount.movements.push(-amount);
      reciverAcc.movements.push(amount);
      updateUi(currentAccount);
    }
    else {
      alert('the transfer name or amount not correct')
    }
    inputTransferAmount.value =inputTransferTo.value= '';
})
// request loan 
btnLoan.addEventListener('click' , function(e){
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if(amount> 0 
    && currentAccount.movements.some(mov => mov >= amount*.1)){
      currentAccount.movements.push(amount);
      updateUi(currentAccount)
      inputLoanAmount.value=''

    }
    else {
      alert('Dot Allowed ,Check the Loan Amount ')
    }

})

// close account 
btnClose.addEventListener('click' , function(e){
  e.preventDefault();
  if( inputCloseUsername.value === currentAccount.userName && Number(inputClosePin.value) === currentAccount.pin){
    const index = accounts.findIndex( acc => acc.userName === currentAccount.userName)
    accounts.splice(index ,1)
    inputCloseUsername.value =inputClosePin.value=''
    //hide ui
    containerApp.style.opacity = 0;
          labelWelcome.textContent = ` Log in to get started`;
    
  }
})
let sorted =false;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
 displayMovements( currentAccount.movements, !sorted)
 sorted=!sorted

})
// practice 
//deposite at least 1000
const depositeAtLeast1000 = accounts.flatMap(acc => acc.movements).filter(acc=> acc>1000).length
console.log(depositeAtLeast1000)
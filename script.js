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

const displayMovement = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  //sorting?
  const movs = sort ? movements.slice(0).sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
//displayMovement(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};
//calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interests = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interests}€`;
};
//calcDisplaySummary(account1.movements);

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  //display movements
  displayMovement(acc.movements);
  //display balance
  calcDisplayBalance(acc);
  // display summary
  calcDisplaySummary(acc);
};

//event handler
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    ///doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    //update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    //delete account
    accounts.splice(index, 1);

    //hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovement(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/*
let arr = ['a', 'b', 'c', 'd', 'e'];

//slice
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());

//splice - modifies the array!
//console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

//reverse
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['j', 'i', 'h', 'g', 'f'];
console.log(arr2.reverse());
console.log(arr2);

//concat
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

//join
console.log(letters.join(' - '));
*/

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log('---------FOREACH---------');
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
//   }
//  // console.log(arr);
// });
// 0: function(200)
// 1: function(450)
// 2: function(400)
// ...

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// //Set
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);

// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${value}: ${value}`);
// });

// //CODING CHALLENGES
// //1
// //test data 1
// // const juliaArr = [3, 5, 2, 12, 7];
// // const kateArr = [4, 1, 15, 8, 3];
// //test data 2
// const juliaArr = [9, 16, 6, 8, 3];
// const kateArr = [10, 5, 6, 1, 4];

// const checkDogs = function (dogsJulia, dogsKate) {
//   const corrdogsJulia = dogsJulia.slice(0, -2);

//   console.log(dogsJulia);
//   console.log(corrdogsJulia);

//   const dogs = corrdogsJulia.concat(dogsKate);
//   console.log(corrdogsJulia.concat(dogsKate));

//   dogs.forEach(function (age, i) {
//     console.log(
//       `Dog number ${i + 1} is ${
//         age < 5 ? 'still a puppy' : `an adult and is ${age} years old`
//       }`
//     );
//   });
// };

// checkDogs(juliaArr, kateArr);

//////////////////////////////////////////////////

// const eurToUsd = 1.1;

// // const movementsUSD = movements.map(function (mov) {
// //   return mov * eurToUsd;
// // });

// const movementsUSD = movements.map(mov => mov * eurToUsd);
// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for (const mov of movements) {
//   movementsUSDfor.push(mov * eurToUsd);
// }
// //console.log(movementsUSDfor);

// const movementsDescriptions = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );

// console.log(movementsDescriptions);

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// console.log(movements);
// console.log(deposits);

// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov);
// console.log(depositsFor);

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

// console.log(movements);
// //accumulator -> snowbal
// const ballance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);

// console.log(ballance);

// let ballance2 = 0;
// for (const mov of movements) ballance2 += mov;
// console.log(ballance2);

// //Maximum value
// const maximum = movements.reduce(
//   (max, curr) => (curr > max ? curr : max),
//   movements[0]
// );

// console.log(maximum);

//CODING CHALLENGES
//2

// const ages1 = [5, 2, 4, 1, 15, 8, 3];
// const ages2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge = function (ages) {
//   const dogsAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   console.log(dogsAge);
//   const dogsFiltered = dogsAge.filter(age => age >= 18);
//   console.log(dogsFiltered);
//   const averageAge =
//     dogsFiltered.reduce((acc, age) => acc + age, 0) / dogsFiltered.length;
//   console.log(averageAge);
// };
// console.log(ages1);
// calcAverageHumanAge(ages1);
// console.log('-------TEST 2-------');
// console.log(ages2);
// calcAverageHumanAge(ages2);

///////////////////////////////////////////////
// const eurToUsd = 1.1;
// console.log(movements);
// // PIPELINE
// const totalDepositsInUsd = movements
//   .filter(mov => mov > 0)
//   // .map(mov => mov * eurToUsd)
//   .map((mov, i, arr) => {
//     // console.log(arr);
//     return mov * eurToUsd;
//   })
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsInUsd);

//CODING CHALLENGES
//2,3

// const ages1 = [5, 2, 4, 1, 15, 8, 3];
// const ages2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge = function (ages) {
//   const dogsAge = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   // console.log(dogsAge);
//   const dogsFiltered = dogsAge.filter(age => age >= 18);
//   //console.log(dogsFiltered);
//   const averageAge =
//     dogsFiltered.reduce((acc, age) => acc + age, 0) / dogsFiltered.length;
//   console.log(averageAge);
// };
// // console.log(ages1);
// // calcAverageHumanAge(ages1);
// // console.log('-------TEST 2-------');
// // console.log(ages2);
// // calcAverageHumanAge(ages2);

// const calcAverageHumanAge2 = ages =>
//   console.log(
//     ages
//       .map((age, i, arr) => (age <= 2 ? 2 * age : 16 + age * 4))
//       .filter((age, i, arr) => age >= 18)
//       .reduce((acc, age, i, arr) => acc + age / arr.length, 0)
//   );

// calcAverageHumanAge(ages1);
// calcAverageHumanAge(ages2);
// console.log('as an arrow:');
// calcAverageHumanAge2(ages1);
// calcAverageHumanAge2(ages2);

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');

// console.log(account);
// console.log(movements);
// //Equality
// console.log(movements.includes(-130));
// //SOME: condition
// console.log(movements.some(mov => mov === -130));

// const anyDeposits = movements.some(mov => mov > 1500);
// console.log(anyDeposits);

// //EVERY: condition
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// //separate callback
// const deposit = mov => mov < 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());
// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// // const accountMove = accounts.map(acc => acc.movements);
// // console.log(accountMove);
// // const allMovements = accountMove.flat();
// // console.log(allMovements);
// // const overallBallance = allMovements.reduce((acc, mov) => acc + mov, 0);
// // console.log(overallBallance);
// //flat
// const overallBalance = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);
// //flat map
// const overallBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance2);

// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// const x = new Array(7);
// console.log(x);
// //console.log(x.map(() => 5));

// x.fill(1, 3, 5);
// console.log(x);

// arr.fill(23, 2, 6);
// console.log(arr);

// //Arra,from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// //lil preperation
// const diceRolls = Array.from({ length: 100 }, () =>
//   Math.trunc(Math.random() * 6 + 1)
// );
// console.log(diceRolls);

// labelBalance.addEventListener('click', function () {
//   const movementUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementUI);
// });

///////////////////////////////////////
// Coding Challenge #4

// Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
// Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
// Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

// 1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
// 2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
// 3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
// 4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
// 5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
// 6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
// 7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
// 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

// HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
// HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

// //TEST DATA:
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// //GOOD LUCK 😀

// dogs.forEach(curr => {
//   curr.recFood = Math.trunc(curr.weight ** 0.75 * 28);
// });
// console.log(dogs);

// dogs.forEach(curr => {
//   if (curr.owners.includes('Sarah')) {
//     if (curr.curFood > curr.recFood * 1.1) {
//       console.log('it eats too much!');
//     } else if (curr.curFood < curr.recFood * 0.9) {
//       console.log('it eats too little!');
//     }
//   }
// });

// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood > dog.recFood * 1.1)
//   .map(dog => dog.owners)
//   .flat();

// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood < dog.recFood * 0.9)
//   .map(dog => dog.owners)
//   .flat();

// console.log(ownersEatTooMuch);
// console.log(ownersEatTooLittle);

// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// console.log(
//   dogs.some(
//     el => el.curFood < el.recFood * 1.1 && el.curFood > el.recFood * 0.9
//   )
// );

// const ownersEatOk = dogs
//   .filter(
//     dog => dog.curFood < dog.recFood * 1.1 && dog.curFood > dog.recFood * 0.9
//   )
//   .map(dog => dog.owners)
//   .flat();
// console.log(ownersEatOk);

// const newDogs = dogs.map(el => el);

// newDogs.sort((a, b) => a.recFood - b.recFood);
// console.log(newDogs);

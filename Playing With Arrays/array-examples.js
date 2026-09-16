// Sample data and higher-order array functions.
// Try one expression at a time, then pass its result to updateDisplay().

// forEach - runs a function for each element
// numbers.forEach(n => console.log(n * 2));

// map - transforms every element into a new array
// updateDisplay(numbers.map(n => n * 2));
// updateDisplay(fruits.map(f => f.toUpperCase()));

// filter - keeps elements that pass a test
// updateDisplay(numbers.filter(n => n > 50));
// updateDisplay(fruits.filter(f => f.length > 5));

// reduce - combines an array into one value
// updateDisplay(numbers.reduce((sum, n) => sum + n, 0));
// updateDisplay(numbers.reduce((max, n) => Math.max(max, n)));

// find / some / every - test elements and return a value or boolean
// updateDisplay(numbers.find(n => n > 90));
// updateDisplay(numbers.some(n => n > 90));
// updateDisplay(numbers.every(n => n > 0));

// sort - copy first because sort() changes the array in place
// const sortedNumbers = [...numbers].sort((a, b) => a - b);
// updateDisplay(sortedNumbers.slice(0, 8));

// Chaining - use the result of one method as the input to another
// updateDisplay(numbers.filter(n => n % 2 === 0).map(n => n * 10));
// updateDisplay(numbers.filter(n => n > 50).map(n => n * 2)
//   .reduce((sum, n) => sum + n, 0));

// Callbacks can return any type, including booleans.
// updateDisplay(numbers.map(n => n > 50));

Sample data and higher-order array functions.
Try one expression at a time, then pass its result to updateDisplay().

forEach - runs a function for each element
numbers.forEach(n => console.log(n * 2));

map - transforms every element into a new array
updateDisplay(numbers.map(n => n * 2));
updateDisplay(fruits.map(f => f.toUpperCase()));

filter - keeps elements that pass a test
updateDisplay(numbers.filter(n => n > 50));
updateDisplay(fruits.filter(f => f.length > 5));

reduce - combines an array into one value
updateDisplay(numbers.reduce((sum, n) => sum + n, 0));
updateDisplay(numbers.reduce((max, n) => Math.max(max, n)));

find / some / every - test elements and return a value or boolean
updateDisplay(numbers.find(n => n > 90));
updateDisplay(numbers.some(n => n > 90));
updateDisplay(numbers.every(n => n > 0));

sort - copy first because sort() changes the array in place
const sortedNumbers = [...numbers].sort((a, b) => a - b);
updateDisplay(sortedNumbers.slice(0, 8));

Chaining - use the result of one method as the input to another
updateDisplay(numbers.filter(n => n % 2 === 0).map(n => n * 10));
updateDisplay(numbers.filter(n => n > 50).map(n => n * 2)
  .reduce((sum, n) => sum + n, 0));

Callbacks can return any type, including booleans.
updateDisplay(numbers.map(n => n > 50));

// Algorithm:
// 1. Keep only sales over $100.
// 2. Calculate a 10% commission for each of those sales.
// 3. Add all of the commissions together.

const sales = [80, 150, 200, 50, 120];

// Old-school iteration
const qualifyingSales = [];

for (let i = 0; i < sales.length; i++) {
  if (sales[i] > 100) {
    qualifyingSales.push(sales[i]);
  }
}

const commissions = [];

for (let i = 0; i < qualifyingSales.length; i++) {
  commissions.push(qualifyingSales[i] * 0.10);
}

let totalCommission = 0;

for (let i = 0; i < commissions.length; i++) {
  totalCommission += commissions[i];
}

// Higher-order functions
const totalCommission2 = sales
  .filter(sale => sale > 100)
  .map(sale => sale * 0.10)
  .reduce((sum, commission) => sum + commission, 0);


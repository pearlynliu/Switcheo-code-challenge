/*
# Task - Three ways to sum to n

Provide 3 unique implementations of the following function in JavaScript.

**Input**: `n` - any integer

*Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`*.

**Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.
*/


var sum_to_n_a = function(n) {
    // Implement using for loop
    let sum = 0;
    if ( n < 0 ) {
        // n is negative (e.g n=-3 --> -1 + -2 + -3)
        for (let i = 0; i >= n; i--) {
            sum += i;
        }
        return sum
    } else {
        // n is 0 or positive (e.g n=3 --> 1 + 2 + 3)
        for (let i = 0; i <= n; i++) {
            sum += i;
        }
        return sum
    }
};

// Uncomment to Test
// console.log("A: the sum to n is " + sum_to_n_a(0));
// console.log("A: the sum to n is " + sum_to_n_a(10));
// console.log("A: the sum to n is " + sum_to_n_a(-5));


var sum_to_n_b = function(n) {
    // Implement using arithmetic sum formula
    // (n * number_of_terms_including_0 / 2)
    return n * (Math.abs(n) + 1) / 2;
};

// Uncomment to Test
// console.log("B: the sum to n is " + sum_to_n_b(0));
// console.log("B: the sum to n is " + sum_to_n_b(10));
// console.log("B: the sum to n is " + sum_to_n_b(-5));


var sum_to_n_c = function(n) {
    // Implement using recursion
    if ( n === 0 ) {
        // n is 0 is the base case
        return 0;
    } else if ( n < 0 ) {
        // n is negative: increment to 0
        return n + sum_to_n_c(n + 1);
    } else {
        // n is positive: decrement to 0
        return n + sum_to_n_c(n - 1);
    }
};

// Uncomment to Test
// console.log("C: the sum to n is " + sum_to_n_c(0));
// console.log("C: the sum to n is " + sum_to_n_c(10));
// console.log("C: the sum to n is " + sum_to_n_c(-5));
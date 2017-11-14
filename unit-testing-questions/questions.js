// Some questions are based on exercises found at www.w3resource.com/javascript-exercises

// Question 1: Write a function, reverseString, that takes a string, str. Return that string in reverse order. 
function reverseString(str) {
	return str.split("").reverse().join("");
}

console.log(reverseString("Testing 123")); // 321 gnitseT
console.log(reverseString("0123456789")); // 9876543210
console.log(reverseString("Hello World!")); // !dlroW olleH


// Question 2: Write a function, medianNumber, that takes three numbers, num1, num2, num3. Return the median number from those three arguments.
function medianNumber(num1, num2, num3) {
	var numbers = [num1, num2, num3];
	numbers.sort(function(a, b) {
		return a-b});
	return numbers[1];
	}

console.log(medianNumber(1, 2, 3)); // 2
console.log(medianNumber(-5, 5, 0)); // 0
console.log(medianNumber(100, 75, 200)); // 100


// Question 3: Write a function, largestNumber, that takes three numbers, num1, num2, num3. Return the largest number.
function largestNumber(num1, num2, num3) {
	x = 0;
	if (num1 > num2) {
		x = num1;
	}
	else {
		x = num2;
	}
	if (num3 > x) {
		x = num3;
	}
	return x;
}

console.log(largestNumber(1, 2, 3)); // 3
console.log(largestNumber(-5, 5, 0)); // 5
console.log(largestNumber(100, 75, 200)); // 200


// Question 4: Write a function, convertAge, that takes your age as an argument, num. Convert the number into hours.
function convertAge(num) {
	return num * 365 * 24;
}

console.log(convertAge(12)); // 105120
console.log(convertAge(45)); // 394200
console.log(convertAge(29)); // 254040


// Question 5: Write a function, alphaOrder, that takes a string, str. Return that string with the letters in alphabetical order.
function alphaOrder(str) {
	return str.split("").sort().join("");
}

console.log(alphaOrder("Houston")); // Hnoostu
console.log(alphaOrder("apple")); // aelop
console.log(alphaOrder("turkey")); // ekrtuy


// Question 6: Write a function, reverseCase, that takes a string, str. Switch the case of each character and return the string.
function reverseCase(str) {
	var answer = "";
	for (i = 0; i < str.length; i +=1) {
		var letter = str[i];
		if (letter == letter.toLowerCase()) {
			answer = answer + letter.toUpperCase();
		}
		else {
			answer = answer + letter.toLowerCase();
		}
	}
	return answer;
}

console.log(reverseCase("Good Morning")); // gOOD mORNING
console.log(reverseCase("December")); // dECEMBER
console.log(reverseCase("McDonald")); // mCdONALD


// Question 7: Write a function, rightDigit, that takes two numbers, num1 and num2. Return true if the right digits are the same.
function rightDigit(num1, num2) {
	return (num1 % 10 === num2 % 10);
}

console.log(rightDigit(35, 47)); // false
console.log(rightDigit(533, 23)); // true
console.log(rightDigit(15, 104)); // false


// Question 8: Write a function, reverseNumber, that takes a number, num. Return the number in reverse order.
function reverseNumber(num) {
	return Number(num.toString().split("").reverse().join(""));
}

console.log(reverseNumber(453)); // 354
console.log(reverseNumber(1462)); // 2641
console.log(reverseNumber(98765)); // 56789


// Question 9: Write a function, checkPrime, that takes a number, num. Return true if the number is a prime number. Example 39 would return false.
function checkPrime(num) {
	if (num === 1) {
		return false;
	}
	else if (num === 2) {
		return true;
	}
	else {
		for (i = 2; i < num; i +=1) {
			if (num % i === 0) {
				return false;
			}
		}
		return true;
	}
}

console.log(checkPrime(39)); // false
console.log(checkPrime(11)); // true
console.log(checkPrime(57)); // false


// Question 10: Write a function, countDigit, that takes one number, num. Return the number of digits in the number. 
function countDigit(num) {
	return num.toString().length;
}

console.log(countDigit(345)); // 3
console.log(countDigit(45678)); // 5
console.log(countDigit(123456)); // 6


// Question 11: Write a function, gcd, that takes two numbers, num1 and num2. Return the gcd (greatest common denominator). 
function gcd(num1, num2) {
  var x = 0;
  while (num1 !== 0) {
    x = num2 % num1;
    num2 = num1;
    num1 = x;
  }
  return num2;
}

console.log(gcd(24, 12)); // 12
console.log(gcd(53, 2)); // 1
console.log(gcd(3, 15)); // 3


// Question 12: Write a function, volumeBox, that takes three numbers, num1, num2, num3, as dimensions of a box. Return the volume.
function volumeBox(length, width, height) {
	return length * width * height;
}
console.log(volumeBox(3, 4, 5)); // 60
console.log(volumeBox(2, 3, 9)); // 54
console.log(volumeBox(1, 2, 3)); // 6


// Question 13: Write a function, isEven, that takes a number, num. Return true if the number is even.
function isEven(num) {
	if(num % 2 === 0) {
		return true;
	}
	else {
		return false;
	}
}

console.log(isEven(10)); // true
console.log(isEven(5)); // false
console.log(isEven(23)); // false


// Question 14: Write a function, circleArea, that takes a number, num, as the radius of a circle. Return the area of the circle to 2 decimal places.
function circleArea(num) {
	var area = Math.PI * num * num;
	return area.toFixed(2);
}

console.log(circleArea(3)); // 28.27
console.log(circleArea(10)); // 314.16
console.log(circleArea(21)); // 1385.44


// Question 15: Write a function, factorial, that takes a number, num. Return the factorial of that number. 
function factorial(num) {
	if ((num === 0) || (num ===1)) {
		return 1;
	}
	else {
		return (num * factorial(num - 1));
	}
}

console.log(factorial(4)); // 24
console.log(factorial(8)); // 40320
console.log(factorial(10)); // 3628800




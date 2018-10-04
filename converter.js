"use strict";
//once the page has loaded a listner is created for a button
$(document).ready(function() {
  $('#input-button').on("click", numbersOrLetters);
});

//-----------------------------------------------------------------
// Number to Numeral

const romanArr = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V",
  "IV", "M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX",
  "V", "IV", "I"
]
const numberArr = [1000000, 900000, 500000, 400000, 100000, 90000, 50000, 40000,
  10000, 9000, 5000, 4000, 1000, 900, 500, 400, 100, 90, 50, 40,
  10, 9, 5, 4, 1
]

// determine if input is numbers or letters
function numbersOrLetters(event) {
  event.preventDefault();

  let inputCheck = document.getElementById("input-field").value;
  if(isNaN(inputCheck)) {
    numeralsToNumbers(inputCheck);
  } else if(inputCheck <= 0) {
    alert("You must enter a number greater then zero.");
        document.getElementById("input-field").value = '';
  }{
    convertNumber(inputCheck);
  }
}

function convertNumber(num) {
  // let numero = getNumber(event);
  let answerArr = switchToNumerals(num);

  showResult(num, answerArr);
}

//gets a number from the input field
// function getNumber(event) {
//
//   event.preventDefault();
//
//   let input = document.getElementById("input-field").value;
//   if (isNaN(input)) {
//     alert("you must enter a NUMBER");
//     document.getElementById("input-field").value = '';
//   } else {
//     return input;
//   }
// }


function switchToNumerals(num) {
  //create variable that will hold the numerals for values over 4000 and vallues
  //less than 4000. so that when displaying them, an 'overscore' can show that
  //the value is a multiple of 1000.
  let answer = [
    [],
    []
  ];

  //work through the number and numeral arrays - subtracting the working amount
  //and adding the numerals to the answer4 array.
  for (let x = 0; x < numberArr.length; x++) {
    while (num >= numberArr[x] && num >= 4000) {
      answer[0] += romanArr[x];
      num -= numberArr[x];
    }
    while (num >= numberArr[x] && num < 4000) {
      answer[1] += romanArr[x];
      num -= numberArr[x];
    }
  }
  return answer;
}


//displays the result on the page only if the input is a number.
function showResult(number, result) {
  if (number > 0) {
    $('#results').html($('<p>' + number + ' = <span style="text-decoration: overline">' +
     result[0] + '</span>' + result[1] + '</p>'));
  }
}


//-------------------------------------------------------------------
// //convert it back....

//controller
function numeralsToNumbers() {
  let numeralsGiven = getNumerals(event);
  if (numeralsGiven) {
    //change numeral string into an array of letters
    let numeralsArray = breakAndCapitalise(numeralsGiven);
    //pair any numerals that belong together
    let pairedNumerals = pairNumerals(numeralsArray);
    //check to see that numerals are in a valid order

    let validOrder = checkNumeralOrder(pairedNumerals);
    if (validOrder) {
      let convertedAmount = changeNumeralsToNumbers(validOrder);

      showResult1(numeralsGiven.toUpperCase(), convertedAmount);
    }
  }
}

// gets the numerals from the input field
function getNumerals(event) {
  event.preventDefault();

  let input = document.getElementById("input-field").value;

  //regex test for Roman Numerals
  const numeralRegex = /^[mdclxvi]*$/gi;
  if (!numeralRegex.test(input)) {
    alert("Please enter a valid roman numeral.");
    document.getElementById("input-field").value = '';
  } else {
    return input;
  }
}


//change numeral string into an array of letters
function breakAndCapitalise(rom) {
  return rom.toUpperCase().split('');
}

//pair numerals that belong together
function pairNumerals(arr) {
  let filteredArray = [];
  for (let i = 0; i < arr.length; i++) {
    switch (arr[i]) {
      case "M":
      case "D":
      case "L":
      case "V":
        filteredArray.push(arr[i]);
        break;
      case "C":
        if (arr[i + 1] === "M" || arr[i + 1] === "D") {
          filteredArray.push(arr[i] + arr[i + 1]);
          i++;
        } else {
          filteredArray.push(arr[i]);
        }
        break;
      case "X":
        if (arr[i + 1] === "C" || arr[i + 1] === "L") {
          filteredArray.push(arr[i] + arr[i + 1]);
          i++;
        } else {
          filteredArray.push(arr[i]);
        }
        break;
      case "I":
        if (arr[i + 1] === "X" || arr[i + 1] === "V") {
          filteredArray.push(arr[i] + arr[i + 1]);
          i++;
        } else {
          filteredArray.push(arr[i]);
        }
        break;
    }
  }
  return filteredArray;
}



function checkNumeralOrder(rom) {
  //array of Numerals in decending order of value
  const romanNum = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
  const nonRepeaters = ["CM", "D", "CD", "XC", "L", "XL", "IX", "V", "IV"]
  const repeaters = ["C", "X", "I"]
  //condition1 is for values like 5 that can't be follwed by a 4. works for 5, 50 and 500
  const condition1 = (val1, val2, cond1, cond2) => romanNum.indexOf(val1) === cond1 && romanNum.indexOf(val2) === cond2 && val2 !== undefined;
  //condition2 is for values like 9's and 4's. can't be followed by a 5,4 or 1.
  const condition2 = (val1, val2, cond1, cond2, cond3) => romanNum.indexOf(val1) === cond1 &&
    romanNum.indexOf(val2) < cond2 && val2 !== undefined ||
    romanNum.indexOf(val1) === cond3 && romanNum.indexOf(val2) < cond2 && val2 !== undefined;
    // condition 3 stops C,X or I being repeated more than three times in a row.
  const condition3 = (val1, val2, val3, val4) => repeaters.indexOf(val1) >= 0 && val1 === val2 && val1 === val3 && val1 === val4;

  let correctOrderCounter = 0;

  //cycle through each value in the array. cross checking our given array with
  //an array of roman numerals in value order.
  for (let x = 0; x < rom.length; x++) {
    //if the value of the numeral is less than that of the next one in the array
    //then it is an invalid order - show an alert and clear input field
    if (romanNum.indexOf(rom[x]) > romanNum.indexOf(rom[x + 1]) && rom[x + 1] !== undefined) {
      alert("This is an invalid order of Roman Numerals. wrong order, numerals should be in decending order.");
      wipeInput();
      break;
    }
    //there are certain numerals that must not be iterated twice in succession
    else if (nonRepeaters.indexOf(rom[x]) >= 0 && rom[x] === rom[x + 1] &&
      rom[x + 1] !== undefined) {
      alert("This is an invalid order of Roman Numerals. Some numerals can't repeat like that.");
      wipeInput();
      break;
    }
    //900(CM) or 400(CD) cannot be follwed by 500(D) or 400 (CD) or 100(C)
    else if (condition2(rom[x], rom[x + 1], 1, 5, 3)) {
      alert("This is an invalid order of Roman Numerals. 900 or 400 can't be followed by a 500,400 or 100.");
      wipeInput();
      break;
    }
    //500 can't be followed by a 400
    else if (condition1(rom[x], rom[x + 1], 2, 3)) {
      alert("This is an invalid order of Roman Numerals. no 400 after 500.");
      wipeInput();
      break;
    }
    //90(XC) or 40(XL) cannot be followed by 50(L), 40(XL), or 10(X)
    else if (condition2(rom[x], rom[x + 1], 5, 9, 7)) {
      alert("This is an invalid order of Roman Numerals. 90 or 40 can't be followed by 50, 40 or 10.");
      wipeInput();
      break;
    }
    //50(L) can't be followed by a 40(IV)
    else if (condition1(rom[x], rom[x + 1], 6, 7)) {
      alert("This is an invalid order of Roman Numerals. No 40 after 50.");
      wipeInput();
      break;
    }
    //9(IX) cannot be followed by a 5(V) or a 4(IV)
    else if (condition2(rom[x], rom[x + 1], 9, 13, 11)) {
      alert("This is an invalid order of Roman Numerals. 9 or 4 can't by followed by a 5,4 or 1.");
      wipeInput();
      break;
    }
    //C(100), X(10) and I(1) can be repeated only 3 times.
    else if (condition3(rom[x], rom[x+1], rom[x+2], rom[x+3])) {
      alert("This is an invalid order of Roman Numerals. you cant repeat C,X or I more than three times.");
      wipeInput();
      break;
    } else {
      correctOrderCounter++;
    }
  }
  if (correctOrderCounter === rom.length) {
    return rom;
  }
}

//clears the input field
function wipeInput() {
  document.getElementById("input-field").value = '';
}


//using two arrays side by side convert the numerals to numbers
function changeNumeralsToNumbers(rom) {
  const romanNum = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
  const numberArr = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
  let arrIntoNumbers = [];

  for (let x = 0; x < rom.length; x++) {
    let place = romanNum.indexOf(rom[x]);
    arrIntoNumbers.push(numberArr[place]);
  }

  //add up the values of the array
  const reducer = (acc, cur) => acc + cur;
  return arrIntoNumbers.reduce(reducer);
}

//display results in the DOM
function showResult1(rom, num) {
  if (num > 0) {
    $('#results').html($('<p>' + rom + ' = ' + num + '</p>'));
  }
}

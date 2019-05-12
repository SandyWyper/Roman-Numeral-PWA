"use-strict";
let deferredPrompt;

// listen for install prompt
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;

    showAddToHomeScreen();
    // Update UI notify the user they can add to home screen
    // btnAdd.style.display = 'block';
});


function showAddToHomeScreen() {

    var btnAdd = document.querySelector(".btnAdd-prompt");

    btnAdd.style.display = "block";

    btnAdd.addEventListener("click", addToHomeScreen);
}

function addToHomeScreen() {
     btnAdd.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice
        .then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
}


// listen to see if app was installed correctly
window.addEventListener('appinstalled', (evt) => {
    app.logEvent('a2hs', 'installed');
});


//once the page has loaded a listner is created for a button
window.onload = function() {
    document.querySelector('#input-button').addEventListener("click", takeInput);
    document.querySelector('.click-info').addEventListener("click", showInfo);
};

// ------------------------------------------------------------------------------------
// Display Numeral info

function showInfo() {
    document.querySelector("#about-numerals").classList.toggle("about-numerals");
    document.querySelector(".down-arrow").classList.toggle("spin");
    document.querySelector("#about-numerals").scrollIntoView({behavior: 'smooth'});
}
//-------------------------------------------------------------------------------------------------

const romanArr = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V",
    "IV", "M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX",
    "V", "IV", "I"
];
const numberArr = [1000000, 900000, 500000, 400000, 100000, 90000, 50000, 40000,
    10000, 9000, 5000, 4000, 1000, 900, 500, 400, 100, 90, 50, 40,
    10, 9, 5, 4, 1
];

const romanArrSmall = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
const numberArrSmall = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];

//-----------------------------------------------------------------
// Number to Numeral

// determine if input is numbers or letters and greater than 0.
// and then - assign relevent function to deal with input
function takeInput(event) {
    event.preventDefault();

    let input = document.getElementById("input-field").value;
    if (isNaN(input)) {
        numeralsToNumbers(input);
    } else if (input <= 0) {
        alert("You must enter a number greater then zero.");
        document.getElementById("input-field").value = '';
    } {
        convertNumber(input);
    }
}

function convertNumber(num) {
    let answerArr = switchToNumerals(num);

    showResult1(num, answerArr);
}

function switchToNumerals(num) {
    //create variable that will hold the numerals for values over 4000 and values
    //less than 4000. so that when displaying them, an 'overscore' can show that
    //the value is a multiple of 1000.
    let answer = [
        [],
        []
    ];

    //work through the number and numeral arrays - subtracting the working amount
    //and adding the numerals to the answer array.
    numberArr.forEach(function(amount, i) {
        while (num >= amount && num >= 4000) {
            answer[0] += romanArr[i];
            num -= numberArr[i];
        }
        while (num >= amount && num < 4000) {
            answer[1] += romanArr[i];
            num -= amount;
        }
    });
    return answer;
}


//displays the result on the page only if the input is a number.
function showResult1(number, result) {
    if (number > 0) {
        let displayResults = `<p>${number} = <span style="text-decoration: overline">${result[0]}</span>${result[1]}</p>`;
        document.querySelector('#results').innerHTML = displayResults;
    }
}


//-------------------------------------------------------------------
// //convert it back....

//controller
function numeralsToNumbers(input) {

    if (checkForNumerals(input)) {
        //change numeral string into an array of letters
        let splitNumerals = breakAndCapitalise(input);
        //pair any numerals that belong together
        let orderedNumerals = pairNumerals(splitNumerals);
        //check to see that numerals are in a valid order
        if (checkNumeralOrder(orderedNumerals)) {
            let convertedAmount = changeNumeralsToNumbers(orderedNumerals);

            showResult2(input.toUpperCase(), convertedAmount);
        }
    }
}

// gets the numerals from the input field
function checkForNumerals(input) {

    //regex test for Roman Numerals
    const numeralRegex = /^[mdclxvi]*$/gi;
    if (!numeralRegex.test(input)) {
        alert("Please enter a valid roman numeral or number.");
        document.getElementById("input-field").value = '';
        return false;
    } else {
        return true;
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

//** perhaps refactor the function below to handle 'throw' errors and 'catch' functions.....????


function checkNumeralOrder(rom) {
    //array of Numerals in decending order of value
    const nonRepeaters = ["CM", "D", "CD", "XC", "L", "XL", "IX", "V", "IV"]
    const repeaters = ["C", "X", "I"]
    //condition1 is for values like 5 that can't be follwed by a 4. works for 5, 50 and 500
    const condition1 = (val1, val2, cond1, cond2) => romanArrSmall.indexOf(val1) ===
        cond1 && romanArrSmall.indexOf(val2) === cond2 && val2 !== undefined;
    //condition2 is for values like 9's and 4's. can't be followed by a 5,4 or 1.
    const condition2 = (val1, val2, cond1, cond2, cond3) => romanArrSmall.indexOf(val1) ===
        cond1 && romanArrSmall.indexOf(val2) < cond2 && val2 !== undefined ||
        romanArrSmall.indexOf(val1) === cond3 && romanArrSmall.indexOf(val2) < cond2 && val2 !== undefined;
    // condition 3 stops C,X or I being repeated more than three times in a row.
    const condition3 = (val1, val2, val3, val4) => repeaters.indexOf(val1) >= 0 &&
        val1 === val2 && val1 === val3 && val1 === val4;

    let correctOrderCounter = 0;

    //cycle through each value in the array. cross checking our given array with
    //an array of roman numerals in value order.
    for (let x = 0; x < rom.length; x++) {
        //if the value of the numeral is less than that of the next one in the array
        //then it is an invalid order - show an alert and clear input field
        if (romanArrSmall.indexOf(rom[x]) > romanArrSmall.indexOf(rom[x + 1]) && rom[x + 1] !== undefined) {
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
        else if (condition3(rom[x], rom[x + 1], rom[x + 2], rom[x + 3])) {
            alert("This is an invalid order of Roman Numerals. you cant repeat C,X or I more than three times.");
            wipeInput();
            break;
        } else {
            correctOrderCounter++;
        }
    }
    if (correctOrderCounter === rom.length) {
        return true;
    }
    return false;
}

//clears the input field
function wipeInput() {
    document.getElementById("input-field").value = '';
}


//using two arrays side by side convert the numerals to numbers
function changeNumeralsToNumbers(rom) {
    let arrIntoNumbers = [];

    rom.forEach(function(el) {
        let place = romanArrSmall.indexOf(el);
        arrIntoNumbers.push(numberArrSmall[place]);
    });

    //add up the values of the array
    const reducer = (acc, cur) => acc + cur;
    return arrIntoNumbers.reduce(reducer);
}

//display results in the DOM
function showResult2(rom, num) {
    if (num > 0) {
        let displayResults = `<p>${rom} = ${num}</p>`;
        document.querySelector('#results').innerHTML = displayResults;
    }
}
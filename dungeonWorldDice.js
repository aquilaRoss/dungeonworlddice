// JavaScript Document

let bruteForceNumber = 10000;

// If you add more options here, make sure you add them to generateOneRoll(*) as well
let rollOptions = [
	{"description": "Base Move (2D6)", 	"rollFunction":rollBasicMove},
	{"description": "D6+D8", 			"rollFunction":rollImprovedMove},
	{"description": "2D10 K1H", 		"rollFunction":roll2D10K1H},
	{"description": "1D4", 				"rollFunction":rollD4},
	{"description": "1D6", 				"rollFunction":rollD6},
	{"description": "1D8", 				"rollFunction":rollD8},
	{"description": "1D10", 			"rollFunction":rollD10},
	{"description": "1D12", 			"rollFunction":rollD12},
	{"description": "1D6,1D4 K1H", 		"rollFunction":rollD6D4KH1},
	{"description": "1D8,1D6 K1H", 		"rollFunction":rollD8D6KH1}
]

let modifierDice = [
	{"description": "",			"dieMaxResult": 0 },
	{"description": "+D4",		"dieMaxResult": 4 },
	{"description": "+D6",		"dieMaxResult": 6 },
	{"description": "+D8",		"dieMaxResult": 8 },
	{"description": "+D10",		"dieMaxResult": 10 },
	{"description": "+D12",		"dieMaxResult": 12 }
]

let flatModifier = { "minimum":-5, "maximum":5, "default":1  };

function rollBasicMove() { return (rollDie(6) + rollDie(6)); }
function rollImprovedMove() { return (rollDie(8) + rollDie(6)); }
function rollD4() { return rollDie(4); }
function rollD6() { return rollDie(6); }
function rollD8() { return rollDie(8); }
function rollD10() { return rollDie(10); }
function rollD12() { return rollDie(12); }
function roll2D10K1H() { return Math.max(rollDie(10), rollDie(10)); }
function rollD6D4KH1() { return Math.max(rollDie(6), rollDie(4)); }
function rollD8D6KH1() { return Math.max(rollDie(8), rollDie(6)); }

function getData()
{
  this.rollCode = parseInt(document.getElementById("rollIndex").value, 10);
  this.modifierDice = parseInt(document.getElementById("diceModifier").value, 10);
  this.flatModifier = parseInt(document.getElementById("flatModifier").value, 10);
  
  this.rollData = generateBruteForceData(this.rollCode, this.modifierDice, this.flatModifier);
}

function populateResults()
{
    var rawData = new getData();
    
    document.getElementById("averageResult").innerHTML = rawData.rollData.averageResult;
	
    document.getElementById("resultsTable").innerHTML = "";	
    document.getElementById("resultsTable").append(HTMLTableFromResults(rawData.rollData));
}

function HTMLTableFromResults(rollData)
{
	var tableObject = document.createElement('table');
	
	tableObject.setAttribute("class", "tg");
	
	const tr = tableObject.insertRow();
	tr.setAttribute("class", "tg-titleCell");
	
	const td_Result = tr.insertCell();
	td_Result.appendChild(document.createTextNode("Result"));
	
	const td_percent = tr.insertCell();
	td_percent.appendChild(document.createTextNode("%"));
	
	const td_atLeast = tr.insertCell();
	td_atLeast.appendChild(document.createTextNode("At Least %"));
	
	for (let row = (rollData.results.length - 1); row >= 0 ; row--)
	{
		if (rollData.results[row] != 0)
		{
			const tr = tableObject.insertRow();
			tr.setAttribute("class", "tg-smallCell");
			
			const tdValue = tr.insertCell();
			const tdPercent = tr.insertCell();
			const tdAtLeast = tr.insertCell();
			
			tdValue.appendChild(document.createTextNode(row));
			tdPercent.appendChild(document.createTextNode(rollData.percentage[row]));
			tdAtLeast.appendChild(document.createTextNode(rollData.atLeast[row]));
		}
	}
	
	return tableObject;
}

function generateBruteForceData(rollCode=0, modifierDice=0, flatModifier=0)
{
	this.cumilativeResult = 0;
	this.averageResult = 0;
	this.results = [];
	this.percentage = [];
	this.atLeast = [];
	
	for (let currentDie = 1; currentDie <= 100; currentDie++)
	{
		this.results.push(0);
		this.percentage.push(1);
		this.atLeast.push(2);
	}
	
	for (let currentDie = 1; currentDie <= bruteForceNumber; currentDie++)
	{
		var currentResult = generateOneRoll(rollCode, modifierDice, flatModifier);
		this.cumilativeResult += currentResult;
		this.results[currentResult] += 1;
	}
	
	this.averageResult = Math.round((this.cumilativeResult / bruteForceNumber) * 10) / 10;
  
	for (let row = 0; row < this.percentage.length ; row++)
	{
		if (this.results[row] != 0)
		{
			this.percentage[row] = Math.round(((this.results[row] / bruteForceNumber) * 100) * 10) / 10;
		}
	}
	
	var cumilativePercentage = 0;

	for (let row = (this.results.length - 1); row >= 0 ; row--)
	{
		if (this.results[row] != 0)
		{
			cumilativePercentage = Math.round((cumilativePercentage + this.percentage[row]) * 10) / 10;
			this.atLeast[row] = cumilativePercentage;
		}
	}
  
	return this;
}

function generateOneRoll(rollCode=0, modifierDice=0, flatModifier=0)
{
	var basicResult = rollOptions[rollCode].rollFunction();
	
	var rolledMod = rollDie(modifierDice);
	
	return (basicResult + flatModifier + rolledMod);
}

function setupDefaultSelections()
{
	var diceSelectBox = document.getElementById("rollIndex");	
	for (let currentOption = 0; currentOption < rollOptions.length; currentOption++)
	{
		var newOption = new Option(rollOptions[currentOption].description, currentOption);
		diceSelectBox.add(newOption, undefined);
	}
	diceSelectBox.value = 0;
	
	var flatModfierSelectBox = document.getElementById("flatModifier");	
	for (let currentValue = flatModifier.minimum; currentValue <= flatModifier.maximum; currentValue++)
	{
		var newOption = new Option(currentValue, currentValue);
		flatModfierSelectBox.add(newOption, undefined);
	}
	flatModfierSelectBox.value = flatModifier.default;
	
	var diceModfierSelectBox = document.getElementById("diceModifier");	
	for (let currentOption = 0; currentOption < modifierDice.length; currentOption++)
	{
		var newOption = new Option(modifierDice[currentOption].description, currentOption);
		diceModfierSelectBox.add(newOption, undefined);
	}
	diceModfierSelectBox.value = 0;
}

function bodyLoad()
{
	setupDefaultSelections();
	
	populateResults();
  
	currentTestFunction();
}

function randomIntFromInterval(min, max)
{
	var returnValue = 1;
	returnValue = Math.floor(Math.random()*(max-min+1)+min);
	//console.log("Random Number in Range " + min + " to " + max + " of " + returnValue);
	return returnValue;
}

function rollDie(max=6)
{
	if (max < 1)
	{
		return 0;
	}
	else
	{
		var dieResult = randomIntFromInterval(1, max);
		//console.log("dieResult: " + dieResult);

		var returnValue = dieResult;
		//console.log("returnValue: " + returnValue);

		//console.log("final returnValue: " + returnValue);
		return returnValue;
	}
}

function bruteForceAverageRoll(skill, dice)
{
	var cumilativeResult = 0;
	var averageResult = 0;
	for (let currentDie = 1; currentDie <= bruteForceNumber; currentDie++)
	{
		cumilativeResult += rollSkill(skill, dice);
	}
	averageResult = cumilativeResult / bruteForceNumber;
	
	//console.log("Rolling : " + bruteForceNumber + " times gives an average roll of : " + averageResult);
	return averageResult;
}

function currentTestFunction()
{
	
}




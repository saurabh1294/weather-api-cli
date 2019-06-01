'use strict';

let fs = require('fs');
let readline = require('readline');
let jsonParser = require('./utils/json-parser.js');
let csvToJson = require('./utils/csv-to-json.js');

const data = csvToJson.readFile('weather_data.csv');
const json = csvToJson.buildJSONfromCSV(data);
// const year = 2019;	//change this as per need
let year = '';
let input;

/*let rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});*/

let stdin = process.openStdin();

// Prompt user to input data in console.
console.log("Enter the year (between 1858-2019) for which you want to get the data. Press Ctrl C after input!!");
/*rl.prompt();

rl.on('line', function(cmd) {
	input = year = cmd;
	
	console.log('\n\nGetting weather data for year', year, 'and writing to json file\n');
	// get yearly data for input year
	csvToJson.writeJSONToFile(JSON.stringify(jsonParser.getWeatherDataForYear(year, json), null, 4), 'year-'+year+'.json');
	
	console.log('Converting weather.csv to JSON and writing to weather.json file\n');
	// Get weather data for given year
	csvToJson.writeJSONToFile(`${JSON.stringify(json, null, 4)}`, './weather.json');
	
	console.log('Get all time weather data from the JSON file and write to allyears.json\n');
	// Get all time weather data
	csvToJson.writeJSONToFile(JSON.stringify(jsonParser.getAllTimeWeatherData(json), null, 4), './allyears.json');
	
	console.log('Hit Ctrl+C to exit!!!');
});*/


stdin.addListener("data", function(input) {
	year = input.toString().replace(/\r?\n/, '');
	
	console.log('\n\nGetting weather data for year', year, 'and writing to json file\n');
	// get yearly data for input year
	csvToJson.writeJSONToFile(JSON.stringify(jsonParser.getWeatherDataForYear(year, json), null, 4), 'year-'+year+'.json');
	
	console.log('Converting weather.csv to JSON and writing to weather.json file\n');
	// Get weather data for given year
	csvToJson.writeJSONToFile(`${JSON.stringify(json, null, 4)}`, './weather.json');
	
	console.log('Get all time weather data from the JSON file and write to allyears.json\n');
	// Get all time weather data
	csvToJson.writeJSONToFile(JSON.stringify(jsonParser.getAllTimeWeatherData(json), null, 4), './allyears.json');
	
	setTimeout( ()=> {
		console.log("Enter the year (between 1858-2019) for which you want to get the data or Press Ctrl C after input!!");
	}, 2000);
});






 



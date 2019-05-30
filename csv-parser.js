'use strict';

let fs = require('fs');
let jsonParser = require('./utils/json-parser.js');
let csvToJson = require('./utils/csv-to-json.js');

const data = csvToJson.readFile('weather_data.csv');
const json = csvToJson.buildJSONfromCSV(data);
const year = 2019;	//change this as per need

// Get weather data for given year
csvToJson.writeJSONToFile(`${JSON.stringify(json, null, 4)}`, './weather.json');
// Get all time weather data
csvToJson.writeJSONToFile(JSON.stringify(jsonParser.getAllTimeWeatherData(json), null, 4), './allyears.json');

csvToJson.writeJSONToFile(JSON.stringify(jsonParser.getWeatherDataForYear(year, json), null, 4), 'year-'+year+'.json');	// get yearly data for 2019

 



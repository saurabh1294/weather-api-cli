'use strict';
let csvToJson = require('./csv-to-json.js');

// JSON parser utility class to parse weather JSON and return the desired output JSON
class JSONParser {
	/**
	 * @method 		isLeapYear
	 * @description This function checks if the given year is leap or not
	 * @json 		{number} input year to be checked
	 * @return      {boolean} true if the given year is a leap year else false
	 */
	isLeapYear(year) {
		return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
	}
	
	/**
	 * @method 		getWeatherDataForYear
	 * @description This function returns Sydney BOM weather data for a particular year
	 * @year 		{number} the year to be searched for in the JSON object
	 * @return      {object} JSON object containing given year calculated rain statistic data.
	 */
	getWeatherDataForYear(year, json) {
		return this.collateYearlyData(csvToJson.getJSONByKeyVal(json['WeatherData']['WeatherDataForYear'], 
		'Year', year.toString()));
	}

	/**
	 * @method 		getAllTimeWeatherData
	 * @description This function returns all time Sydney BOM weather data until current year.
	 * @json 		{object} the json object or array to be searched into.
	 * @return      {object} JSON object containing all year calculated rain statistic data.
	 */
	getAllTimeWeatherData(json) {
		let allJSONData = {
			'WeatherData': {
				'WeatherDataForYear': []
			}
		};
		let index = 0;
		let innerJSON = json['WeatherData']['WeatherDataForYear'];
		let startYear = innerJSON[0].Year;
		let endYear = innerJSON[innerJSON.length - 1].Year;
		
		for (let year = startYear; year <= endYear; year++) {
			let offset = this.isLeapYear(year) ? 366 : 365;	// number of days in a year
			allJSONData['WeatherData']['WeatherDataForYear'].push(this.collateYearlyData(
			json['WeatherData']['WeatherDataForYear'].slice(index, index + offset)));
			index += offset;
		}

		return allJSONData;
	}

	/**
	 * @method 			calculateRainStats
	 * @description 	This function calculates the interested rain stats for entire year or month
	 * @queryResultJSON {object} the json object or array to be searched into
	 * @queryMonth      {string} value indicating query for month if passed. Defaults to a particular year
	 * @return      	{Array} This array will be an output param containing all rain statistics we want
	 */
	calculateRainStats(queryResultJSON, queryMonth = null) {
		let rainStats = [],
			months = ['January', 'February', 'March',
				'April', 'May', 'June', 'July', 'August', 'September', 'October',
				'November', 'December'
			];
		let json = (!queryMonth) ? queryResultJSON : csvToJson.getJSONByKeyVal(queryResultJSON, 'Month', queryMonth);
		let totalRainfall = 0.0, avgRainfall = 0.0,
			daysWithRainfall = 0.0, daysWithNoRainfall = 0.0;

		if (json.length === 0) return json; // if record not found

		const year = json[0].Year;
		const firstRecordedDate = `${json[0].Year}-${json[0].Month}-${json[0].Day}`;
		const lastRecordedDate = `${json[json.length-1].Year}-${json[json.length-1].Month}-${json[json.length-1].Day}`;

		for (let i = 0; i < json.length; i++) {
			let rainQty = parseFloat(json[i]['Rainfall amount (millimetres)']);
			totalRainfall += !isNaN(rainQty) ? rainQty : 0;
			// defensive check in case if rainQty is a blank entry and not a number
			if (!isNaN(rainQty)) {
				if (rainQty > 0) {
					daysWithRainfall++;
				} else {
					daysWithNoRainfall++;
				}
			} else {
				daysWithNoRainfall++;
			}
			avgRainfall = totalRainfall / (daysWithRainfall + daysWithNoRainfall);
		}

		if (!queryMonth) rainStats.push(year);
		if (queryMonth) rainStats.push(months[parseInt(queryMonth) - 1]);
		rainStats.push(firstRecordedDate);
		rainStats.push(lastRecordedDate);
		rainStats.push(totalRainfall);
		rainStats.push(avgRainfall);
		rainStats.push(daysWithNoRainfall);
		rainStats.push(daysWithRainfall);
		return rainStats;
	}

	/**
	 * @method 			collateYearlyData
	 * @description 	This function creates the neccessary JSON structure for year and then MonthlyAggregates if applicable
	 * @queryResultJSON {object} the json object or array to be searched into and calculate the rain stats
	 * @return      	{object} JSON output object in the desired format
	 */
	collateYearlyData(queryResultJSON) {
		let totalRainfall = 0.0,
			avgRainfall = 0.0,
			daysWithRainfall = 0,
			daysWithNoRainfall = 0;
		let data = [],
			obj = {};


		data = this.calculateRainStats(queryResultJSON);

		obj['Year'] = data[0];
		obj['FirstRecordedDate'] = data[1];
		obj['LastRecordedDate'] = data[2];
		obj['TotalRainfall'] = data[3];
		obj['AverageDailyRainfall'] = data[4];
		obj['DaysWithNoRainfall'] = data[5];
		obj['DaysWithRainfall'] = data[6];

		if (data && data.length)
			obj['MonthlyAggregates'] = {
				'WeatherDataForMonth': []
			};


		for (let m = 1; m <= 12; m++) {
			data = this.calculateRainStats(queryResultJSON, (m < 10) ? `0${m}` : `${m}`); // handle for all months here
			if (data && data.length) {
				let monthObj = {
					'Month': data[0],
					'FirstRecordedDate': data[1],
					'LastRecordedDate': data[2],
					'TotalRainfall': data[3],
					'AverageDailyRainfall': data[4],
					'DaysWithNoRainfall': data[5],
					'DaysWithRainfall': data[6]
				};
				obj['MonthlyAggregates']['WeatherDataForMonth'].push(monthObj);
			}
		}

		return obj;
	}
}

module.exports = new JSONParser();
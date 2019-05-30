'use strict';
let fs = require('fs');
const delimiter = /[;,]/;

// Utility class to read CSV file and convert to JSON
class CSVToJSON {
	
	/**
	 * @method 			readFile
	 * @description 	Reads the file referred to by fileName
	 * @fileName 		{string} name of file to read
	 * @return      	{string} file data as string
	 */
	readFile(fileName) {
		try {
			return fs.readFileSync(fileName).toString();
		} catch (err) {
			console.log('Can\'t read file', err);
			throw err;
		}
	}
	
	/**
	 * @method 			buildJSONfromCSV
	 * @description 	Reads the file content as string and builds a JSON object
	 * @fileData 		{string} file content as string
	 * @return      	{string} JSON object created from the CSV file data string
	 */
	buildJSONfromCSV(fileData) {
		let fileLines = fileData.split(/\r?\n/);
		let headers = fileLines[0].split(delimiter);
		let jsonArr = [];
		let jsonOutput = {};
		let finalJSON = {};

		for (let i = 1; i < fileLines.length; i++) {
			let line = fileLines[i];
			if (line && line.length > 0) {
				jsonArr.push(this.fillJSON(headers, line.split(delimiter)));
			}
		}

		jsonOutput['WeatherDataForYear'] = jsonArr;
		finalJSON['WeatherData'] = jsonOutput;

		return finalJSON;
	}

	/**
	 * @method 		fillJSON
	 * @description constructs JSON object with key value pairs
	 * @headers 	{Array} Array of strings containing CSV headers to be used as json keys
	 * @lines 		{Array} Array of strings containing CSV lines (values) to be used as json
	 *				values corresponding to the keys.
	 * @return      {object} JSON object created from the CSV file headers and lines of strings.
	 */
	fillJSON(headers, lines) {
		let json = {};
		// Skip the top row (start at index 2) as it contains the headers only
		for (let i = 2; i < headers.length; i++) {
			const property = headers[i];
			if (property) {
				json[property] = (lines[i].length) ? lines[i] : 0;
			}
		}
		return json;
	}

	/**
	 * @method 			writeJSONToFile
	 * @description 	Takes the JSON object and writes to a file.
	 * @json 			{object} JSON object.
	 * @outFile 		{string} Name of the output file which will contain the JSON object.
	 */
	writeJSONToFile(json, outFile) {
		fs.writeFile(outFile, json, function(err) {
			if (err) {
				throw err;
			} else {
				console.log('File saved: ' + outFile);
			}
		});
	}

	/**
	 * @method			getJSONByKeyVal
	 * @description		[searches for a key recursively and returns it if it's value matches passed param value]
	 * @param  			{object} JSON object to search
	 * @param 			{string} key to search for in JSON by RegEx
	 * @return 			{object} matched json value by key. NULL if key not found.
	 */
	getJSONByKeyVal(object, key, value, output = []) {
		let result = null;
		for (let i in object) {
			if (!!object[i] && typeof(object[i]) === "object") {
				if (typeof object[i][key] && object[i][key] == value) {
					output.push(object[i]);
				} else {
					this.getJSONByKeyVal(object[i], key, value, output); // recursive call
				}
			}
		}
		return output;
	}
}

module.exports = new CSVToJSON();
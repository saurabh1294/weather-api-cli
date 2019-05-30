# weather-api-cli
A CLI (backend) NodeJS app for weather API from BOM (Sydney)

# Running instructions
Copy weather-data-csv from BOM website 
http://www.bom.gov.au/jsp/ncc/cdio/weatherData/av?p_nccObsCode=136&p_display_type=dailyDataFile&p_startYear=&p_c=&p_stn_num=066062

Install nodejs from https://nodejs.org
Clone this repo and run node csv-parser.js, three files are created weather.json (JSON representation of the CSV, allyears.json
which contains collated rain stats for all years since 1858 and year-<year>.json where year is the actual year you want the json
rain stats for.). All these will have complete output of the API in the desired format.

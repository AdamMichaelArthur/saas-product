import { Base, ResponseError } from '@base'
import axios from 'axios';

export default class Imports extends Base {

	constructor(){
		super();
	}

	async preflight(googleSheetsUrl =""){

		this.preflight.timeout = 0;

		// This will cause the sheet to be downloaded as a flat csv file
		googleSheetsUrl += "/gviz/tq?tqx=out:csv";

		var csvData = "";

		try {
			csvData = await this.downloadGoogleSheet(googleSheetsUrl);
			csvData = this.getLast15LinesWithHeader(csvData);
		} catch(err){
			return false;
		}

		this.response.reply(csvData);

		return true;
	}

	async importVehicles(googleSheetsUrl =""){
		this.response.reply("Import Started");
	}

	async downloadGoogleSheet(googleSheetsUrl) {
	  try {
	    const response = await axios.get(googleSheetsUrl, {


	      responseType: 'text'
	    });
	    return response.data; // CSV data
	  } catch (error) {
	    console.error('Error downloading Google Sheet:', error);
	 }
	}

	getLast15LinesWithHeader(csvData) {
	  const rows = csvData.trim().split('\n');
	  const header = rows[0].split(',').map(cell => cell.trim().replace(/^"|"$/g, '')); // Remove quotes from header cells
	  const last15Rows = rows.slice(-15); // Get the last 15 rows

	  const jsonData = last15Rows.map(row => {
	    const values = row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')); // Remove quotes from each cell
	    let obj = {};
	    header.forEach((key, index) => {
	      obj[key] = values[index] || null; // Assign each value to the corresponding header key
	    });
	    return obj;
	  });

	  return jsonData;
	}

	csvToJson(csvData) {
	  const rows = csvData.trim().split('\n');
	  const header = rows[0].split(',').map(cell => cell.trim().replace(/^"|"$/g, '')); // Remove quotes from header cells

	  const jsonData = rows.map(row => {
	    const values = row.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')); // Remove quotes from each cell
	    let obj = {};
	    header.forEach((key, index) => {
	      obj[key] = values[index] || null; // Assign each value to the corresponding header key
	    });
	    return obj;
	  });

	  return jsonData;
	}

	getLast15Lines(csvData) {
  		const rows = csvData.trim().split('\r\n');
  		const last15Rows = rows.slice(-15); // Get the last 15 rows
  		return {
    		lines: last15Rows.map(row => row.split(',')) // Split each row into columns
  		};
	}

	async importVehicles(googleSheetsUrl =""){

		googleSheetsUrl += "/gviz/tq?tqx=out:csv";

		var csvData = "";

		try {
			csvData = await this.downloadGoogleSheet(googleSheetsUrl);
			csvData = this.csvToJson(csvData);
		} catch(err){
			return false;
		}

		let sqlStmts = this.jsonToSql(csvData);

		this.response.reply(sqlStmts);
	}	

	jsonToSql(rowsAr) {
	    const sqlStatements = rowsAr.map(row => {
	        const columns = Object.keys(row).join(', ');
	        const values = Object.values(row).map(value => 
	            typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value
	        ).join(', ');

	        return `INSERT INTO vehicles (${columns}) VALUES (${values});`;
	    });

	    return sqlStatements;
	}

}

const googleSheetsUrl = 'https://docs.google.com/spreadsheets/d/1b-NgMNHJV1Ypjoc8EETZ6cckWkJgvrckpAxju-Q_J7U/gviz/tq?tqx=out:csv';

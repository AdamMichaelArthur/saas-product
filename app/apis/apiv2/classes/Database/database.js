import Base from '@base'

/*
	Database agnostic function calls
*/

export default class DatabaseConnection extends Base {

	databaseProvider = process.env.DB;

	constructor(){
		super();
	}


	
}

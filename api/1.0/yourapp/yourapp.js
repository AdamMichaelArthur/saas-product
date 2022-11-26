import Base from '../../../classes/Base/base.js'

export default class DataRova extends Base {

	route = "yourapp";
	class = 'yourapp';

	exampleData = {
		"Test":true
	}

	constructor(initializers =null){
		super(initializers);
	}

	demo(){
		const hasRequiredParameters = this.requiredParams([], []);
		if(!hasRequiredParameters){
			return;
		}

		this.response.reply( this.exampleData )

	}

}

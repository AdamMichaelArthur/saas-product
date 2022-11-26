import Base from '../../../../classes/Base/base.js'

export default class Callbacks extends Base {

	exampleData = {
		"Working":true
	}

	constructor(initializers =null, route ='', className =''){
		super(initializers, route, className);
	}

	demo(){
		const hasRequiredParameters = this.requiredParams([], []);
		if(!hasRequiredParameters){
			return;
		}

		this.response.reply( this.exampleData )

	}

}

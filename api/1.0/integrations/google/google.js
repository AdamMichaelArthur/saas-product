import Base from '../../../../classes/Base/base.js'

export default class Google extends Base {

	constructor(initializers =null, route =null, className =null){
		if((route == null)&&(className == null)){
			super(initializers, "/integrations/google/", "google");	
		} else {
			super(initializers, route, className);
	}

	}

	async getGoogleToken(){
		var tokens = await this.database.tables.googleTokens.getAllTokens();
		return this.response.reply(tokens);
	}


}
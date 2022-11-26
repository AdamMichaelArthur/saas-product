import Base from '../../../../classes/Base/base.js'

export default class Example extends Base {

	route = "yourapp/example";
	class = 'settings';

	exampleData = {
		"Working":true
	}

	constructor(initializers =null){
		super(initializers);
	}

	async demo(){
		const hasRequiredParameters = this.requiredParams([], []);
		if(!hasRequiredParameters){
			return;
		}

		var results = await this.database.rawQuery('SELECT * FROM "public"."asins" ORDER BY "asin" LIMIT 10 OFFSET 0;');

		this.response.reply( { "results": results } )

	}

}
